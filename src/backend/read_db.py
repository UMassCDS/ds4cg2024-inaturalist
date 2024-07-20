import sqlite3

con = sqlite3.connect('./src/backend/test.db')
cursor = con.cursor()
# cursor.execute("SELECT * FROM annotation")
cursor.execute("SELECT * FROM AnnotationHexagon")
# cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
print(cursor.fetchall())