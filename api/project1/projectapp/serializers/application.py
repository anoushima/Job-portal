from rest_framework import serializers
from ..models.jobs import Application


class ApplicationSerializer(serializers.ModelSerializer):
    """
    Used in two places:
    - Employer's "Review Applications" list -> needs the APPLICANT's identity.
    - Jobseeker's "Track Applications" list  -> needs the JOB's identity + a
      job_id so the row can link back to /jobs/<id>.

    """

    job_title = serializers.CharField(source="job.title", read_only=True)
    job_id = serializers.IntegerField(source="job.id", read_only=True)
    location = serializers.CharField(source="job.location", read_only=True)

    applicant = serializers.SerializerMethodField()
    applicant_name = serializers.SerializerMethodField()
    applicant_email = serializers.EmailField(source="user.email", read_only=True)
    applicant_phone = serializers.CharField(source="user.phone", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "job_id",
            "job_title",
            "location",
            "applicant",
            "applicant_name",
            "applicant_email",
            "applicant_phone",
            "applied_at",
            "status",
        ]

    def get_applicant_name(self, obj):
        full_name = obj.user.get_full_name()
        return full_name.strip() if full_name and full_name.strip() else obj.user.email

    def get_applicant(self, obj):
        # Kept for backwards compatibility with any existing frontend code
        # that still reads `applicant` directly.
        return self.get_applicant_name(obj)
