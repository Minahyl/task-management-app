# Import Enum to create a fixed list of allowed status values
from enum import Enum

# Import FastAPI and tools for dependencies and HTTP errors
from fastapi import FastAPI, Depends, HTTPException, status

# Import Pydantic's BaseModel to validate incoming task data
from pydantic import BaseModel

# Import SQLAlchemy Session to work with the database
from sqlalchemy.orm import Session

# Import CORS middleware so our Next.js frontend can communicate
# with the FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

# Import our database session dependency
from database import get_db

# Import our SQLAlchemy Task model
# We rename it to TaskModel to avoid confusion with the Pydantic model
from models import Task as TaskModel

# Import authentication router
from auth_routes import router as auth_router

# Import the dependency that identifies the logged-in user
from auth import get_current_user

# Import our SQLAlchemy User model
from models_user import User


# ==========================================
# CREATE FASTAPI APPLICATION
# ==========================================

app = FastAPI()


# ==========================================
# CORS CONFIGURATION
# ==========================================

# Our Next.js frontend will normally run on port 3000
# This allows the frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,

    # Allow requests from our local Next.js frontend
    allow_origins=[
        "http://localhost:3000",
    ],

    # Allow cookies/authorization-related browser behavior
    allow_credentials=True,

    # Allow all HTTP methods
    allow_methods=["*"],

    # Allow all headers
    allow_headers=["*"],
)


# ==========================================
# AUTHENTICATION ROUTES
# ==========================================

# Include all authentication routes
#
# POST /auth/register
# POST /auth/login
# GET  /auth/me
app.include_router(auth_router)


# ==========================================
# TASK STATUS OPTIONS
# ==========================================

# Define the only three status values allowed for a task
class TaskStatus(str, Enum):

    # Task has not been started yet
    PENDING = "pending"

    # Task is currently being worked on
    IN_PROGRESS = "in_progress"

    # Task has been finished
    COMPLETED = "completed"


# ==========================================
# TASK PYDANTIC REQUEST MODEL
# ==========================================

# Define the structure of data received
# when creating or updating a task
class TaskCreate(BaseModel):

    # Task title
    title: str

    # Task description
    description: str

    # Task status
    status: TaskStatus


# ==========================================
# HOME / ROOT ENDPOINT
# ==========================================

# Handle GET requests to the root URL "/"
@app.get("/")
def home():

    # Return a simple message to confirm that the API is running
    return {
        "message": "Task Management API is running!"
    }


# ==========================================
# GET / SEARCH / FILTER TASKS
# ==========================================

# Handle GET requests to "/tasks"
@app.get("/tasks")
def get_tasks(

    # Status can be selected from the three TaskStatus options
    status: TaskStatus | None = None,

    # Search allows the user to search by title or description
    search: str | None = None,

    # Get a database session using our dependency
    db: Session = Depends(get_db),

    # Require the user to be logged in
    current_user: User = Depends(get_current_user)
):

    # Start a database query
    #
    # IMPORTANT:
    # Only retrieve tasks belonging to the logged-in user
    query = db.query(TaskModel).filter(
        TaskModel.user_id == current_user.id
    )

    # If a status was provided, filter tasks by status
    if status:

        query = query.filter(
            TaskModel.status == status.value
        )

    # If a search term was provided,
    # search in title or description
    if search:

        # Add wildcard characters so partial matches are possible
        search_pattern = f"%{search}%"

        # Search both title and description
        query = query.filter(
            (TaskModel.title.ilike(search_pattern)) |
            (TaskModel.description.ilike(search_pattern))
        )

    # Execute the query
    tasks = query.all()

    # Return only the logged-in user's tasks
    return tasks


# ==========================================
# GET A SPECIFIC TASK
# ==========================================

# Handle GET requests such as:
# GET /tasks/1
@app.get("/tasks/{task_id}")
def get_task(

    task_id: int,

    # Get a database session
    db: Session = Depends(get_db),

    # Require the user to be logged in
    current_user: User = Depends(get_current_user)
):

    # Search for the task using its ID
    #
    # AND make sure it belongs to the logged-in user
    task = db.query(TaskModel).filter(
        TaskModel.id == task_id,
        TaskModel.user_id == current_user.id
    ).first()

    # If the task does not exist
    # OR belongs to another user
    if not task:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Return the requested task
    return task


# ==========================================
# CREATE A NEW TASK
# ==========================================

# Handle POST requests to "/tasks"
@app.post(
    "/tasks",
    status_code=status.HTTP_201_CREATED
)
def create_task(

    task: TaskCreate,

    # Get a database session
    db: Session = Depends(get_db),

    # Require the user to be logged in
    current_user: User = Depends(get_current_user)
):

    # Create a new SQLAlchemy Task object
    #
    # IMPORTANT:
    # Automatically attach the task to the logged-in user
    new_task = TaskModel(
        title=task.title,
        description=task.description,
        status=task.status.value,
        user_id=current_user.id
    )

    # Add the new task to the database session
    db.add(new_task)

    # Save the task permanently
    db.commit()

    # Refresh the object to get the generated database ID
    db.refresh(new_task)

    # Return the newly created task
    return new_task


# ==========================================
# UPDATE A TASK
# ==========================================

# Handle PUT requests such as:
# PUT /tasks/1
@app.put("/tasks/{task_id}")
def update_task(

    task_id: int,

    updated_task: TaskCreate,

    # Get a database session
    db: Session = Depends(get_db),

    # Require the user to be logged in
    current_user: User = Depends(get_current_user)
):

    # Find the task
    #
    # AND make sure it belongs to the logged-in user
    task = db.query(TaskModel).filter(
        TaskModel.id == task_id,
        TaskModel.user_id == current_user.id
    ).first()

    # If the task does not exist
    # OR belongs to another user
    if not task:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update task information
    task.title = updated_task.title
    task.description = updated_task.description
    task.status = updated_task.status.value

    # Save changes
    db.commit()

    # Refresh with latest database values
    db.refresh(task)

    # Return updated task
    return task


# ==========================================
# DELETE A TASK
# ==========================================

# Handle DELETE requests such as:
# DELETE /tasks/1
@app.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_task(

    task_id: int,

    # Get a database session
    db: Session = Depends(get_db),

    # Require the user to be logged in
    current_user: User = Depends(get_current_user)
):

    # Find the task
    #
    # AND make sure it belongs to the logged-in user
    task = db.query(TaskModel).filter(
        TaskModel.id == task_id,
        TaskModel.user_id == current_user.id
    ).first()

    # If the task does not exist
    # OR belongs to another user
    if not task:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Delete the task
    db.delete(task)

    # Permanently apply deletion
    db.commit()

    # HTTP 204 has no response body
    return None