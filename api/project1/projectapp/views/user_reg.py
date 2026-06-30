from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..serializers.user_reg import RegisterSerializer,CompanySerializer,EmployerRegisterSerializer
from ..models.user_reg import Company, User
from ..notifications import notify, notify_many
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.views import APIView


# jobseeker view
@api_view(['POST'])
def register_jobseeker(request):
    data = request.data.copy()
    data['role'] = 'jobseeker'  

    serializer = RegisterSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Jobseeker registered"}, status=201)

    return Response(serializer.errors, status=400)


class EmployerRegisterView(APIView):
    """
    POST /api/accounts/employer/register/
    Public endpoint — no authentication required.
    Creates a User + Company in a single atomic transaction.
    """
    permission_classes = [AllowAny]
 
    def post(self, request):
        serializer = EmployerRegisterSerializer(data=request.data)
 
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
        user = serializer.save()

        # Notify every admin so they can review/approve the new company.
        admins = User.objects.filter(role="admin")
        company_name = getattr(getattr(user, "company", None), "name", user.email)
        notify_many(
            recipients=admins,
            notif_type="company_registered",
            message=f"New company registered: {company_name} — pending review",
            link="/admin/employers",
        )
 
        return Response(
            {"detail": "Employer account created successfully. Please log in."},
            status=status.HTTP_201_CREATED,
        )
 
 
class CompanyProfileView(APIView):
    """
    GET  /api/accounts/company/
    PUT  /api/accounts/company/
    Protected — employer must be authenticated.
    """
    permission_classes = [IsAuthenticated]
 
    def _get_company(self, user):
        try:
            return user.company
        except Company.DoesNotExist:
            return None
 
    def get(self, request):
        company = self._get_company(request.user)
        if not company:
            return Response(
                {"detail": "No company profile found for this user."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(CompanySerializer(company).data)
 
    def put(self, request):
        company = self._get_company(request.user)
        if not company:
            return Response(
                {"detail": "No company profile found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = CompanySerializer(company, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data)