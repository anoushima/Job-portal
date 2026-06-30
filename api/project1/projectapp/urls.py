# projectapp/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views.user_reg import register_jobseeker, CompanyProfileView, EmployerRegisterView
from .views.login import CustomTokenView
from .views.jobs import (
    CreateJob, Joblist, JobDetail, ApplyJob,
    EmployerApplications, TrackApplications, update_application_status,
    EmployerJobs, employer_shortlisted_count, PublicJobList,
)
from .views.parse_resume import parse_resume
from .views.profile import JobseekerProfileView, EmployerProfileView
from .views.google_auth import GoogleSignInView   # ← NEW
from .views.admin_stats import admin_stats
from .views.notifications import (
    NotificationListView, mark_notification_read, mark_all_notifications_read,
)


urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────────────────
    path('register/jobseeker/', register_jobseeker),
    path('employer/register/', EmployerRegisterView.as_view(), name='employer-register'),
    path('token/', CustomTokenView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # ── Google Sign-In ─────────────────────────────────────────────────────
    # React POSTs the Google credential (ID token) here; gets back our JWT.
    path('auth/google/', GoogleSignInView.as_view(), name='google-signin'),

    # ── Company ────────────────────────────────────────────────────────────
    path('company/', CompanyProfileView.as_view(), name='company-profile'),
    path('company/register/', CompanyProfileView.as_view(), name='company-register'),

    # ── Jobs ───────────────────────────────────────────────────────────────
    path('jobs/', CreateJob.as_view(), name='jobs'),
    path('jobs/list/', Joblist.as_view(), name='job-list'),
    path('jobs/public/', PublicJobList.as_view(), name='public-job-list'),
    path('jobs/<int:pk>/', JobDetail.as_view(), name='job-detail'),
    path('jobs/<int:pk>/apply/', ApplyJob.as_view(), name='apply-job'),

    # ── Applications ───────────────────────────────────────────────────────
    path('employer/applications/', EmployerApplications.as_view(), name='employer-applications'),
    path('applications/track/', TrackApplications.as_view(), name='track-applications'),
    path('applications/<int:pk>/', update_application_status),
    path('employer/applications/shortlisted-count/', employer_shortlisted_count),
    path('employer/applications/count/', EmployerApplications.as_view()),
    path('employer/jobs/', EmployerJobs.as_view()),

    # ── Admin ──────────────────────────────────────────────────────────────
    path('admin/stats/', admin_stats, name='admin-stats'),

    # ── Notifications ──────────────────────────────────────────────────────
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', mark_notification_read, name='notification-read'),
    path('notifications/read-all/', mark_all_notifications_read, name='notification-read-all'),

    # ── Misc ───────────────────────────────────────────────────────────────
    path('parse-resume/', parse_resume),
    path('profile/jobseeker/', JobseekerProfileView.as_view(), name='jobseeker-profile'),
    path('profile/employer/', EmployerProfileView.as_view(), name='employer-profile'),
]
