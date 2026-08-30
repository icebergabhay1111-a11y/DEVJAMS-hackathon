import os

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

load_dotenv()  # reads .env into the environment

SERVICE_ACCOUNT_FILE = os.environ["FIREBASE_SERVICE_ACCOUNT_FILE"]
GOOGLE_MAPS_API_KEY = os.environ["GOOGLE_MAPS_API_KEY"]


def get_firestore_client():
    if not firebase_admin._apps:
        credential = credentials.Certificate(SERVICE_ACCOUNT_FILE)
        firebase_admin.initialize_app(credential)

    return firestore.client()


db = get_firestore_client()

GOOGLE_MAPS_API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY", "AIzaSyCms3IgTIPVJTFGqOHRGnuChzDhF5KCVbk")
db = get_firestore_client()