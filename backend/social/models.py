from django.db import models
from django.conf import settings


class SocialAccount(models.Model):
    PLATFORM_CHOICES = [
        ("instagram", "Instagram"),
        ("twitter", "Twitter / X"),
        ("facebook", "Facebook"),
        ("linkedin", "LinkedIn"),
        ("tiktok", "TikTok"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="social_accounts"
    )
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    account_name = models.CharField(max_length=100, blank=True)
    access_token = models.TextField()
    token_secret = models.TextField(blank=True)
    extra_data = models.JSONField(default=dict, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "platform")

    def __str__(self):
        return f"{self.user.email} — {self.platform}"
