from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
from utils import predict_emotion
from recommender import get_recommendations

app = FastAPI()

# Fix frontend connection (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    emotion = predict_emotion(file_location)
    recommendations = get_recommendations(emotion)

    return {
        "emotion": emotion,
        "recommendations": recommendations
    }
