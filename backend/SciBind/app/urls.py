from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import Binders, Events
from .views import (
    register,
    login,
    logout,
    user,
    profile_picture,
    validate_token,
    set_events,
    get_events,
    get_binder_image,
)


router = DefaultRouter()
router.register(r"binders", Binders, basename="binders")
router.register(r"events", Events, basename="events")

urlpatterns = [
    path("", include(router.urls)),
    path("register/", register),
    path("login/", login),
    path("logout/", logout),
    path("user/", user),
    path("picture/", profile_picture),
    path("verify/", validate_token),
    path("event-set/", set_events),
    path("user-events/", get_events),
    path("get_binder_image/<int:pk>/", get_binder_image),
]
