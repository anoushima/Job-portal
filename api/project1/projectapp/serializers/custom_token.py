from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()


class CustomTokenSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD  # picks up "email" from the model

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["email"] = user.email
        return token

    def validate(self, attrs):
        # attrs key matches username_field i.e. "email"
        data = super().validate(attrs)
        data["role"] = self.user.role
        data["email"] = self.user.email
        return data