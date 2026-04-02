import asyncio
from flask import Flask, render_template
from flask import request 
import sqlite3
import requests
import json

def getitems():
    sql = sqlite3.connect('bot.db')
    cursor = sql.cursor()
    cursor.execute("SELECT Name,Initial FROM port")
    rec = list(cursor.fetchall())
    l=[]
    for i in rec:
        l.append({"tick":i[0],"fdv":i[1]})
    return l
    

def cbal():
    f = open('balance.json','r')
    bal = json.load(f)['bal']
    f.close()

    f = open('balance.json','w')
    json.dump({'bal':bal-0.1},f)
    f.close()


def getbal():
    f = open('balance.json','r')
    bal = json.load(f)['bal']
    f.close()
    return bal


def buybal(tick):
    sql = sqlite3.connect('bot.db')
    cursor = sql.cursor()
    f = open('balance.json','r')
    bal = json.load(f)['bal']
    f.close()

    f = open('balance.json','w')
    json.dump({'bal':bal-0.1},f)
    f.close()

    cursor.execute(f'UPDATE port set BuyBal= {bal-0.1} WHERE Name = "{tick}"')
    sql.commit()

    
def sellbal(final,fdv,tick):
    sql = sqlite3.connect('bot.db')
    cursor = sql.cursor()
    f = open('balance.json','r')
    bal = json.load(f)['bal']
    f.close()

    f = open('balance.json','w')
    json.dump({'bal':bal+(0.1*(final-fdv)/fdv)},f)
    f.close()

    cursor.execute(f'UPDATE port set SellBal= {bal+(0.1*(final-fdv)/fdv)} WHERE Name = "{tick}"')
    sql.commit()


def add(tick,fdv):
    sql = sqlite3.connect('bot.db')
    cursor = sql.cursor()
    cursor.execute(f'INSERT INTO port (Name,Initial) values ("{tick}",{fdv})')
    sql.commit()

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
    sql = sqlite3.connect('bot.db')
    cursor = sql.cursor()
    while n<288:
        res = requests.get(f'https://api.dexscreener.com/tokens/v1/solana/{ca}',headers={"Accept":"*/*"})
        if list(res.json())[0]['fdv'] >= 2*fdv:
            final = list(res.json())[0]['fdv']
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
        
        

app = Flask(__name__)

@app.route('/')
def main():
        btc,eth,sol= fetch()
        return render_template('main.html',sol=sol,eth=eth,btc=btc)

@app.post('/helius')
def helius():
    sql = sqlite3.connect('bot.db')
    cursor = sql.cursor()
    hreq = list(request.get_json())
    for tx in hreq:
        for mints in tx['tokenTransfers']:
            if mints['mint'].endswith('pump'):
                ca = mints['mint']
                response = requests.get(f'https://api.dexscreener.com/tokens/v1/solana/{ca}',headers={"Accept":"*/*"})
                data = list(response.json())
                print(data)
                cursor.execute('SELECT Name FROM port')
                calist=[]
                list1 = list(cursor.fetchall())
                for i in list1:
                    for j in i:
                        calist.append(j)
                tick = data[0]['baseToken']['symbol']
                fdv = data[0]['fdv']
                amount = tx['nativeTransfers'][0]['amount'] / 1e9
                print(f'{tick} {fdv} {amount}')
                if fdv>80000 and amount>1:
                    print(f'{tick} {fdv} {amount}')
                    if tick not in calist:
                        add(tick,fdv)
                        buybal(tick)
                        check(ca,tick,fdv)
                
        

    return 'received'

@app.route('/bot')
def bot():
    sql = sqlite3.connect('bot.db')
    cursor = sql.cursor()
    cursor.execute("SELECT Name FROM port")
    balance = getbal()
    items = getitems()
    btc,eth,sol= fetch()
    return render_template('bot_main.html',items=items,balance = balance,eth=eth,sol=sol,btc=btc)

    

