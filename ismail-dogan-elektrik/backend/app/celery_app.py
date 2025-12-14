from celery import Celery
from app.config import settings

celery_app = Celery(
    "ismail_dogan_elektrik",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.notifications", "app.tasks.reports"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Europe/Istanbul",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,
    task_soft_time_limit=240,
    worker_prefetch_multiplier=4,
    result_expires=3600,
    beat_schedule={
        "cleanup-expired-bookings": {
            "task": "app.tasks.reports.cleanup_expired_bookings",
            "schedule": 3600.0,  # Her saat
        },
        "send-daily-report": {
            "task": "app.tasks.reports.send_daily_report",
            "schedule": {
                "hour": 8,
                "minute": 0,
            },
        },
        "send-reminder-notifications": {
            "task": "app.tasks.notifications.send_booking_reminders",
            "schedule": 1800.0,  # Her 30 dakika
        },
    },
)
