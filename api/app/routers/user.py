from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from ..services import database

from .. import schemas, models, utils, config

router = APIRouter(prefix="/users" , tags=["Users"])

@router.post("/" , status_code=status.HTTP_201_CREATED , response_model=schemas.ResponseUser)
def create_user(user: schemas.CreateUser, db: Session = Depends(database.get_db) ):
    # Check Email Already Exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE , detail=f"Email : {user.email} already exists")
    
    # Add User Type
    user.user_type = config.UserTypes.Basic.value
    new_user = models.User(**user.model_dump())
    new_user.password = utils.hash_password(new_user.password)
    
    # Store the New User in DB
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.get("/{id}" ,status_code=status.HTTP_200_OK , response_model=schemas.ResponseUser)
def get_user(id: int , db: Session = Depends(database.get_db)):
    # Get User
    user = db.query(models.User).filter(models.User.id == id).first()
    
    # Check whether user is present or not
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail=f"ID : {id} is not found")
    
    return user