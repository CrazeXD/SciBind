from rest_framework import serializers
from .models import BinderModel, EventModel


class BinderSerializer(serializers.ModelSerializer):
    # Set the event field to the name instead of the id
    event = serializers.CharField(source="event.name")

    class Meta:
        model = BinderModel
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventModel
        fields = ["id", "name", "division", "materialtype"]
