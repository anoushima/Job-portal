from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models.user_reg import Company
from ..models.jobs import Job, Application

User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    """Jobseeker row for the admin "Users" page."""

    full_name = serializers.SerializerMethodField()
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "email", "full_name", "first_name", "last_name",
            "phone", "is_active", "date_joined", "applications_count",
        ]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.email

    def get_applications_count(self, obj):
        return Application.objects.filter(user=obj).count()


class AdminEmployerSerializer(serializers.ModelSerializer):
    """Company/employer row for the admin "Employers" page."""

    user_id = serializers.IntegerField(source="user.id", read_only=True)
    contact_name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)
    is_active = serializers.BooleanField(source="user.is_active", read_only=True)
    jobs_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            "id", "user_id", "name", "contact_name", "email", "industry",
            "company_size", "location", "website", "is_active",
            "jobs_count", "created_at",
        ]

    def get_contact_name(self, obj):
        return obj.user.get_full_name() or obj.user.email

    def get_jobs_count(self, obj):
        return Job.objects.filter(employer=obj.user).count()


class AdminJobSerializer(serializers.ModelSerializer):
    """Job row for the admin "Jobs" page."""

    company_name = serializers.SerializerMethodField()
    employer_email = serializers.EmailField(source="employer.email", read_only=True)
    applications_count = serializers.SerializerMethodField()
    reports_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id", "title", "location", "salary", "is_active", "created_at",
            "company_name", "employer_email", "applications_count", "reports_count",
        ]

    def get_company_name(self, obj):
        try:
            return obj.employer.company.name
        except Exception:
            return obj.employer.get_full_name() or obj.employer.email

    def get_applications_count(self, obj):
        return Application.objects.filter(job=obj).count()

    def get_reports_count(self, obj):
        return obj.reports.count()


class AdminApplicationSerializer(serializers.ModelSerializer):
    """Application row for the admin "Applications" overview page."""

    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.SerializerMethodField()
    applicant_name = serializers.SerializerMethodField()
    applicant_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id", "job_title", "company_name", "applicant_name",
            "applicant_email", "applied_at", "status",
        ]

    def get_company_name(self, obj):
        try:
            return obj.job.employer.company.name
        except Exception:
            return obj.job.employer.get_full_name() or obj.job.employer.email

    def get_applicant_name(self, obj):
        return obj.user.get_full_name() or obj.user.email
