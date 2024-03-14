from enum import Enum
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    sqlalchemy_database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    aws_access_key: str
    aws_secret_access_key: str
    aws_s3_bucket: str
    aws_s3_region_name: str
    openai_api_key: str
    
    class Config:
        env_file = ".env"
        
settings = Settings()


# Enums
UserTypes = Enum("UserType" , ["Basic", "Facebook" , "Twitter"])