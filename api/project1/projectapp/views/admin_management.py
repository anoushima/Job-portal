from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from ..models.user_reg import Company
from ..models.jobs import Job, Application
from ..serializers.admin import (
    AdminUserSerializer, AdminEmployerSerializer,
    AdminJobSerializer, AdminApplicationSerializer,
)

User = get_user_model()


def _admin_only(request):
    return request.user.is_authenticated and request.user.role == "admin"


# ── Users (jobseekers) ───────────────────────────────────────────────────────
class AdminUsersListView(generics.ListAPIView):
    """GET /api/admin/users/ — all jobseeker accounts, for moderation."""
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not _admin_only(self.request):
            return User.objects.none()
        return User.objects.filter(role="jobseeker").order_by("-date_joined")

    def list(self, request, *args, **kwargs):
        if not _admin_only(request):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)


# ── Employers / companies ────────────────────────────────────────────────────
class AdminEmployersListView(generics.ListAPIView):
    """GET /api/admin/employers/ — all employer/company accounts."""
    serializer_class = AdminEmployerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not _admin_only(self.request):
            return Company.objects.none()
        return Company.objects.select_related("user").order_by("-created_at")

    def list(self, request, *args, **kwargs):
        if not _admin_only(request):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)


# ── Jobs ──────────────────────────────────────────────────────────────────────
class AdminJobsListView(generics.ListAPIView):
    """GET /api/admin/jobs/ — every job posting on the platform."""
    serializer_class = AdminJobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not _admin_only(self.request):
            return Job.objects.none()
        return Job.objects.select_related("employer").order_by("-created_at")

    def list(self, request, *args, **kwargs):
        if not _admin_only(request):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)


# ── Applications ──────────────────────────────────────────────────────────────
class AdminApplicationsListView(generics.ListAPIView):
    """GET /api/admin/applications/ — every application on the platform."""
    serializer_class = AdminApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not _admin_only(self.request):
            return Application.objects.none()
        return Application.objects.select_related("user", "job", "job__employer").order_by("-applied_at")

    def list(self, request, *args, **kwargs):
        if not _admin_only(request):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)


# ── Activate / deactivate any user (jobseeker, employer, or admin) ───────────
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def toggle_user_active(request, pk):
    if not _admin_only(request):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    if user == request.user:
        return Response({"error": "You cannot deactivate your own account."}, status=status.HTTP_400_BAD_REQUEST)

    user.is_active = not user.is_active
    user.save(update_fields=["is_active"])
    return Response({"id": user.id, "is_active": user.is_active})


# ── Activate / deactivate a job posting ──────────────────────────────────────
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def toggle_job_active(request, pk):
    if not _admin_only(request):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

    job.is_active = not job.is_active
    job.save(update_fields=["is_active"])
    return Response({"id": job.id, "is_active": job.is_active})
