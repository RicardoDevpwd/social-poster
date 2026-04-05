from rest_framework import serializers
from .models import Post
from social.models import SocialAccount


class PostSerializer(serializers.ModelSerializer):
    platforms = serializers.PrimaryKeyRelatedField(
        many=True, queryset=SocialAccount.objects.all(), required=False
    )
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Post
        fields = (
            "id", "text", "image", "platforms", "status",
            "scheduled_at", "published_at", "error_log", "created_at",
        )
        read_only_fields = ("id", "status", "published_at", "error_log", "created_at")

    def validate_platforms(self, platforms):
        user = self.context["request"].user
        for account in platforms:
            if account.user != user:
                raise serializers.ValidationError("Conta social não pertence ao usuário.")
        return platforms
