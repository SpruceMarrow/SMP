import asyncio
from flask import Flask, render_template, url_for, jsonify
from flask import request 
from flask_cors import CORS
import psycopg2
from psycopg2 import pool
import requests
import json
import os
from functools import partial
import aiohttp
import threading
from apscheduler.schedulers.background import BackgroundScheduler
semaphore = threading.Semaphore(20)

DBURL = os.environ["DATABASE_URL"]

db_pool = psycopg2.pool.ThreadedConnectionPool(1,80,DBURL)

def get_db():
    return db_pool.getconn()

def return_db(conn):
    db_pool.putconn(conn)

def worker(ca,tick,fdv):
    try:
        check(ca,tick,fdv)
    finally:
        semaphore.release()

def check_all_positions():
    """Check all open positions every 5 minutes"""
    sql = get_db()
    cursor = sql.cursor()
    cursor.execute("SELECT CA, Name, Initial FROM port WHERE SellBal IS NULL")  # Only check open positions
    positions = cursor.fetchall()
    cursor.close()
    return_db(sql)
    
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
    sql = get_db()
    cursor = sql.cursor()
    cursor.execute("SELECT Name,Initial,CA FROM port")
    rec = list(cursor.fetchall())
    cursor.close()
    l=[]
    for i in rec[-1:-11:-1]:
        l.append({"tick":i[0],"fdv":i[1],"ca":i[2]})
    return_db(sql)
    return l
    

def getbal():
    sql = get_db()
    cursor = sql.cursor()
    cursor.execute("SELECT Balance FROM bal")
    rec = list(cursor.fetchall())
    cursor.close()
    bal = rec[0][0]
    return_db(sql)
    return bal
    



def buybal(tick):
    sql = get_db()
    cursor = sql.cursor()
    cursor.execute(f"UPDATE port set BuyBal= COALESCE(BuyBal,0)-0.1 WHERE Name = '{tick}'")
    cursor.execute(f'UPDATE bal set Balance= Balance-0.1')
    sql.commit()
    cursor.close()
    return_db(sql)

    
def sellbal(final,fdv,tick):
    sql = get_db()
    cursor = sql.cursor()
    cursor.execute(f'UPDATE bal set Balance= Balance+{(0.1*(final-fdv)/fdv)}')
    cursor.execute(f"UPDATE port set SellBal= COALESCE(SellBal,0)+{(0.1*(final-fdv)/fdv)} WHERE Name = '{tick}'")
    sql.commit()
    cursor.close()
    return_db(sql)


def add(tick,fdv,ca):
    sql = get_db()
    cursor = sql.cursor()
    cursor.execute(f"INSERT INTO port (Name,Initial,CA) values ('{tick}',{fdv},'{ca}')")
    sql.commit()
    cursor.close()
    return_db(sql)

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
    if resp.status_code == 429:
        print("Rate limit")
    if data:
        if data[0]['fdv'] >= 2*fdv:
            final = data[0]['fdv']
            sql = get_db()
            cursor = sql.cursor()
            cursor.execute(f"UPDATE port set Final={final} WHERE Name = '{tick}'")
            sellbal(final,fdv,tick)
            sql.commit()
            cursor.close()
            return_db(sql)
    else:
        print("Somethings wrong")
    
        

app = Flask(__name__)
CORS(app)

scheduler = BackgroundScheduler()
scheduler.add_job(func=check_all_positions, trigger="interval", minutes=30)
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
                sql = get_db()
                cursor = sql.cursor()
                ca = mints['mint']
                response = requests.get(f'https://api.dexscreener.com/tokens/v1/solana/{ca}', headers={"Accept": "*/*"})
                if response.status_code != 200:
                    print(f"API error for {ca}: {response.status_code} - {response.text}")
                    return_db(sql)
                    continue  
                try:
                    data = list(response.json())
                except requests.exceptions.JSONDecodeError as e:
                    print(f"JSON decode error for {ca}: {e} - Response: {response.text}")
                    return_db(sql)
                    continue
                print(f'data is {data}')
                cursor.execute('SELECT Name FROM port')
                calist=[]
                list1 = list(cursor.fetchall())
                cursor.execute('SELECT CA FROM port')
                list2 = list(cursor.fetchall())
                cursor.close()
                return_db(sql)
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



    

