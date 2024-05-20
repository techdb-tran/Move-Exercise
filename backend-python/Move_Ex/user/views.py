from django.shortcuts import render,get_object_or_404
from .service import UserService
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterSerializer,ActiveSerializer,UpdateSerializer,SendEmailSerializer
from rest_framework.exceptions import ValidationError
from rest_framework import status
from .service import UserService
from django.core.mail import send_mail
from django.db import IntegrityError
from Common.messenge import INTERGRITY_EMAIL,NOT_EXIST_EMAIL,IS_NOT_ACTIVED,TMP_BANED,FOREVER_BANED
from .models import Users,Users_baned
from .token import RedisTokenBackend
from datetime import datetime
# Create your views here.
class Register(APIView):
    def post(self,request,format = None):
        try:
            serialize = RegisterSerializer(data = request.data)
            if serialize.is_valid():
                UserService.create(
                    request.data['password'],
                    request.data['email'],
                )
                return Response("Created",status= status.HTTP_201_CREATED)
            else:
                return Response(serialize.errors,status= status.HTTP_400_BAD_REQUEST)
        except IntegrityError :
            return Response(INTERGRITY_EMAIL,status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response("?",status=status.HTTP_400_BAD_REQUEST)      

class Active(APIView):
    def post(self,request,*args, **kwargs):
        try:
            serialize = ActiveSerializer(data= request.data)
            if serialize.is_valid() : 
                data = serialize.validated_data
                if UserService.check_email(**data) :
                    UserService.update(email= request.data["email"],is_actived=1)
                    return Response("Actived!",status=status.HTTP_202_ACCEPTED)
                else:
                    return Response("Invalid",status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST) 
            
class SendEmail(APIView):
    def post(self,request,*args, **kwargs):
        try:
            serialize = SendEmailSerializer(data= request.data)
            if serialize.is_valid():
                data = serialize.validated_data
                UserService.send_otp(**data)
                return Response("Sent!",status=status.HTTP_200_OK)
        except Exception as e:
            return Response(NOT_EXIST_EMAIL,status=status.HTTP_404_NOT_FOUND) 

class Login(APIView):
    def post(self,request,*args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        user = get_object_or_404(Users,email = email)
         
        user = user.authenticate(password=password)
        tokens = RedisTokenBackend()
        if user is not None :
            try:
                is_ban = Users_baned.objects.get(user_id = user.id)
                now = datetime.now()
                if is_ban.is_permaban == 1:
                    return Response(FOREVER_BANED,status=status.HTTP_403_FORBIDDEN)
                elif is_ban.ban_expired_at > now :
                    return Response(TMP_BANED,status=status.HTTP_403_FORBIDDEN)
                else:
                    return Response(tokens.create_token(email=email),status=status.HTTP_200_OK)
            except Users_baned.DoesNotExist:
                if (user.is_actived == 1):
                    return Response(tokens.create_token(email=email),status=status.HTTP_200_OK)
                else:
                    return Response(IS_NOT_ACTIVED,status=status.HTTP_403_FORBIDDEN)
            #...    
        else:
            return Response(user,status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)