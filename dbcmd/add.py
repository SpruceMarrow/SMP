import os
import psycopg2 as psy

sql = psy.connect(os.environ["DATABASE_URL"])
cur = sql.cursor()

cur.execute("INSERT INTO bal values(1)")
print("Executed")
sql.commit()
sql.close()
