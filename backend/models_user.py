# Import SQLAlchemy column types
from sqlalchemy import String, Integer

# Import SQLAlchemy tools for mapped columns and relationships
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Import the Base class from our database configuration
from database import Base


# Define the User database model
# This model represents the "users" table in PostgreSQL
class User(Base):

    # Tell SQLAlchemy that this model represents the "users" table
    __tablename__ = "users"

    # Create the ID column
    # Each user will have a unique ID
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    # Store the user's name
    name: Mapped[str] = mapped_column(String)

    # Store the user's email address
    email: Mapped[str] = mapped_column(
        String,
        index=True
    )

    # Store the hashed password
    # We NEVER store the user's plain-text password
    password_hash: Mapped[str] = mapped_column(String)

    # Relationship with tasks
    # One user can have many tasks
    tasks: Mapped[list["Task"]] = relationship(
        "Task",
        back_populates="user"
    )