from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer
from .publishers import dispatch_publish


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user).prefetch_related("platforms")

    def perform_create(self, serializer):
        scheduled_at = serializer.validated_data.get("scheduled_at")
        post_status = "queued" if scheduled_at else "draft"
        serializer.save(user=self.request.user, status=post_status)

    @action(detail=True, methods=["post"], url_path="publish")
    def publish_now(self, request, pk=None):
        post = self.get_object()
        if post.status == "published":
            return Response({"detail": "Post já publicado."}, status=status.HTTP_400_BAD_REQUEST)

        errors = []
        for account in post.platforms.all():
            result = dispatch_publish(account, post)
            if not result["success"]:
                errors.append(f"{account.platform}: {result['error']}")

        if errors:
            post.error_log = "\n".join(errors)
            post.status = "failed"
        else:
            post.status = "published"
            post.published_at = timezone.now()
        post.save()

        return Response(PostSerializer(post, context={"request": request}).data)
