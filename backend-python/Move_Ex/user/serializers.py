from rest_framework import serializers
import re
from .models import Users
from django.shortcuts import get_object_or_404
from Common.messenge import NOT_MATCH_PASSWORD,WRONG_FORM
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fiedls = '__all__'

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(required = False)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)
    repeat_password = serializers.CharField(min_length=8)    
    def validate(self, data):
        if data['password'] != data['repeat_password']:
            raise serializers.ValidationError(NOT_MATCH_PASSWORD)
        elif not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$',data['email']) :
            raise serializers.ValidationError(WRONG_FORM)
        return data
class ActiveSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()
    def validate(self, data):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$',data['email']) :
            raise serializers.ValidationError(WRONG_FORM)
        return data

class UpdateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(required = False)
    fullname = serializers.CharField(required = False)
    birthday = serializers.DateField(required = False) 
    country = serializers.CharField(required = False)
    city = serializers.CharField(required = False)
    state = serializers.CharField(required = False)
    avatar_url = serializers.CharField(required = False)
    is_actived = serializers.CharField(required = False)
    is_verified = serializers.CharField(required = False)
class SendEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    def validate(self, data):
        user = get_object_or_404(Users, email = data['email'])
        return data
        
