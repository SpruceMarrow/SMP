import os
import psycopg2

sql = psycopg2.connect(os.environ["DATABASE_URL"])
cur = sql.cursor()
cur.execute("DELETE FROM port")
print("Deleted")
sql.commit()
sql.close()
  
