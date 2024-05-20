import jwt
import os
from Common.redis_users import r
from .models import Users
class RedisTokenBackend:
    
    def create_token(self,email):
        token = self.generate_token(email=email)
        r.set(email,token)
        return token

    def authenticate(self, token,email) -> Users:
        try:
            decoded_payload = jwt.decode(token,os.getenv("JWT_SECRET",algprymths=['HS256']))     
        except jwt.InvalidTokenError:
            raise ValueError
        if not r.exists(email):
            return None
        saved_token = r.get(email)
        if saved_token != token:
            return None
        user = Users.objects.get(decoded_payload.get('email'))
        return user
    def generate_token(self,email):
        payload = {
            'email' : email 
        }
        token = jwt.encode(payload=payload,key=os.getenv("JWT_SECRET"),algorithm='HS256')
        return token
