from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from ..models.user_reg import Company


User=get_user_model()
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['first_name','last_name','email','password','role','phone','skills','experience','education']
        extra_kwargs={
            'password':{'write_only':True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def validate_role(self,value):
        if value=='admin':
            raise serializers.ValidationError("you caanot register as admin")
        return value


class EmployerRegisterSerializer(serializers.Serializer):
    full_name=serializers.CharField(max_length=255)
    email=serializers.EmailField()
    password=serializers.CharField(write_only=True,min_length=4)
    confirm_password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    # company details
    company_name=serializers.CharField(max_length=255)
    industry=serializers.CharField(max_length=50,required=False,allow_blank=True)
    company_size=serializers.CharField(max_length=20, required=False, allow_blank=True)
    location=serializers.CharField(max_length=255)  # Fix 3: was URLField, must be CharField
    website=serializers.CharField(required=False,allow_blank=True)
    description=serializers.CharField(required=False,allow_blank=True)

    # validation
    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists")
        return value.lower()

    def validate(self, attrs):
        try:
            validate_password(attrs["password"])
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        return attrs

    # create
    @transaction.atomic
    def save(self):
        data = self.validated_data

        # Split full name into first/last
        name_parts = data["full_name"].strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        # Fix 4: removed username= (field doesn't exist), added role="employer"
        user = User.objects.create_user(
            email=data["email"],
            password=data["password"],
            first_name=first_name,
            last_name=last_name,
            role="employer",
        )

        Company.objects.create(
            user=user,
            name=data["company_name"],
            industry=data.get("industry", ""),
            company_size=data.get("company_size", ""),
            location=data["location"],
            website=data.get("website", ""),
            description=data.get("description", ""),
        )

        return user
 
 
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "industry",
            "company_size",
            "location",
            "website",
            "description",
            "created_at",
        ]