from django.db import models
from django.conf import settings
from .jobs import Job


class JobReport(models.Model):
    """A jobseeker's report that a job posting looks like spam/fraud/etc."""

    REASON_CHOICES = [
        ("spam", "Spam or misleading"),
        ("fraud", "Looks fraudulent / scam"),
        ("offensive", "Offensive content"),
        ("expired", "Job no longer exists"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("reviewed", "Reviewed"),
        ("dismissed", "Dismissed"),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="reports")
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="job_reports"
    )
    reason = models.CharField(max_length=20, choices=REASON_CHOICES, default="spam")
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("job", "reporter")

    def __str__(self):
        return f"Report on {self.job} by {self.reporter}"
