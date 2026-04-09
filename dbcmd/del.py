import os
import psycopg2

sql = psycopg2.connect(os.environ["DATABASE_URL"])
cur = sql.cursor()
cur.execute("DELETE FROM port")
print("Deleted")
cur.execute("UPDATE bal set Balance=1")
print("Executed")
sql.commit()
sql.close()
  
