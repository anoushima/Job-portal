# insted of manual querying we are creating a custom serializer to avoid crash if login fails and it is easier to extend if needed

# inheriting the class from jwt serializer and customizing get_token and validate


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token= super().get_token(user)
        # controls what data goes inside the jwt token, first it creates normal jwt token and then modify it
    
    # to add cutom tokens

        token['role']=user.role
        return token
    
    def validate(self, attrs):
        data=super().validate(attrs)

        # adding response data

        data['role']=self.user.role
        # collecting username of user while login and displaying it on dashboard purposes
        data['username']=self.user.username

        return data