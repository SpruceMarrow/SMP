import os
import psycopg2 as psy

sql = psy.connect(os.environ["DATABASE_URL"])
cur = sql.cursor()

cur.execute("SELECT * FROM port")
a = cur.fetchall()
print(a)
sql.commit()
sql.close()
