import random

def get_recommendations(emotion):
    emotion = emotion.lower()

    data = {
        "stress": {
            "quick": ["Take deep breaths", "Drink water"],
            "medium": ["Go for a walk", "Listen to calm music"],
            "deep": ["Try meditation", "Plan your tasks"]
        },
        "sad": {
            "quick": ["Watch something funny", "Smile for 30 sec"],
            "medium": ["Call a friend", "Go outside"],
            "deep": ["Write gratitude notes", "Reflect positively"]
        },
        "angry": {
            "quick": ["Take deep breaths", "Pause for 1 min"],
            "medium": ["Do exercise", "Walk fast"],
            "deep": ["Write your thoughts", "Take a break"]
        },
        "happy": {
            "quick": ["Share your happiness", "Smile"],
            "medium": ["Do something creative", "Help someone"],
            "deep": ["Work on goals", "Spread positivity"]
        },
        "neutral": {
            "quick": ["Stretch", "Drink water"],
            "medium": ["Start a task", "Listen to music"],
            "deep": ["Plan your day", "Learn something"]
        }
    }

    if emotion not in data:
        emotion = "neutral"

    return {
        "recommendations": {
            "quick": random.sample(data[emotion]["quick"], 2),
            "medium": random.sample(data[emotion]["medium"], 2),
            "deep": random.sample(data[emotion]["deep"], 1)
        }
    }
