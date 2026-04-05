import logging
from django.utils import timezone

logger = logging.getLogger(__name__)


def process_scheduled_posts():
    """Job executado a cada minuto para publicar posts agendados."""
    from posts.models import Post
    from posts.publishers import dispatch_publish

    now = timezone.now()
    due_posts = Post.objects.filter(status="queued", scheduled_at__lte=now)

    for post in due_posts:
        errors = []
        for account in post.platforms.all():
            result = dispatch_publish(account, post)
            if not result["success"]:
                errors.append(f"{account.platform}: {result['error']}")
                logger.error("Falha ao publicar post #%s em %s: %s", post.pk, account.platform, result["error"])

        if errors:
            post.error_log = "\n".join(errors)
            post.status = "failed"
        else:
            post.status = "published"
            post.published_at = timezone.now()

        post.save()
        logger.info("Post #%s processado com status '%s'.", post.pk, post.status)
