# Import the database engine and Base class
from database import engine, Base

# Import the Task model
# This tells SQLAlchemy about the tasks table
from models import Task

# Import the User model
# This tells SQLAlchemy about the users table
from models_user import User


# Create all tables defined by our SQLAlchemy models
# Existing tables will not be recreated
Base.metadata.create_all(bind=engine)

# Print a success message after the table creation process
print("Database tables created successfully!")