from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

DB_URL = os.getenv("DATABASE_URL")

engine = create_engine(DB_URL, isolation_level="SERIALIZABLE")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def check_db_connection(engine):
    with engine.connect() as _:
        return True
