import os
import psycopg2 as psy
from tabulate import tabulate

sql = psy.connect(os.environ["DATABASE_URL"])
cur = sql.cursor()

cur.execute("SELECT * FROM port")
a = cur.fetchall()
print(tabulate(a))
sql.commit()
sql.close()
