from sqlalchemy import Column, Integer, DateTime, ForeignKey
from src.backend.app.database import Base
import datetime

class Annotation(Base):
    __tablename__="Annotation"
    AnnotationID = Column(Integer, primary_key=True, index=True)
    TaxaID = Column(Integer)
    CreatedAt = Column(DateTime)

# class AnnotationHexagon(Base):
#     __tablename__="AnnotationHexagon"
#     AnnotationHexagonID = Column(Integer, primary_key=True, index=True)
#     AnnotationID = Column(Integer, ForeignKey("Annotation.AnnotationID"))

