import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import UploadFile, HTTPException, status

from ..config import settings

AWS_ACCESS_KEY = settings.aws_access_key
AWS_SECRET_ACCESS_KEY = settings.aws_secret_access_key
AWS_S3_BUCKET = settings.aws_s3_bucket
AWS_S3_REGION_NAME = settings.aws_s3_region_name

# Create an S3 client
s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY,
                  aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                  region_name=AWS_S3_REGION_NAME)

def upload_file(file: UploadFile , filename: str):
    try:
        s3.upload_fileobj(
            file.file,
            AWS_S3_BUCKET,
            filename,
        )
             
    except NoCredentialsError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="AWS credentials not found")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail=f"{e}")
    
def delete_file(filename: str):
    try:
        s3.delete_object(Bucket=AWS_S3_BUCKET, Key=filename)
    
    except NoCredentialsError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="AWS credentials not found")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail=f"{e}")
    
def get_file(filename: str):
    try:
        return s3.get_object(Bucket=AWS_S3_BUCKET, Key=filename)
    
    except NoCredentialsError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="AWS credentials not found")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail=f"{e}")
    