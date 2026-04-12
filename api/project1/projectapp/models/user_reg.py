from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager


#  Custom User Manager (NO username required)
class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


#  Custom User Model
class User(AbstractUser):
    username = None  #  remove username
    email = models.EmailField(unique=True)

    ROLES = (
        ('admin', 'Admin'),
        ('employer', 'Employer'),
        ('jobseeker', 'Job seeker'),
    )

    role = models.CharField(max_length=20, choices=ROLES)
    phone = models.CharField(max_length=15, blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    experience = models.TextField(blank=True, null=True)
    education = models.TextField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()  #  IMPORTANT

    def __str__(self):
        return self.email
    


# 🏢 Company Model
class Company(models.Model):
    INDUSTRY_CHOICES=[
        ("technology","Technology"),
        ("finance","Finance"),
        ("healthcare","Healthcare"),
        ("education", "Education"),
        ("retail", "Retail"),
        ("manufacturing", "Manufacturing"),
        ("other", "Other"),
    ]

    SIZE_CHOICES=[
        ("1-10", "1–10"),
        ("11-50", "11–50"),
        ("51-200", "51–200"),
        ("201-1000", "201–1000"),
        ("1000+", "1000+"),
    ]

    user=models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="company",
    )

    name=models.CharField( max_length=255)
    industry=models.CharField( max_length=50,choices=INDUSTRY_CHOICES,blank=True)
    company_size=models.CharField( max_length=20,choices=SIZE_CHOICES,blank=True)
    location=models.CharField(max_length=255)
    website=models.URLField(blank=True)
    description=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name="Company"
        verbose_name_plural="Companies"

    def __str__(self):
        return self.name