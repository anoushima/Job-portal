from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models.job_report import JobReport
from ..models.jobs import Job
from ..models.user_reg import User
from ..serializers.job_report import JobReportCreateSerializer, JobReportSerializer
from ..notifications import notify_many


class ReportJobView(APIView):
    """
    POST /api/jobs/<pk>/report/
    A jobseeker reports a job posting as spam/fraud/etc.
    The report is queued for an admin to review; admins are notified.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        if JobReport.objects.filter(job=job, reporter=request.user).exists():
            return Response(
                {"error": "You've already reported this job."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = JobReportCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        report = serializer.save(job=job, reporter=request.user)

        admins = User.objects.filter(role="admin")
        notify_many(
            recipients=admins,
            notif_type="job_reported",
            message=f"{request.user.get_full_name() or request.user.email} reported \"{job.title}\" as {report.get_reason_display().lower()}",
            link="/admin/reports",
        )

        return Response(
            {"message": "Report submitted. Our admin team will review it."},
            status=status.HTTP_201_CREATED,
        )


class AdminReportsListView(generics.ListAPIView):
    """GET /api/admin/reports/ — admin-only feed of all job reports."""
    serializer_class = JobReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != "admin":
            return JobReport.objects.none()
        qs = JobReport.objects.select_related("job", "job__employer", "reporter").all()
        status_filter = self.request.query_params.get("status")
        if status_filter and status_filter != "all":
            qs = qs.filter(status=status_filter)
        return qs

    def list(self, request, *args, **kwargs):
        if request.user.role != "admin":
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_report_status(request, pk):
    """PATCH /api/admin/reports/<pk>/ — admin marks a report reviewed/dismissed."""
    if request.user.role != "admin":
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    try:
        report = JobReport.objects.get(pk=pk)
    except JobReport.DoesNotExist:
        return Response({"error": "Report not found."}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get("status")
    if new_status not in dict(JobReport.STATUS_CHOICES):
        return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

    report.status = new_status
    report.save(update_fields=["status"])
    return Response(JobReportSerializer(report).data)
