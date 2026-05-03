import joblib
import librosa
import numpy as np

model = joblib.load("emotion_model.pkl")
scaler = joblib.load("scaler.pkl")

def extract_features(file_path):
    audio, sr = librosa.load(file_path, duration=3, offset=0.5)
    mfcc = np.mean(librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40).T, axis=0)
    return mfcc.reshape(1, -1)

def predict_emotion(file_path):
    features = extract_features(file_path)
    features = scaler.transform(features)
    prediction = model.predict(features)
    return prediction[0]
