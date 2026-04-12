from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views.user_reg import register_jobseeker,CompanyProfileView,EmployerRegisterView
from .views.login import CustomTokenView
from .views.jobs import CreateJob,Joblist,JobDetail,ApplyJob,EmployerApplications,TrackApplications,update_application_status,EmployerJobs,employer_shortlisted_count
from .views.parse_resume import parse_resume



urlpatterns = [
    path('register/jobseeker/',register_jobseeker),
    path('employer/register/',EmployerRegisterView.as_view(),name="employer-register"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("company/", CompanyProfileView.as_view(), name="company-profile"),
    path('token/',CustomTokenView.as_view(),name='token'),
    path("jobs/",CreateJob.as_view(),name="jobs"),
    path("jobs/list/",Joblist.as_view(),name="job-list"),
    path("jobs/<int:pk>/",JobDetail.as_view(),name="job-detail"),
    path("jobs/<int:pk>/apply/",ApplyJob.as_view(),name="apply-job"),
    path("employer/applications/",EmployerApplications.as_view(),name="employer-applications"),
    path("applications/track/",TrackApplications.as_view(),name="track-applications"),
    path("applications/<int:pk>/",update_application_status),
    path("employer/jobs/",EmployerJobs.as_view()),
    # path("employer/applications/count/",employer_application_count),
    path("employer/applications/shortlisted-count/",employer_shortlisted_count),
    path("parse-resume/",parse_resume)
    
    
]
