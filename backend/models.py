# Import SQLAlchemy column types
from sqlalchemy import String, Integer, ForeignKey

# Import SQLAlchemy tools for mapped columns and relationships
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Import our Base class from database.py
from database import Base


# Define the Task database model
# This model represents the "tasks" table in PostgreSQL
class Task(Base):

    # Tell SQLAlchemy that the database table should be named "tasks"
    __tablename__ = "tasks"

    # Create the ID column
    # Every task will have a unique primary key
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    # Create the title column
    # This stores the task title
    title: Mapped[str] = mapped_column(String)

    # Create the description column
    # This stores the task description
    description: Mapped[str] = mapped_column(String)

    # Create the status column
    # Example values:
    # pending
    # in_progress
    # completed
    status: Mapped[str] = mapped_column(String)

    # Create a foreign key that connects this task to a user
    # user_id stores the ID of the user who owns this task
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index=True
    )

    # Relationship back to the User model
    user: Mapped["User"] = relationship(
        "User",
        back_populates="tasks"
    )