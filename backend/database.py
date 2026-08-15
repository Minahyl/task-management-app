# Import SQLAlchemy function to create the database engine
from sqlalchemy import create_engine

# Import the base class used for SQLAlchemy models
from sqlalchemy.orm import DeclarativeBase

# Import sessionmaker to create database sessions
from sqlalchemy.orm import sessionmaker

# Import os to read environment variables
import os

# Import load_dotenv to load variables from the .env file
from dotenv import load_dotenv


# Load variables from the .env file
load_dotenv()


# Get the PostgreSQL connection URL from the environment
DATABASE_URL = os.getenv("DATABASE_URL")


# Create the SQLAlchemy engine
# The engine manages communication between Python and PostgreSQL
engine = create_engine(DATABASE_URL)


# Create a session factory
# Each session will be used to interact with the database
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Create the base class for all SQLAlchemy models
class Base(DeclarativeBase):
    pass

# Create a dependency that provides a database session
def get_db():

    # Create a new database session
    db = SessionLocal()

    try:
        # Give the database session to the API endpoint
        yield db

    finally:
        # Close the database session after the request is finished
        db.close()