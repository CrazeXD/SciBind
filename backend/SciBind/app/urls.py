from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BinderViewSet

router = DefaultRouter()
router.register(r'binders', BinderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]