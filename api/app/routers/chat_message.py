from fastapi import APIRouter, Depends, HTTPException, status
from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain_openai import ChatOpenAI
from sqlalchemy.orm import Session
import pandas as pd
from typing import List

from ..services import database, aws_s3
from .. import schemas, models, oauth2

router = APIRouter(prefix="/chat-messages" , tags=["Chat Messages"])

@router.get("/{chat_id}" , response_model=List[schemas.ChatMessageResponse])
def get_chat_messages(chat_id: int , limit: int = 10 , page: int = 0, db: Session = Depends(database.get_db) , user: models.User = Depends(oauth2.get_current_user)):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()
    
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail=f"Chat with chat id : {chat_id} is not present")
    
    if chat.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail=f"Trying to access other Chats")
    
    chat_messages = db.query(models.ChatMessages).filter(
        models.ChatMessages.chat_id == chat_id).order_by(
            models.ChatMessages.created_at.desc()).offset(
            offset = page*limit).limit(
            limit = limit).all()
    
    return chat_messages

@router.post("/{chat_id}" , response_model=schemas.ChatMessageResponse)
def make_response(chat_id: int , question: schemas.ChatMessageQuestion , db: Session = Depends(database.get_db) , user: models.User = Depends(oauth2.get_current_user)):
    # Check whether the chat id belongs to the user
    
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()
    
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail=f"Chat with chat id : {chat_id} is not present")
    
    if chat.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN , detail=f"Trying to access other Chats")
    
    file = aws_s3.get_file(chat.s3_key)
    
    df = pd.read_csv(file["Body"])
    agent = create_pandas_dataframe_agent(
            ChatOpenAI(temperature=0.4, model="gpt-3.5-turbo"),
            df,
            handle_parsing_error=True,
            verbose=True)

    response = agent.run(question.question)
    print(response)
    new_chat_message = models.ChatMessages(**{
        "chat_id" : chat_id,
        "question" : question.question,
        "response" : response
    })
    db.add(new_chat_message)
    db.commit()
    db.refresh(new_chat_message)
    
    return new_chat_message