from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

from ..models.user_reg import User, Company
from ..models.jobs import Job, Application


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    """
    Returns platform-wide stats for the admin dashboard:
    - total jobseekers, companies, active jobs, total applications
    - percent change vs previous 30 days for each metric
    - recent activity feed (latest users, jobs, applications)
    """
    if request.user.role != "admin":
        return Response({"detail": "Forbidden"}, status=403)

    now = timezone.now()
    thirty_days_ago = now - timedelta(days=30)
    sixty_days_ago = now - timedelta(days=60)

    # ── Current totals ───────────────────────────────────────────────────
    total_jobseekers = User.objects.filter(role="jobseeker").count()
    total_companies = Company.objects.count()
    total_jobs = Job.objects.count()
    total_applications = Application.objects.count()

    # ── Previous period totals (for % change) ───────────────────────────
    prev_jobseekers = User.objects.filter(
        role="jobseeker", date_joined__lt=thirty_days_ago
    ).count()
    prev_companies = Company.objects.filter(
        created_at__lt=thirty_days_ago
    ).count()
    prev_jobs = Job.objects.filter(
        created_at__lt=thirty_days_ago
    ).count()
    prev_applications = Application.objects.filter(
        applied_at__lt=thirty_days_ago
    ).count()

    def pct_change(current, previous):
        if previous == 0:
            return "+100%" if current > 0 else "0%"
        change = ((current - previous) / previous) * 100
        sign = "+" if change >= 0 else ""
        return f"{sign}{change:.0f}%"

    def is_up(current, previous):
        return current >= previous

    # ── Recent activity ──────────────────────────────────────────────────
    # Latest 3 jobseekers
    recent_jobseekers = User.objects.filter(
        role="jobseeker"
    ).order_by("-date_joined")[:3]

    # Latest 3 jobs
    recent_jobs = Job.objects.select_related("employer").order_by("-created_at")[:3]

    # Latest 3 applications
    recent_applications = Application.objects.select_related(
        "user", "job"
    ).order_by("-applied_at")[:3]

    # Latest 2 employers / companies
    recent_companies = Company.objects.select_related("user").order_by("-created_at")[:2]

    # Merge and sort activity by timestamp
    activity = []

    for u in recent_jobseekers:
        activity.append({
            "type": "user",
            "message": f"New jobseeker registered: {u.get_full_name() or u.email}",
            "timestamp": u.date_joined.isoformat(),
        })

    for j in recent_jobs:
        company_name = ""
        try:
            company_name = j.employer.company.name
        except Exception:
            company_name = j.employer.get_full_name() or j.employer.email
        activity.append({
            "type": "job",
            "message": f"New job posted: {j.title} at {company_name}",
            "timestamp": j.created_at.isoformat(),
        })

    for app in recent_applications:
        activity.append({
            "type": "application",
            "message": (
                f"{app.user.get_full_name() or app.user.email} "
                f"applied for {app.job.title}"
            ),
            "timestamp": app.applied_at.isoformat(),
        })

    for c in recent_companies:
        activity.append({
            "type": "employer",
            "message": f"New employer registered: {c.name}",
            "timestamp": c.created_at.isoformat(),
        })

    # Sort all activity newest-first and take top 8
    activity.sort(key=lambda x: x["timestamp"], reverse=True)
    activity = activity[:8]

    return Response({
        "stats": {
            "jobseekers": {
                "value": total_jobseekers,
                "change": pct_change(total_jobseekers, prev_jobseekers),
                "up": is_up(total_jobseekers, prev_jobseekers),
            },
            "companies": {
                "value": total_companies,
                "change": pct_change(total_companies, prev_companies),
                "up": is_up(total_companies, prev_companies),
            },
            "jobs": {
                "value": total_jobs,
                "change": pct_change(total_jobs, prev_jobs),
                "up": is_up(total_jobs, prev_jobs),
            },
            "applications": {
                "value": total_applications,
                "change": pct_change(total_applications, prev_applications),
                "up": is_up(total_applications, prev_applications),
            },
        },
        "recent_activity": activity,
    })
