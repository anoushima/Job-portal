from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # ✅ Add custom fields inside JWT
        token['role'] = user.role
        token['email'] = user.email

        return token

    def validate(self, attrs):
        print(" CUSTOM TOKEN SERIALIZER RUNNING")  # ✅ debug

        data = super().validate(attrs)

        # ✅ Add extra response data
        data['role'] = self.user.role
        data['email'] = self.user.email

        return data