
from rest_framework_simplejwt.views import TokenObtainPairView
from ..serializers.custom_token import CustomTokenSerializer

class CustomTokenView(TokenObtainPairView):
   serializer_class=CustomTokenSerializer

   
