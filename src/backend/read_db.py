import sqlite3

con = sqlite3.connect('test.db')
cursor = con.cursor()
cursor.execute("SELECT * FROM annotation")
print(cursor.fetchall())