# Import JWT functions from python-jose
from jose import jwt, JWTError

# Import datetime tools for token expiration
from datetime import datetime, timedelta

# Import FastAPI dependency and HTTP errors
from fastapi import Depends, HTTPException, status

# Import HTTP Bearer authentication
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Import SQLAlchemy Session
from sqlalchemy.orm import Session

# Import database session dependency
from database import get_db

# Import User database model
from models_user import User

# Import CryptContext for password hashing
from passlib.context import CryptContext

# Import os to read environment variables
import os

# Load variables from the .env file
from dotenv import load_dotenv


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()


# ==========================================
# PASSWORD HASHING
# ==========================================

# Create a password hashing context using bcrypt
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# Hash a plain-text password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# Verify a plain-text password against
# the stored password hash
def verify_password(
    password: str,
    password_hash: str
) -> bool:
    return pwd_context.verify(
        password,
        password_hash
    )


# ==========================================
# JWT CONFIGURATION
# ==========================================

# Get the JWT secret from .env
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "dev-secret-key-change-this"
)

# Algorithm used to sign JWT tokens
ALGORITHM = "HS256"

# Token lifetime in minutes
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# ==========================================
# BEARER AUTHENTICATION
# ==========================================

# Protected routes use:
#
# Authorization: Bearer <token>
security = HTTPBearer()


# ==========================================
# CREATE ACCESS TOKEN
# ==========================================

def create_access_token(data: dict):

    # Create a copy so the original data is not modified
    to_encode = data.copy()

    # Calculate token expiration time
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    # Add expiration time to the token
    to_encode.update({
        "exp": expire
    })

    # Create JWT token
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    # Return the token
    return encoded_jwt


# ==========================================
# VERIFY TOKEN
# ==========================================

def verify_token(token: str):

    try:

        # Decode and verify the JWT token
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        # Return decoded token data
        return payload

    except JWTError:

        # Token is invalid or expired
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )


# ==========================================
# GET CURRENT USER
# ==========================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    # Get the actual token from:
    # Authorization: Bearer <token>
    token = credentials.credentials

    # Verify and decode the JWT token
    payload = verify_token(token)

    # Get user ID from the token
    user_id = payload.get("sub")

    # Make sure the token contains a user ID
    if user_id is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    # Find the user in PostgreSQL
    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    # If user doesn't exist
    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    # Return the logged-in user
    return user