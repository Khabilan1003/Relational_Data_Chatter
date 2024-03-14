from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List
import copy
import magic

from ..services import database, aws_s3
from .. import oauth2, models, schemas, utils

SUPPORTED_FILE_TYPES = {
    "text/csv" : "csv",
    "application/vnd.ms-excel" : "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "xlsx"
}

router = APIRouter(prefix="/chats" , tags=["Chats"])

@router.get("/" , response_model=List[schemas.ResponseChat])
def get_all_chats(db: Session = Depends(database.get_db) , user: models.User = Depends(oauth2.get_current_user)):
    # Filter Chats based on the USER_ID
    chats = db.query(models.Chat).filter(models.Chat.user_id == user.id).all()
    
    return chats

@router.get("/{chat_id}" , response_model=schemas.ResponseChat)
def get_chat_by_id(chat_id: int , db: Session = Depends(database.get_db) , user: models.User = Depends(oauth2.get_current_user)):
    # Filter Chats based on USER_ID and CHAT_ID
    chat = db.query(models.Chat).filter(models.Chat.user_id == user.id).filter(models.Chat.id == chat_id).first()
    
    return chat

@router.post("/" , response_model=schemas.ResponseChat)
async def create_new_chat(file: UploadFile = File(...), db: Session = Depends(database.get_db) , user: models.User = Depends(oauth2.get_current_user)):
    file_copy = copy.deepcopy(file)
    contents = await file.read()
    size = len(contents)
    
    # Check Whether the file size is less than 1 MB
    if not 0 < size <= 1 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail=f"Supported file size is 0 - 1 MB")

    # Check whether the file type is matching or not
    file_type = magic.from_buffer(buffer=contents , mime=True)
    if file_type not in SUPPORTED_FILE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported File Type = {file_type}. Supported Types are {SUPPORTED_FILE_TYPES}"
        )
        
    # Uploading File in S3 Bucket
    while True:
        file_name = utils.uniqid()
        s3_key = f"{user.id}/{file_name}.csv"
        
        chat = db.query(models.Chat).filter(models.Chat.s3_key == s3_key).first()
        
        if not chat:
            break
    
    aws_s3.upload_file(file_copy , s3_key)
    
    # Storing it in DB -> Chat Table
    new_chat = models.Chat(**{
        "user_id" : user.id,
        "title" : file.filename[:-4],
        "file_name" : file.filename,
        "s3_key" : s3_key
    })
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    
    return new_chat

@router.delete("/{chat_id}" , status_code=status.HTTP_204_NO_CONTENT)
def delete_chat(chat_id: int , db: Session = Depends(database.get_db) , user: models.User = Depends(oauth2.get_current_user)):
    chat_query = db.query(models.Chat).filter(models.Chat.id == chat_id)
    chat = chat_query.first()
    
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail=f"Chat with chat id : {chat_id} is not found in database")
    
    if chat.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail=f"Can't delete the chat of other users")
    
    aws_s3.delete_file(chat.file_name)
    
    chat_query.delete(synchronize_session=False)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)