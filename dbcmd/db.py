import os
import psycopg2 as psy

sql = psy.connect(os.environ["DATABASE_URL"])
cur = sql.cursor()

q = "CREATE TABLE port (Name text, Initial real, Final real, PnL real, BuyBal real, SellBal real, CA text)"
cur.execute(q)
print("Table port Created")

q1 = "CREATE TABLE bal (Balance real)"
cur.execute(q1)
print("Table bal created")

sql.commit()
sql.close()

