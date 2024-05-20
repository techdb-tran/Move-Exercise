from django.db import models
from enum import Enum
from django.core.validators import MaxValueValidator
import bcrypt
# Create your models here.
class gender_class(Enum):
    male = 'male'
    female = 'female'
    other = 'other'
class Users(models.Model):
    id = models.IntegerField(primary_key=True)
    email = models.EmailField(null=True)
    password = models.CharField(max_length=255)
    username = models.CharField(max_length=50)
    fullname = models.CharField(max_length=50)
    gender = models.CharField(null=True,max_length=100)
    birthday = models.TimeField(null=True)
    country = models.CharField(max_length=25,null=True)
    city = models.CharField(max_length=25,null=True)
    state = models.CharField(max_length=25,null=True)
    avatar_url = models.TextField(null=True)
    is_actived = models.IntegerField(MaxValueValidator(1),null=True)  
    is_verified = models.IntegerField(MaxValueValidator(1),null=True)  
    created_at = models.DateField()
    updated_at = models.DateField()
    class Meta:
        managed = False
        db_table = 'users'

    def authenticate(self,password):
        password_bytes = password.encode('utf-8')
        hashpass = self.password.encode('utf-8')
        if bcrypt.checkpw(password_bytes,hashpass) :
            return self
        else:
            return None
class Users_baned(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(Users,on_delete=models.CASCADE)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    is_permaban = models.BooleanField()
    ban_expired_at = models.DateField(null=True)
    class Meta:
        managed = False
        db_table = 'user_bans'
