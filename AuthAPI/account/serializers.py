from xml.dom import ValidationErr
from rest_framework import serializers
from account.utils import Util
from account.models import MyUser
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class UserRegistrationSerializers(serializers.ModelSerializer):
    confirm_password = serializers.CharField(style={'input_type':"password"}, write_only= True)
    class Meta:
        model = MyUser
        fields = ['email', 'First_name', 'Last_Name', 'password', 'confirm_password', 'Term']
        extra_kwargs={
            'password' : {'write_only': True }  
        }
        # we use validate method for password and Comfirm_Password while cx Registration
    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        if password != confirm_password:
            raise serializers.ValidationError("password and Comfirm_Password Not Match")    
        return attrs
        
    def create(self, validate_data):
        return MyUser.objects.create_user(**validate_data)
    
class UserLogInSerializers(serializers.ModelSerializer):
    email = serializers.EmailField(max_length = 225)
    class Meta:
        model = MyUser
        fields = ['email', 'password']

class ProfileSerializers(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'email', 'First_name', 'Last_Name']

class UserChangePasswordSerializers(serializers.ModelSerializer):
    password = serializers.CharField(max_length = 255, style = {'input_type': 'password'}, write_only=True)
    confirm_password = serializers.CharField(max_length = 255, style = {'input_type': 'password'}, write_only=True)
    class Meta:
        model = MyUser
        fields = ['password', 'confirm_password']

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        user = self.context.get("user") ## check under UserChangePasswordView
        if password != confirm_password:
            raise serializers.ValidationError("password and Comfirm_Password Not Match")  
        user.set_password(password)
        user.save()  
        return attrs
    
class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length = 255)
    class Meta:
        
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')
        if MyUser.objects.filter(email = email).exists():
            user = MyUser.objects.get(email = email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            print('Encoded UID', uid)
            token = PasswordResetTokenGenerator().make_token(user)
            print('Password rest Token', token)
            link='http://localhost:3000/api/user/reset/'+uid+ '/'+token
            print('Password Reset link', link)
            body = f"Click here to reset your password: <a href='{link}'>Reset Password</a>"
            # body = "click here " + link
            data ={
                "subject":'Reset Your Password', 
                'body': body,
                'to_email': user.email
            }
            Util.send_email(data)
            return attrs
        else:
            raise serializers.ValidationErr('You are not a Registered User')
        
class UserRestPinSerializer(serializers.Serializer):
    password = serializers.CharField(max_length= 255, style={'input_type':'password'}, write_only=True)
    confirm_password = serializers.CharField(max_length= 255, style={'input_type':'password'}, write_only=True)
    class Meta:
        fields =['password', 'confirm_password']

    def validate(self, attrs):
            password = attrs.get('password')
            confirm_password = attrs.get('confirm_password')
            uid = self.context.get('uid')
            token = self.context.get('token')
            if password != confirm_password:
                raise serializers.ValidationError({"non_field_errors":["password and Comfirm_Password Not Match"]})  
            try:
                id = smart_str(urlsafe_base64_decode(uid))
                user = MyUser.objects.get(id = id)
            except (DjangoUnicodeDecodeError, MyUser.DoesNotExist):
                raise serializers.ValidationErr({"non_field_errors":["Invalid UID."]})
            # if not PasswordResetTokenGenerator().check_token(user, token): No need this line
            # If an error is raised before user is defined, the following line will crash:
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError({"non_field_errors": ["Token is invalid or has expired."]})

            user.set_password(password)
            user.save()  
            return attrs
    