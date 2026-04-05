from django.db import models
from django.conf import settings
from social.models import SocialAccount


class Post(models.Model):
    STATUS_CHOICES = [
        ("draft", "Rascunho"),
        ("queued", "Agendado"),
        ("published", "Publicado"),
        ("failed", "Falhou"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts"
    )
    text = models.TextField()
    image = models.ImageField(upload_to="posts/", null=True, blank=True)
    platforms = models.ManyToManyField(SocialAccount, blank=True, related_name="posts")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    scheduled_at = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    error_log = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Post #{self.pk} by {self.user.email} [{self.status}]"
