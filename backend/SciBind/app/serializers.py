from rest_framework import serializers
from .models import BinderModel, EventModel

class BinderSerializer(serializers.ModelSerializer):
    class Meta:
        model = BinderModel
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventModel
        fields = '__all__'