from rest_framework import serializers
from django.contrib.auth import get_user_model


User=get_user_model()
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['first_name','last_name','username','email','password','role']
        extra_kwargs={
            'password':{'write_only':True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def validate_role(self,value):
        if value=='admin':
            raise serializers.ValidationError("you caanot register as admin")
        return value
       