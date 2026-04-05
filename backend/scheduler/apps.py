from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)


class SchedulerConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "scheduler"

    def ready(self):
        from apscheduler.schedulers.background import BackgroundScheduler
        from apscheduler.triggers.interval import IntervalTrigger
        from .jobs import process_scheduled_posts

        scheduler = BackgroundScheduler(timezone="America/Sao_Paulo")
        scheduler.add_job(
            process_scheduled_posts,
            trigger=IntervalTrigger(minutes=1),
            id="process_scheduled_posts",
            replace_existing=True,
        )
        scheduler.start()
        logger.info("Scheduler iniciado — verificando posts agendados a cada 1 minuto.")
