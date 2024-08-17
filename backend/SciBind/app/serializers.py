from rest_framework import serializers
from .models import BinderModel, EventModel

class BinderSerializer(serializers.ModelSerializer):
    event = serializers.CharField(source="event.name")
    content = serializers.JSONField(required=False)

    class Meta:
        model = BinderModel
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventModel
        fields = ["id", "name", "division", "materialtype"]
