import os
# pyrefly: ignore [missing-import]
from pymongo import MongoClient

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://127.0.0.1:27017/healthy_future')
_client = None

def get_mongodb_database():
    """
    Returns the MongoDB database instance connected to MONGODB_URI.
    Works seamlessly with MongoDB Atlas or local MongoDB.
    """
    global _client
    if _client is None:
        _client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    
    # Parse DB name from URI or default to healthy_future
    db_name = 'healthy_future'
    if '/' in MONGODB_URI.split('?')[-1]:
        pass
    return _client[db_name]
