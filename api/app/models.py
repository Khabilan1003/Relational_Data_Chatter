from sqlalchemy import Column , String , Integer, ForeignKey
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text

from .services.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer , primary_key=True , nullable=False)
    email = Column(String , nullable=False , unique=True)
    password = Column(String , nullable=False)
    user_type = Column(Integer , nullable=False)
    created_at = Column(TIMESTAMP(timezone=True) , nullable=False , server_default=text("now()"))
    
class Chat(Base):
    __tablename__ = "chats"
    
    id = Column(Integer , primary_key=True , nullable=False)
    user_id = Column(Integer , ForeignKey("users.id" , ondelete="CASCADE"), nullable=False)
    title = Column(String , nullable=False)
    file_name = Column(String , nullable=False)
    s3_key = Column(String , nullable=False , unique=True)
    created_at = Column(TIMESTAMP(timezone=True) , nullable=False , server_default=text("now()"))
    
class ChatMessages(Base):
    __tablename__  = "chat_messages"
    
    id = Column(Integer , primary_key=True , nullable=False)
    chat_id = Column(Integer , ForeignKey("chats.id" , ondelete="CASCADE") , nullable=False)
    question = Column(String , nullable=False)
    response = Column(String , nullable=False)
    created_at = Column(TIMESTAMP(timezone=True) , nullable=False , server_default=text("now()"))