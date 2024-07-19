from rest_framework import viewsets
from .models import Binder
from .serializers import BinderSerializer

class BinderViewSet(viewsets.ModelViewSet):
    queryset = Binder.objects.all()
    serializer_class = BinderSerializer
