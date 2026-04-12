from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models.user_reg import Company

User = get_user_model()


class JobseekerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "phone",
            "skills",
            "education",
        ]
        extra_kwargs = {"email": {"read_only": True}}

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class EmployerProfileSerializer(serializers.ModelSerializer):
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
        extra_kwargs = {"id": {"read_only": True}, "created_at": {"read_only": True}}