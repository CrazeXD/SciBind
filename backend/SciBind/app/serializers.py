from rest_framework import serializers
from .models import Binder

class BinderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Binder
        fields = '__all__'