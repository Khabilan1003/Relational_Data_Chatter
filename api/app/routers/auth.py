from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..services import database

from .. import models, utils, oauth2, schemas

router = APIRouter(tags=["Authentication"])

@router.post("/login" , response_model=schemas.BearerToken)
def login(user_credentials: OAuth2PasswordRequestForm = Depends() , db: Session = Depends(database.get_db)):
    # Get User from Database
    user = db.query(models.User).filter(models.User.email == user_credentials.username).first()
    
    # Check Whether User is there based on given EMAIL
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail=f"Invalid Credentials")
    
    # Verify Password
    if not utils.verify_password(user.password , user_credentials.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail=f"Invalid Credentials")
    
    # Create Access Token
    access_token = oauth2.create_access_token(data={"user_id" : user.id})
    
    return {"access_token" : access_token , "token_type" : "bearer"}