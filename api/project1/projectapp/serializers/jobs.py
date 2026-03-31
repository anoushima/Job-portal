from rest_framework import serializers
from ..models.jobs import Job,Application

class JobSerializer(serializers.ModelSerializer):
    applied=serializers.SerializerMethodField()
    class Meta:
        model=Job
        fields="__all__"
        read_only_fields=["employer"]

    def get_applied(self,obj):
        request=self.context.get("request")
        if not request or request.user.is_anonymous:
            return False
        user=request.user
        return Application.objects.filter(user=user,job=obj).exists()