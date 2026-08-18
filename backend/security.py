from passlib.context import CryptContext


# ==========================================
# PASSWORD HASHING
# ==========================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# ==========================================
# HASH PASSWORD
# ==========================================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# ==========================================
# VERIFY PASSWORD
# ==========================================

def verify_password(
    password: str,
    password_hash: str
) -> bool:
    return pwd_context.verify(
        password,
        password_hash
    )