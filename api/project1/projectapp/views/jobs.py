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
    serializer_class=JobSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        search=self.request.query_params.get("search")
        applied_jobs=Application.objects.filter(
            user=self.request.user
        ).values("job_id")
        queryset=Job.objects.exclude(
            id__in=Subquery(applied_jobs)
        ).order_by("-created_at")

        # search
        if search and len(search)>=3:
            queryset=queryset.filter(
                Q(title_icontains=search)|
                Q(loation_icontains=search)|
                Q(loation_icontains=search)
            )
        return queryset


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

# ── Public job list (no auth required) ──────────────────────────────────────
class PublicJobList(generics.ListAPIView):
    """Anyone can browse jobs; no token needed."""
    serializer_class = JobSerializer
    permission_classes = []          # AllowAny

    def get_queryset(self):
        search = self.request.query_params.get("search", "")
        queryset = Job.objects.all().order_by("-created_at")
        if search and len(search) >= 2:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(location__icontains=search)
            )
        return queryset