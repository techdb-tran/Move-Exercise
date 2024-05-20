from .models import Users
from django.utils import timezone
import bcrypt
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from Common.redis_users import r
import random   
import os

class UserService:
    @staticmethod
    def create(password, email):
        password_bytes = password.encode('utf-8')
        hash_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        created_at = timezone.now()
        updated_at = timezone.now()
        user = Users(
            username = None,
            password = hash_password.decode('utf-8'),
            email = email,
            created_at = created_at,
            updated_at = updated_at,
            is_actived = 0,
            is_verified = 0)
        user.save()
    
    @staticmethod
    def send_otp(email):
        otp = ""
        digits = "0123456789"
        for i in range (6):
            otp += random.choice(digits)
        
        r.set(email,otp)
        send_mail(
            'Ma OTP : ',
            otp,
            'from danghoaiduc9@gmail.com',
            [email,],
            fail_silently=False
        )
        r.expire(email,60)
        
    @staticmethod 
    def check_email(email,otp) -> bool:
        
        email_otp = r.get(email)
        if(email_otp == otp):
            return 1
        else:
            return 0
    @staticmethod
    def update(
        email,
        username = None,
        fullname = None,
        gender = None, 
        birthday = None, 
        country = None,
        city = None,
        state = None,
        avatar_url = None,
        is_actived = None,
        is_verified = None):
           
            user = get_object_or_404(Users, email = email)
            
            if username:
                user.username = username
            if fullname:
                user.fullname = fullname
            if gender:
                user.gender = gender
            if birthday:
                user.birthday = birthday
            if country:
                user.country = country
            if city:
                user.city = city
            if state:
                user.state = state
            if avatar_url:
                user.avatar_url = avatar_url
            if is_actived:
                user.is_actived = is_actived
            if is_verified:
                user.is_verified = is_verified
            user.save()
    


    