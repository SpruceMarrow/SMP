import asyncio
from flask import Flask, render_template, url_for, jsonify
from flask import request 
from flask_cors import CORS
import psycopg2
import requests
import json
import os
from functools import partial
import aiohttp

DBURL = os.environ["DATABASE_URL"]

def getprices(items):
    l = []
    for i in items:
        response = requests.get(f'https://api.dexscreener.com/tokens/v1/solana/{i["ca"]}',headers={"Accept":"*/*"})
        data = list(response.json())
        l.append(data[0]["fdv"])
    return l

def getitems():
    sql = psycopg2.connect(DBURL)
    cursor = sql.cursor()
    cursor.execute("SELECT Name,Initial,CA FROM port")
    rec = list(cursor.fetchall())
    l=[]
    for i in rec[-1:-11:-1]:
        l.append({"tick":i[0],"fdv":i[1],"ca":i[2]})
    sql.close()
    return l
    

def getbal():
    sql = psycopg2.connect(DBURL)
    cursor = sql.cursor()
    cursor.execute("SELECT Balance FROM bal")
    rec = list(cursor.fetchall())
    bal = rec[0][0]
    sql.close()
    return bal
    



def buybal(tick):
    sql = psycopg2.connect(DBURL)
    cursor = sql.cursor()
    bal = getbal()
    cursor.execute(f"UPDATE port set BuyBal= {bal-0.1} WHERE Name = '{tick}'")
    cursor.execute(f'UPDATE bal set Balance= {bal-0.1}')
    sql.commit()
    sql.close()

    
def sellbal(final,fdv,tick):
    sql = psycopg2.connect(DBURL)
    cursor = sql.cursor()
    bal = getbal()
    cursor.execute(f'UPDATE bal set Balance= {bal+(0.1*(final-fdv)/fdv)}')
    cursor.execute(f"UPDATE port set SellBal= {bal+(0.1*(final-fdv)/fdv)} WHERE Name = '{tick}'")
    sql.commit()
    sql.close()


def add(tick,fdv,ca):
    sql = psycopg2.connect(DBURL)
    cursor = sql.cursor()
    cursor.execute(f"INSERT INTO port (Name,Initial,CA) values ('{tick}',{fdv},'{ca}')")
    sql.commit()
    sql.close()

def fetch():
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
    parameters = {
    'symbol': 'ETH,SOL,BTC',
    'convert': 'USD'
    }
    l = []
    res = requests.get(url, params=parameters,headers={'X-CMC_PRO_API_KEY': "18cc6530935245e48a2327569ff067f9"})
    data = res.json()
    for i in data['data']:
        l.append(round(data['data'][i]['quote']['USD']['price'],1))
    return l

def hfetch(curr):
    response = requests.get('https://data-api.coindesk.com/spot/v1/historical/days',
    params={"market":"kraken","instrument":f"{curr}-USD","limit":10,"aggregate":1,"fill":"true","apply_mapping":"true","response_format":"JSON","api_key":"3318b81f3e11391668abf4c54800baf9067c6c643921c68ae47628b18aa4e131"},
    headers={"Content-type":"application/json; charset=UTF-8"}
)
    data = response.json()
    return data

async def check(ca,tick,fdv):
    sql = psycopg2.connect(DBURL)
    cursor = sql.cursor()
    print("Checking")
    async with aiohttp.ClientSession() as session:
            async with aiohttp.get(f'https://api.dexscreener.com/tokens/v1/solana/{ca}',headers={"Accept":"*/*"}) as resp:
                data = await resp.json()
                if data[0]['fdv'] >= 2*fdv:
                    final = data[0]['fdv']
                    cursor.execute(f'UPDATE port set Final={final} WHERE Name = {tick}')
                    sellbal(final,fdv,tick)
                    sql.commit()
    sql.close()
        
        

app = Flask(__name__)
CORS(app)

@app.route('/')
def main():
        return 'what youre probably looking for is https://frontend-muai.onrender.com/'

@app.post('/helius')
def helius():
    sql = psycopg2.connect(DBURL)
    cursor = sql.cursor()
    hreq = list(request.get_json())
    for tx in hreq:
        for mints in tx['tokenTransfers']:
            if mints['mint'].endswith('pump'):
                ca = mints['mint']
                response = requests.get(f'https://api.dexscreener.com/tokens/v1/solana/{ca}',headers={"Accept":"*/*"})
                data = list(response.json())
                print(f'data is {data}')
                cursor.execute('SELECT Name FROM port')
                calist=[]
                list1 = list(cursor.fetchall())
                cursor.execute('SELECT CA FROM port')
                list2 = list(cursor.fetchall())
                sql.close()
                for i in list1:
                    calist.append(i[0])
                newdata = data or [{'baseToken':{'symbol':' '},'fdv':0}]
                tick = newdata[0]['baseToken']['symbol']
                fdv = newdata[0]['fdv']
                nativetransfers = tx['nativeTransfers'][0] or 0
                amount = nativetransfers['amount'] / 1e9
                print(f'{tick} {fdv} {amount}')
                if fdv>80000 and amount>1:
                    print(f'{tick} {fdv} {amount}')
                    if tick not in calist:
                        add(tick,fdv,ca)
                        buybal(tick)
                        for i in list2:
                            asyncio.create_task(check(i[0],tick,fdv))
    
                
        

    return 'received'

@app.route('/bot')
async def bot():
    loop = asyncio.get_event_loop()
    balance, items, (btc,eth,sol) = await asyncio.gather(
        loop.run_in_executor(None,getbal),
        loop.run_in_executor(None,getitems),
        loop.run_in_executor(None,fetch))
    cur = await loop.run_in_executor(None,partial(getprices,items))
    fdvs = [i["fdv"] for i in items]
    inc = [round(((cur-fdv)/fdv)*100,2) for cur,fdv in zip(cur,fdvs)]
    return jsonify({"items":[items,balance,eth,sol,btc,cur,fdvs,inc]})

@app.route('/api')
def api():
    btc,eth,sol = fetch()
    return jsonify({"btc":btc,"eth":eth,"sol":sol})

@app.route('/api/historicalbtc')
def histb():
    data = hfetch("BTC")
    return jsonify(data)

@app.route('/api/historicaleth')
def histe():
    data = hfetch("ETH")
    return jsonify(data)

@app.route('/api/historicalsol')
def hists():
    data = hfetch("SOL")
    return jsonify(data)



    

