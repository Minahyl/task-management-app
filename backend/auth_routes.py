# Import APIRouter to create authentication routes
from fastapi import APIRouter, Depends, HTTPException, status

# Import Pydantic models for request validation
from pydantic import BaseModel, EmailStr

# Import SQLAlchemy Session for database operations
from sqlalchemy.orm import Session

# Import database session dependency
from database import get_db

# Import User database model
from models_user import User

# Import password hashing and verification functions
from security import hash_password, verify_password

# Import JWT functions
from auth import create_access_token, get_current_user


# ==========================================
# CREATE AUTHENTICATION ROUTER
# ==========================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# USER REGISTRATION MODEL
# ==========================================

class UserRegister(BaseModel):

    # User's name
    name: str

    # User's email address
    email: EmailStr

    # User's password
    password: str


# ==========================================
# USER LOGIN MODEL
# ==========================================

class UserLogin(BaseModel):

    # User's email address
    email: EmailStr

    # User's password
    password: str


# ==========================================
# REGISTER
# ==========================================

# POST /auth/register
@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
def register_user(

    user: UserRegister,

    # Get database session
    db: Session = Depends(get_db)
):

    # Check whether a user with this email already exists
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    # Prevent multiple accounts using the same email
    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )

    # Hash the user's password
    password_hash = hash_password(user.password)

    # Create a new User database object
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=password_hash
    )

    # Add user to database session
    db.add(new_user)

    # Save user permanently
    db.commit()

    # Refresh to get generated ID
    db.refresh(new_user)

    # Return safe user information
    #
    # IMPORTANT:
    # Never return the password or password hash
    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }


# ==========================================
# LOGIN
# ==========================================

# POST /auth/login
@router.post("/login")
def login_user(

    user: UserLogin,

    # Get database session
    db: Session = Depends(get_db)
):

    # Find the user by email
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    # Reject login if email doesn't exist
    if not existing_user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify entered password
    password_valid = verify_password(
        user.password,
        existing_user.password_hash
    )

    # Reject login if password is incorrect
    if not password_valid:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create JWT access token
    access_token = create_access_token(
        {
            "sub": str(existing_user.id)
        }
    )

    # Return token and safe user information
    return {
        "message": "Login successful",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email
        }
    }


# ==========================================
# GET CURRENT USER / PROFILE
# ==========================================

# GET /auth/me
#
# This endpoint requires a valid JWT token.
#
# The frontend can use this endpoint when it needs
# information about the currently logged-in user.
@router.get("/me")
def get_my_profile(

    # get_current_user automatically:
    # 1. Reads the Bearer token
    # 2. Verifies the JWT
    # 3. Finds the user
    # 4. Returns the User object
    current_user: User = Depends(get_current_user)
):

    # Return only safe profile information
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }