import os

import firebase_admin
from firebase_admin import credentials, firestore


SERVICE_ACCOUNT_FILE = (
    "netramai-8322f-firebase-adminsdk-fbsvc-644f1950ab.json"
)


def get_firestore_client():
    if not firebase_admin._apps:
        credential = credentials.Certificate(SERVICE_ACCOUNT_FILE)
        firebase_admin.initialize_app(credential)

    return firestore.client()


db = get_firestore_client()

GOOGLE_MAPS_API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY", "AIzaSyCms3IgTIPVJTFGqOHRGnuChzDhF5KCVbk")