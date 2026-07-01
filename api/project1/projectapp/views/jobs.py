from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt 
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Subquery,Q


from ..models.jobs import Job,Application
from ..serializers.jobs import JobSerializer
from ..serializers.application import ApplicationSerializer
from ..notifications import notify


@method_decorator(csrf_exempt,name='dispatch')
class CreateJob(generics.CreateAPIView):
    queryset=Job.objects.all()
    serializer_class=JobSerializer
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]

    def perform_create(self, serializer):
        print("REQUEST USER:", self.request.user)
        print("AUTH HEADER:", self.request.headers.get("Authorization"))
        serializer.save(employer=self.request.user)


class Joblist(generics.ListAPIView):
    """
    Jobseeker's job list.

    Behavior:
    - If the jobseeker has filled in their `skills` field, jobs whose
      title/description/location mention any of those skills are
      returned first (as "matches"); everything else still shows up
      below them so nothing is hidden from the jobseeker.
    - If the jobseeker has NOT set any skills yet, all jobs are
      returned in normal recency order (no filtering at all).
    - A `match` boolean field is added to each job in the response so
      the frontend can label "Matches your skills" vs other jobs.
    """
    serializer_class=JobSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        search=self.request.query_params.get("search")
        applied_jobs=Application.objects.filter(
            user=self.request.user
        ).values("job_id")
        queryset=Job.objects.filter(is_active=True).exclude(
            id__in=Subquery(applied_jobs)
        ).order_by("-created_at")

        # search
        if search and len(search)>=3:
            queryset=queryset.filter(
                Q(title__icontains=search)|
                Q(location__icontains=search)
            )
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        raw_skills = (request.user.skills or "").strip()
        skill_terms = [s.strip() for s in raw_skills.split(",") if s.strip()] if raw_skills else []

        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        if not skill_terms:
            # No skills set yet → return everything as-is, no matching applied.
            for item in data:
                item["match"] = False
            return Response(data)

        # Skills are set → tag matches and sort them to the top,
        # but still include non-matching jobs ("explore jobs") below.
        skill_terms_lower = [t.lower() for t in skill_terms]

        def is_match(job):
            haystack = f"{job.get('title','')} {job.get('description','')} {job.get('location','')}".lower()
            return any(term in haystack for term in skill_terms_lower)

        for item in data:
            item["match"] = is_match(item)

        data.sort(key=lambda item: item["match"], reverse=True)
        return Response(data)


class JobDetail(generics.RetrieveAPIView):
    queryset=Job.objects.all()
    serializer_class=JobSerializer


class ApplyJob(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request,pk):
        job=Job.objects.get(pk=pk)
        application,created=Application.objects.get_or_create(
            user=request.user,
            job=job        )
        if not created:
            return Response(
                {"message":"already applied"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Notify the employer who owns this job
        applicant_name = request.user.get_full_name() or request.user.email
        notify(
            recipient=job.employer,
            notif_type="new_applicant",
            message=f"{applicant_name} applied for {job.title}",
            link="/employer/applications",
        )

        return Response({"message":"Application submitted"})
    

class EmployerApplications(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        status = self.request.query_params.get("status")

        queryset = Application.objects.filter(
            job__employer=self.request.user
        )

        if status and status != "all":
            queryset = queryset.filter(status=status)

        return queryset.select_related("job", "user")

class TrackApplications(generics.ListAPIView):
    serializer_class=ApplicationSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(
            user=self.request.user
        ).select_related("job")
    

@api_view(["PATCH"])
def update_application_status(request, pk):

    new_status = request.data.get("status")
    application = Application.objects.get(id=pk)

    #  Prevent changes after rejected
    if application.status == "rejected":
        return Response(
            {"error": "Cannot change status after rejection"},
            status=400
        )

    #  Prevent reject after shortlisted
    if application.status == "shortlisted" and new_status == "rejected":
        return Response(
            {"error": "Shortlisted application cannot be rejected"},
            status=400
        )

    application.status = new_status
    application.save()

    # Notify the jobseeker that their application status changed
    status_labels = {
        "viewed": "viewed",
        "shortlisted": "shortlisted",
        "rejected": "rejected",
    }
    label = status_labels.get(new_status, new_status)
    notify(
        recipient=application.user,
        notif_type="application_update",
        message=f"Your application for {application.job.title} was {label}",
        link="/my-applications",
    )

    return Response({"message": "status updated"})



# displaying job counts on employer dashboard
class EmployerJobs(generics.ListAPIView):
    serializer_class=JobSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(employer=self.request.user)
    


# displaying the number of people who are shortlisted

@api_view(["GET"])
def employer_shortlisted_count(request):
    count=Application.objects.filter(
        job__employer=request.user,
        status="shortlisted"
    ).count()

    return Response({
        "shortlisted_count":count
    })

# ── Withdraw / undo a mistaken application ──────────────────────────────────
class WithdrawApplication(APIView):
    """
    DELETE /api/applications/<pk>/withdraw/
    Lets a jobseeker undo an application they made by mistake.
    Only the applicant who owns the application can withdraw it, and only
    their own row — this is intentionally NOT restricted by status, since
    "applied by mistake" can happen the instant after clicking Apply, before
    an employer has reacted at all.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            application = Application.objects.get(pk=pk, user=request.user)
        except Application.DoesNotExist:
            return Response(
                {"error": "Application not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        application.delete()
        return Response({"message": "Application withdrawn"}, status=status.HTTP_200_OK)


# ── Public job list (no auth required) ──────────────────────────────────────
class PublicJobList(generics.ListAPIView):
    """Anyone can browse jobs; no token needed."""
    serializer_class = JobSerializer
    permission_classes = []          # AllowAny

    def get_queryset(self):
        search = self.request.query_params.get("search", "")
        queryset = Job.objects.filter(is_active=True).order_by("-created_at")
        if search and len(search) >= 2:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(location__icontains=search)
            )
        return queryset