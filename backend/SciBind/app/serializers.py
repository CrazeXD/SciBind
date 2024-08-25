from rest_framework import serializers
from .models import BinderModel, EventModel


class BinderSerializer(serializers.ModelSerializer):
    event = serializers.CharField(source="event.name")
    content = serializers.JSONField(required=False)

    class Meta:
        model = BinderModel
        fields = [
            "id",
            "event",
            "date",
            "shared_with",
            "materialtype",
            "content",
            "old",
            "online_users",
        ]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventModel
        fields = ["id", "name", "division", "materialtype"]
