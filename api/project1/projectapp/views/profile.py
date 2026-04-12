from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..serializers.profile import JobseekerProfileSerializer, EmployerProfileSerializer
from ..models.user_reg import Company


class JobseekerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = JobseekerProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = JobseekerProfileSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            company = request.user.company
        except Company.DoesNotExist:
            return Response({"detail": "No company profile found."}, status=404)

        data = {
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "phone": request.user.phone,
            "company": EmployerProfileSerializer(company).data,
        }
        return Response(data)

    def put(self, request):
        try:
            company = request.user.company
        except Company.DoesNotExist:
            return Response({"detail": "No company profile found."}, status=404)

        # Update user fields
        user = request.user
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.phone = request.data.get("phone", user.phone)
        user.save()

        # Update company fields
        company_data = request.data.get("company", {})
        serializer = EmployerProfileSerializer(company, data=company_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone": user.phone,
                "company": serializer.data,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)