

import os
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

User = get_user_model()


def _make_jwt(user):
    """Return access + refresh tokens with role and email claims."""
    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role
    refresh["email"] = user.email
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": user.role,
        "email": user.email,
    }


class GoogleSignInView(APIView):
    """
    POST /api/auth/google/
    Body: { "credential": "<Google ID token string>" }

    Optional body field:
        "role": "jobseeker" | "employer"   (only applied to NEW accounts)
    """
    permission_classes = [AllowAny]

    def post(self, request):
        credential = request.data.get("credential", "").strip()
        if not credential:
            return Response(
                {"detail": "credential is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client_id = os.getenv("GOOGLE_CLIENT_ID")
        if not client_id:
            return Response(
                {"detail": "GOOGLE_CLIENT_ID is not configured on the server."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # ── 1. Verify the ID token with Google ────────────────────────────
        try:
            payload = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                client_id,
            )
        except ValueError as exc:
            return Response(
                {"detail": f"Invalid Google token: {exc}"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        email = payload.get("email", "").lower()
        if not email:
            return Response(
                {"detail": "Google did not provide an email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        first_name = payload.get("given_name", "")
        last_name = payload.get("family_name", "")

        # ── 2. Determine role for NEW users ───────────────────────────────
        requested_role = request.data.get("role", "jobseeker")
        if requested_role not in ("jobseeker", "employer"):
            requested_role = "jobseeker"

        # ── 3. Get or create the user ─────────────────────────────────────
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "role": requested_role,
            },
        )

        if not created:
            # Fill in missing name fields if they were blank
            changed = False
            if not user.first_name and first_name:
                user.first_name = first_name
                changed = True
            if not user.last_name and last_name:
                user.last_name = last_name
                changed = True
            if changed:
                user.save(update_fields=["first_name", "last_name"])

        # ── 4. Return JWT ─────────────────────────────────────────────────
        return Response(_make_jwt(user), status=status.HTTP_200_OK)