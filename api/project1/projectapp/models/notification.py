from django.db import models
from django.conf import settings


class Notification(models.Model):
    TYPE_CHOICES = [
        ("application_update", "Application Update"),   # → jobseeker: status changed
        ("job_match", "Job Match"),                       # → jobseeker: new job matching skills
        ("new_applicant", "New Applicant"),                # → employer: someone applied
        ("company_registered", "Company Registered"),      # → admin: new company signed up
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    notif_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    message = models.CharField(max_length=255)
    link = models.CharField(max_length=255, blank=True)  # frontend route to navigate to
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.notif_type}] -> {self.recipient}: {self.message}"
