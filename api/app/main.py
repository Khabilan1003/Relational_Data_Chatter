from fastapi import FastAPI

from .services import database
from . import models
from .routers import user, auth , chat , chat_message

models.Base.metadata.create_all(bind=database.engine)

# Rest API
app = FastAPI()

# Routers
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(chat_message.router)