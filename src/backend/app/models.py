from sqlalchemy import Column, Integer
from database import Base


class Annotation(Base):
    __tablename__="annotation"
    id= Column(Integer, primary_key=True, index=True)
    taxa_id= Column(Integer)