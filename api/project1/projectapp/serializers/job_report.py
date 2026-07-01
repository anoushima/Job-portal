from rest_framework import serializers
from ..models.job_report import JobReport


class JobReportCreateSerializer(serializers.ModelSerializer):
    """Used by a jobseeker to file a report against a job posting.
    `job` and `reporter` are supplied by the view (from the URL pk and the
    authenticated user) rather than the request body."""

    class Meta:
        model = JobReport
        fields = ["id", "job", "reason", "description", "status", "created_at"]
        read_only_fields = ["id", "job", "status", "created_at"]


class JobReportSerializer(serializers.ModelSerializer):
    """Used by the admin reports dashboard — includes job + reporter context."""

    job_title = serializers.CharField(source="job.title", read_only=True)
    job_id = serializers.IntegerField(source="job.id", read_only=True)
    employer_name = serializers.SerializerMethodField()
    reporter_name = serializers.SerializerMethodField()
    reporter_email = serializers.EmailField(source="reporter.email", read_only=True)
    reason_display = serializers.CharField(source="get_reason_display", read_only=True)

    class Meta:
        model = JobReport
        fields = [
            "id",
            "job_id",
            "job_title",
            "employer_name",
            "reporter_name",
            "reporter_email",
            "reason",
            "reason_display",
            "description",
            "status",
            "created_at",
        ]

    def get_employer_name(self, obj):
        try:
            return obj.job.employer.company.name
        except Exception:
            return obj.job.employer.get_full_name() or obj.job.employer.email

    def get_reporter_name(self, obj):
        return obj.reporter.get_full_name() or obj.reporter.email
