from django.db import models
from django.conf import settings




class Job(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    salary = models.CharField(max_length=100)
    employer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title
    





    

class Application(models.Model):

    STATUS_CHOICES=[
    ("pending","Pending"),
    ("viewed","Viewed"),
    ("shortlisted","Shortlisted"),
    ("rejected","Rejected"),
    ]
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    job=models.ForeignKey(Job,on_delete=models.CASCADE)
    applied_at=models.DateTimeField(auto_now_add=True)
    status=models.CharField(max_length=20,choices=STATUS_CHOICES,default="pending")

    class Meta:
        unique_together=('user','job')

    def __str__(self):
        return f"{self.user} applied to {self.job}"