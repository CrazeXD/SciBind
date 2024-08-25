import csv
from django.core.management.base import BaseCommand
from django.db import transaction
from app.models import EventModel


class Command(BaseCommand):
    help = "Load events from a CSV file"

    def add_arguments(self, parser):
        parser.add_argument("csv_file", type=str)

    def handle(self, *args, **kwargs):
        MODIFY = input("Do you want to modify existing events? (y/n): ")
        MODIFY = MODIFY.lower() == "y"
        if EventModel.objects.exists():
            self.stdout.write(
                self.style.WARNING("Events already loaded. Modifying events...")
            )
            with open(kwargs["csv_file"], "r") as f:
                reader = csv.DictReader(f)
                with transaction.atomic():
                    for row in reader:
                        name, division = row["Name"], row["Division"]
                        if event := EventModel.objects.get(
                            name=name, division=division
                        ):
                            if MODIFY:
                                event.materialtype = row.get(
                                    "Material Type", event.materialtype
                                )
                                event.display_image = row.get(
                                    "Image Name", event.display_image
                                )
                                event.description = row.get(
                                    "Description", event.description
                                )
                                event.category = row.get("Category", event.category)
                                event.save()
                                self.stdout.write(
                                    self.style.SUCCESS(
                                        f"Event '{name}' modified successfully."
                                    )
                                )
                            else:
                                self.stdout.write(
                                    self.style.WARNING(
                                        f"Event '{name}' skipped for modification."
                                    )
                                )
                        else:
                            self.stdout.write(
                                self.style.WARNING(f"Event '{name}' does not exist.")
                            )
            self.stdout.write(self.style.SUCCESS("Events modified successfully."))
        else:
            self.stdout.write(
                self.style.WARNING(
                    "No events found. Please load events from CSV first."
                )
            )
