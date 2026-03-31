from rest_framework import serializers
from ..models.jobs import Application

class ApplicationSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(source="job.title", read_only=True)
    applicant = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Application
        fields = ["id", "job_title", "applicant", "applied_at", "status"]