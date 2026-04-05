from rest_framework import serializers
from .models import SocialAccount


class SocialAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialAccount
        fields = (
            "id", "platform", "account_name", "access_token",
            "token_secret", "extra_data", "expires_at", "is_active", "created_at",
        )
        read_only_fields = ("id", "created_at")
        extra_kwargs = {
            "access_token": {"write_only": True},
            "token_secret": {"write_only": True},
        }
