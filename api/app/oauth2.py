from jose import JWTError , jwt
from datetime import datetime , timedelta
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .services import database

from . import models, schemas
from .config import settings

ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes
SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm

oauth2_schema = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp" : expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY , ALGORITHM)
    
    return encoded_jwt

def verify_access_token(token: str , credentials_exception):
    try:
        payload = jwt.decode(token , SECRET_KEY , ALGORITHM)
        
        id: int = payload.get("user_id")
        
        if id is None:
            raise credentials_exception
        
        return id
    except JWTError:
        raise credentials_exception

def get_current_user(token: str = Depends(oauth2_schema) , db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail=f"Could Not Validate Credentials" , headers={"WWW-Authenticate": "Bearer"})
    
    user_id = verify_access_token(token , credentials_exception=credentials_exception)
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    return user