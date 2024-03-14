from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User Schema
class CreateUser(BaseModel):
    email: EmailStr
    password: str
    user_type: Optional[int] = None
    
class ResponseUser(BaseModel):
    id: int
    email: str
    user_type: int
    created_at: datetime
    
    class Config:
        orm_mode = True
                
# Beared Token Schema
class BearerToken(BaseModel):
    access_token: str
    token_type: str

# Chat Schema
class ResponseChat(BaseModel):
    id: int
    title: str
    file_name: str
    s3_key: str
    created_at: datetime
    
    class Config:
        orm_mode = True
        
# Chat Message Request Body
class ChatMessageQuestion(BaseModel):
    question: str
    
class ChatMessageResponse(ChatMessageQuestion):
    response: str
    chat_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True