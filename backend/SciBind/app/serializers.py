from rest_framework import serializers
from .models import Binder, Event

class BinderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Binder
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'