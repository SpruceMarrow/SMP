# import requests
# import json

# url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
# parameters = {
#   'symbol': 'ETH,SOL,BTC',
#   'convert': 'USD'
# }

# res = requests.get(url, params=parameters,headers={'X-CMC_PRO_API_KEY': "18cc6530935245e48a2327569ff067f9"})
# data = res.json()
# for i in data['data']:
#     print(f' {i} : {round(data['data'][i]['quote']['USD']['price'],1)}')

import json

f= open('balance.json','w')

json.dump({'bal':1},f)

f.close()

f = open('balance.json','r')

read = json.load(f)
print(read['bal'])



