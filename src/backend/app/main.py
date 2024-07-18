from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import tools, models


from src.backend.app.database import engine, SessionLocal
from sqlalchemy.orm import Session


app = FastAPI()
models.Base.metadata.create_all(bind=engine)

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
    

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/generate_prediction/")
async def generate_prediction(request: Request):
    response = tools.generate_prediction(await request.json())
    return JSONResponse(content=response)

@app.post("/save_annotation/")
async def save_annotation(request: Request, db : Session = Depends(get_db)):
    response = tools.save_annotation(await request.json())
    annotation_model = models.Annotation()
    annotation_model.taxa_id=response[1]
    db.add(annotation_model)
    db.commit()
    return JSONResponse(content=response)
