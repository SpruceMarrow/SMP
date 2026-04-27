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
import threading
from apscheduler.schedulers.background import BackgroundScheduler
semaphore = threading.Semaphore(70)

DBURL = os.environ["DATABASE_URL"]

def worker(ca,tick,fdv):
    try:
        check(ca,tick,fdv)
    finally:
        semaphore.release()

def check_all_positions():
    """Check all open positions every 5 minutes"""
    sql = psycopg2.connect(DBURL)
    cursor = sql.cursor()
    cursor.execute("SELECT CA, Name, Initial FROM port WHERE Final IS NULL")  # Only check open positions
    positions = cursor.fetchall()
    sql.close()
    
    for ca, tick, fdv in positions:
        semaphore.acquire()
        thread = threading.Thread(target=worker, args =(ca, tick, fdv), daemon=True)
        thread.start()


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
    cursor.execute(f"UPDATE port set BuyBal= BuyBal-0.1 WHERE Name = '{tick}'")
    cursor.execute(f'UPDATE bal set Balance= Balance-0.1')
    sql.commit()
    sql.close()

    
def sellbal(final,fdv,tick):
    sql = psycopg2.connect(DBURL)
    cursor = sql.cursor()
    cursor.execute(f'UPDATE bal set Balance= Balance+{(0.1*(final-fdv)/fdv)}')
    cursor.execute(f"UPDATE port set SellBal= SellBal+{(0.1*(final-fdv)/fdv)} WHERE Name = '{tick}'")
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
    l = {}
    res = requests.get(url, params=parameters,headers={'X-CMC_PRO_API_KEY': "18cc6530935245e48a2327569ff067f9"})
    data = res.json()
    for i in data['data']:
        l[i.lower()] = round(data['data'][i]['quote']['USD']['price'],1)
    return l

def hfetch(curr):
    response = requests.get('https://data-api.coindesk.com/spot/v1/historical/days',
    params={"market":"kraken","instrument":f"{curr}-USD","limit":10,"aggregate":1,"fill":"true","apply_mapping":"true","response_format":"JSON","api_key":"3318b81f3e11391668abf4c54800baf9067c6c643921c68ae47628b18aa4e131"},
    headers={"Content-type":"application/json; charset=UTF-8"}
)
    data = response.json()
    return data

def check(ca,tick,fdv):
    print("Checking")
    resp = requests.get(f'https://api.dexscreener.com/tokens/v1/solana/{ca}',headers={"Accept":"*/*"},timeout=10)
    data = resp.json()
    if data[0]['fdv'] >= 2*fdv:
        final = data[0]['fdv']
        sql = psycopg2.connect(DBURL)
        cursor = sql.cursor()
        cursor.execute(f"UPDATE port set Final={final} WHERE Name = '{tick}'")
        sellbal(final,fdv,tick)
        sql.commit()
        sql.close()
    
        

app = Flask(__name__)
CORS(app)

scheduler = BackgroundScheduler()
scheduler.add_job(func=check_all_positions, trigger="interval", minutes=5)
scheduler.start()

@app.route('/')
def main():
        return 'what youre probably looking for is https://frontend-muai.onrender.com/'

@app.post('/helius')
def helius():
    hreq = list(request.get_json())
    for tx in hreq:
        for mints in tx['tokenTransfers']:
            if mints['mint'].endswith('pump'):
                sql = psycopg2.connect(DBURL)
                cursor = sql.cursor()
                ca = mints['mint']
                response = requests.get(f'https://api.dexscreener.com/tokens/v1/solana/{ca}', headers={"Accept": "*/*"})
                if response.status_code != 200:
                    print(f"API error for {ca}: {response.status_code} - {response.text}")
                    continue  
                try:
                    data = list(response.json())
                except requests.exceptions.JSONDecodeError as e:
                    print(f"JSON decode error for {ca}: {e} - Response: {response.text}")
                    continue
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
                amount = 0
                nativetransfers = tx['nativeTransfers'][0] if tx['nativeTransfers'] else {amount : 0}
                amount = nativetransfers['amount'] / 1e9 if tx['nativeTransfers'] else 0
                print(f'{tick} {fdv} {amount}')
                if fdv>80000 and amount>1:
                    print(f'{tick} {fdv} {amount}')
                    if tick not in calist:
                        add(tick,fdv,ca)
                        buybal(tick)
    
                
        

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
    d = fetch()
    return jsonify(d)

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



    

