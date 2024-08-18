from django.apps import AppConfig
from django.db.models.signals import post_migrate


class AppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app"

    def ready(self):
        from django.core.management import call_command

        def load_csv_data(sender, **kwargs):
            from app.models import EventModel

            if not EventModel.objects.exists():
                call_command("load_csv", "lib/events.csv")

        post_migrate.connect(load_csv_data, sender=self)
