from dateutil.relativedelta import relativedelta
from google import genai
import os
from dotenv import load_dotenv
import requests
from google.cloud import firestore, texttospeech
import json
import random
import re
import string
import base64
from datetime import datetime, date, timedelta

load_dotenv()

gemini_client = genai.Client() # Uses the GEMINI_API_KEY env var
db = firestore.Client()

def remove_special_chars(text):
    # Keep letters, numbers, spaces, and standard punctuation
    allowed = string.ascii_letters + string.digits + string.punctuation + " "
    cleaned = ''.join(ch for ch in text if ch in allowed)
    return cleaned

def keep_only_numbers(s):
    return re.sub(r"[^0-9]", "", s)

from flask import Flask, jsonify, request

app = Flask(__name__)

from flask_cors import CORS
CORS(app)

@app.route('/generate', methods=['POST'])
def generate():
    try:
        query = request.args.get('q')
    except:
        query = None

    if query is None:
        return {"error": "No query provided"}, 404

    try:
        data = request.get_json()
    except:
        data = None

    # Else process query
    if(query == "paragraph"):
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Write a short 2–3 sentence reading passage designed to help 2nd–4th graders with dyslexia improve their reading skills. Use simple, phonetic words, clear sentence structure, and engaging but age-appropriate content involving farms, farm animals, and everyday adventures. The passage should be fun to read aloud and support decoding practice. Avoid too many visually similar words or confusing letter patterns, but include some without tongue-twists. Do not include any special formatting. "
        )
        return {"text": remove_special_chars(response.text)}, 200
    elif(query == "sentence"):
        if data is None:
            return {"error": "No data provided"}, 400
        try:
            words = data["words"]
        except:
            return {"error": "No words provided"}, 400
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Create one, short, clear, age-appropriate sentence that tests a 2nd–4th grader’s reading skills using most, if not all, of the following words: {words}. The sentence should: Be easy to read aloud but still provide decoding practice for students with dyslexia. Use simple grammar and clear sentence structure without tongue-twists. Be engaging and make sense as a complete thought (not just a list of words). Avoid adding extra difficult or confusing words. Do not include any special formatting. "
        )
        return {"text": remove_special_chars(response.text)}, 200
    elif(query == "word"):
        if data is None:
            return {"error": "No data provided"}, 400
        try:
            words = data["words"]
        except:
            return {"error": "No words provided"}, 400
        return {"text": remove_special_chars(random.choice(words))}, 200
    else:
        return {"error": "Invalid query"}, 404

@app.route('/tts', methods=['POST'])
def text_to_speech():
    try:
        data = request.get_json()
    except:
        data = None

    if data is None:
        return {"error": "No data provided"}, 400

    # Else process query
    # Generate motivational messaage
    try:
        words = data["words"]
    except:
        return {"error": "No words provided"}, 400
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"You are a friendly, encouraging AI reading coach for 2nd–4th graders. You are given a list of words the student struggled with: {words}. Generate a short, motivational message (1–2 sentences) that: Acknowledges the student’s effort. Gently points out the words they struggled with. Encourages them to focus on those words in a positive, supportive tone. Sounds natural and friendly, like a personal coach. Example output: “Great job today! It looks like you had a little trouble with {words}, so let’s practice those together and get even better!”"
    )
    motivational_message = remove_special_chars(response.text).replace('\'', '')
    print("Motivational message:", motivational_message)
    try:
        # Initialize TTS client
        client = texttospeech.TextToSpeechClient()

        synthesis_input = texttospeech.SynthesisInput(text=motivational_message)

        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            name="en-US-Chirp-HD-F"
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        tts_response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )

        audio_base64 = base64.b64encode(tts_response.audio_content).decode('utf-8')

        print(motivational_message)
        # Use jsonify to ensure proper headers and CORS
        return {"message": motivational_message, "audio": audio_base64}, 200
    except Exception as e:
        print("Error during TTS:", str(e))
        return {"error": "TTS generation failed"}, 500

@app.route('/data/users', methods=['GET'])
def get_users():
    try:
        user = request.args.get('user').lower()
    except:
        user = None

    if user is None:
        return {"error": "No user provided"}, 404

    # Get user from Firestore
    doc_ref = db.collection("users").document(user)
    doc = doc_ref.get()
    if doc.exists:
        return {"user": user, "number": doc.to_dict()["number"]}, 200 # Return only the phone number
    else:
        return {"error": "User not found"}, 404

@app.route('/data/users', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
    except:
        data = None

    if data is None:
        return {"error": "No data provided"}, 400

    try:
        user = data["user"].lower()
        print(user)
        name = data["name"].title()
        print(name)
        password = data["password"]
        print(password)
        grade = int(data["grade"])
        print(grade)
        number = keep_only_numbers(data["number"])
        print(number)
    except Exception as e:
        print(e)
        return {"error": "Missing data"}, 400

    # Add user to Firestore
    db.collection("users").document(user).set({
        "user": user,
        "name": name,
        "password": password,
        "grade": grade,
        "number": number
    })
    return {"message": "User added"}, 200

@app.route('/data/streak', methods=['GET'])
def get_streak():
    try:
        user = request.args.get('user').lower()
    except:
        user = None

    if user is None:
        return {"error": "No user provided"}, 404

    # Get streak from Firestore
    doc_ref = db.collection("streaks").document(user)
    doc = doc_ref.get()
    if doc.exists:
        return {"user": user, "streak": doc.to_dict()["streak"]}, 200 # Defualt is false, set to true when completed
    else:
        return {"error": "User not found"}, 404

@app.route('/data/streak', methods=['PUT'])
def set_streak():
    try:
        user = request.args.get('user').lower()
    except:
        user = None

    if user is None:
        return {"error": "No user provided"}, 404

    # Get streak from Firestore
    doc_ref = db.collection("streaks").document(user)
    doc = doc_ref.get()
    if doc.exists:
        current = doc.to_dict()
        new = {}
        for streak in current["streak"]:
            if datetime.strptime(streak, "%Y-%m-%d").date() < date.today() - relativedelta(months=1):
                print("Deleting streak:", streak)
            else:
                new[streak] = current["streak"][streak] # Keep existing streaks within the last month
        # Get last element from new and fill in missing dates
        if len(new) > 0:
            last_date = max([date.fromisoformat(d) for d in new.keys()])
            if(last_date == date.today()):
                return {"user": user, "message": "Streak already set for " + date.today().strftime("%Y-%m-%d")}, 200
            delta = (date.today() - last_date).days
            for i in range(1, delta):
                new[(last_date + timedelta(days=i)).strftime("%Y-%m-%d")] = False
        new[date.today().strftime("%Y-%m-%d")] = True # Add today's date

        db.collection("streaks").document(user).set({
            "user": user,
            "streak": new
        })
    else: # New user
        db.collection("streaks").document(user).set({
            "user": user,
            "streak": {date.today().strftime("%Y-%m-%d"): True}
        })
    return {"user": user, "message": "Streak set for " + date.today().strftime("%Y-%m-%d")}, 200

@app.route('/data/struggle', methods=['GET'])
def get_struggle():
    try:
        user = request.args.get('user').lower()
    except:
        user = None

    if user is None:
        return {"error": "No user provided"}, 404

    # Get struggle from Firestore
    doc_ref = db.collection("struggles").document(user)
    doc = doc_ref.get()
    if doc.exists:
        return {"user": user, "struggles": doc.to_dict()["struggles"]}, 200
    else:
        return {"error": "User not found"}, 404

@app.route('/data/struggle', methods=['POST'])
def add_struggle():
    try:
        user = request.args.get('user').lower()
    except:
        user = None

    if user is None:
        return {"error": "No user provided"}, 404

    try:
        data = request.get_json()
    except:
        data = None

    if data is None:
        return {"error": "No data provided"}, 404

    try:
        words = data["words"]
    except:
        return {"error": "No words provided"}, 400

    # Post struggle to Firestore
    doc_ref = db.collection("struggles").document(user)
    doc = doc_ref.get()

    new = []

    if doc.exists:
        current = doc.to_dict()
        new = current["struggles"]
    for word in words:
        if word not in new:
            new.append(word.lower())
    db.collection("struggles").document(user).set({
        "user": user,
        "struggles": new
    })

    return {"user": user, "message": "Struggles added"}, 200

@app.route('/data/struggle', methods=['DELETE'])
def remove_struggle():
    try:
        user = request.args.get('user').lower()
        word = request.args.get('word').lower()
    except:
        user = None
        word = None

    if user is None:
        return {"error": "No user provided"}, 404
    if word is None:
        return {"error": "No word provided"}, 404

    # Remove struggle from Firestore
    doc_ref = db.collection("struggles").document(user)
    doc = doc_ref.get()
    if doc.exists:
        current = doc.to_dict()
        new = current["struggles"]
        if word in new:
            new.remove(word)
            db.collection("struggles").document(user).set({
                "user": user,
                "struggles": new
            })
            return {"user": user, "message": f"Struggle '{word}' removed"}, 200
        else:
            return {"error": f"Struggle '{word}' not found"}, 404
    else:
        return {"error": "User not found"}, 404

if __name__ == '__main__':
    app.run(debug=True, port=5001)

    # DEBUG