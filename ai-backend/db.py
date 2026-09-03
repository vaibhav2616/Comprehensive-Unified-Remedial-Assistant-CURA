import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Default to the docker-compose postgres URL if not provided
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://cura_user:cura_password@localhost:5432/cura_db")

try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    print("[db] Successfully configured SQLAlchemy connection to PostgreSQL")
except Exception as e:
    print(f"[db] Warning: Could not connect to PostgreSQL. {e}")
    SessionLocal = None
    Base = None

def get_db():
    if not SessionLocal:
        yield None
        return
        
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
