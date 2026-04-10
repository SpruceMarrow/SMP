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
    for i in rec:
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
    cursor.execute(f'UPDATE bal set Balance= {bal-0.1}')
    cursor.execute(f"UPDATE port set BuyBal= {bal-0.1} WHERE Name = '{tick}'")
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

async def check(ca,tick,fdv):
    n=0
    sql = psycopg2.connect(DBURL)
    cursor = sql.cursor()
    while n<288:
        async with aiohttp.ClientSession() as session:
            async with aiohttp.get(f'https://api.dexscreener.com/tokens/v1/solana/{ca}',headers={"Accept":"*/*"}) as resp:
                data = await resp.json()
                if list(data)[0]['fdv'] >= 2*fdv:
                    final = list(data)[0]['fdv']
                    cursor.execute(f'UPDATE port set Final={final} WHERE Name = {tick}')
                    sellbal(final,fdv,tick)
                    sql.commit()
                    break
                if n==287:
                    cursor.execute(f'DELETE FROM port WHERE Name = {tick}')
                    sql.commit()
                else:
                    await asyncio.sleep(300)
        
        n+=1
    sql.close()
        
        

app = Flask(__name__)
CORS(app)

@app.route('/')
def main():
        btc,eth,sol= fetch()
        return render_template('main.html',sol=sol,eth=eth,btc=btc)

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
                sql.close()
                for i in list1:
                    for j in i:
                        calist.append(j)
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
                        asyncio.create_task(check(ca,tick,fdv))
    
                
        

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



    

