import os
import re

from django.conf import settings
from django.contrib.auth import authenticate
from django.http import FileResponse, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from django.db.models import Q

from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets

from .models import BinderModel, EventModel, User
from .serializers import BinderSerializer, EventSerializer

import json


def get_user(request):
    if "Authorization" not in request.headers:
        return None
    token = request.headers.get("Authorization").split(" ")[1]
    try:
        user = Token.objects.get(key=token).user
        return user
    except Token.DoesNotExist:
        return None


class Binders(viewsets.ModelViewSet):
    """
    A viewset for handling operations related to binders.
    Args:
        request: The request object.
    Returns:
        Response: A response containing data of all binders serialized.
    """

    model = BinderModel
    serializer_class = BinderSerializer
    queryset = BinderModel.objects.all()

    def retrieve(self, request, pk=None):
        user = get_user(request)
        if user is None:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )
        instance = self.get_object()
        if instance.owner != user and user not in instance.shared_with.all():
            return Response(
                {"error": "You don't have permission to view this binder"},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request):
        user = get_user(request)
        if user is None:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )
        queryset = BinderModel.objects.filter(
            Q(owner=user) | Q(shared_with=user), old=False
        ).distinct()
        serializer = BinderSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        user = get_user(request)
        if user is None:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )
        request.data["owner"] = user.id
        return super().create(request)

    def update(self, request, *args, **kwargs):
        user = get_user(request)
        if user is None:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )

        instance = self.get_object()
        if instance.owner != user and user not in instance.shared_with.all():
            return Response(
                {"error": "You don't have permission to edit this binder"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if content := request.data.get("content"):
            try:
                json_content = json.loads(content)
                request.data["content"] = json.dumps(json_content)
            except json.JSONDecodeError:
                return Response(
                    {"error": "Invalid JSON content"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


# Binder Card Component Event Image
def get_binder_image(request, pk):
    user = get_user(request)
    if user is None:
        return HttpResponse("Invalid token", status=status.HTTP_400_BAD_REQUEST)
    try:
        binder = BinderModel.objects.get(id=pk)
    except BinderModel.DoesNotExist:
        return HttpResponse("Binder not found", status=status.HTTP_404_NOT_FOUND)
    if binder.old:
        return HttpResponse(
            "Binder has been archived", status=status.HTTP_404_NOT_FOUND
        )
    elif binder.owner != user and user not in binder.shared_with.all():
        return HttpResponse(
            "You don't have permission to view this binder",
            status=status.HTTP_403_FORBIDDEN,
        )
    event = binder.event
    file_path = event.display_image
    if os.path.exists(file_path):
        response = FileResponse(open(file_path, "rb"))
        response[
            "Content-Disposition"
        ] = f"inline; filename={os.path.basename(file_path)}"
        return response
    else:
        return HttpResponse("Image not found", status=status.HTTP_404_NOT_FOUND)


class Events(viewsets.ModelViewSet):
    """
    A viewset for handling operations related to Science Olympiad events.
    """

    model = EventModel
    serializer_class = EventSerializer
    queryset = EventModel.objects.all()

    def list(self, request):
        user = get_user(request)
        if user is None:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        queryset = EventModel.objects.all()
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        # Get the user
        user = get_user(request)
        if user is None:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED
            )
        # Get the event
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# User views
@csrf_exempt
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login(request):
    """
    A view for handling login requests.

    Args:
        request: The request object.

    Returns:
        Response: A response containing the user's token.
    """
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
        )
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register(request):
    """
    A view for handling registration requests.

    Args:
        request: The request object.

    Returns:
        Response: A response containing the user's token.
    """
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=first_name,
        last_name=last_name,
    )
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """
    A view for handling logout requests.

    Args:
        request: The request object.

    Returns:
        Response: A response containing a message.
    """
    request.user.auth_token.delete()
    return Response({"message": "Successfully logged out"})


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def user(request):
    """
    A view for handling user requests.

    Args:
        request: The request object.

    Returns:
        Response: A response containing the user's data.
    """
    user = get_user(request)
    if user is None:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(
        {
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
    )


@api_view(["GET"])
def profile_picture(request):
    """
    A view for handling profile picture requests.

    Args:
        request: The request object.

    Returns:
        Response: A response containing the user's profile picture.
    """
    user = get_user(request)
    if user is None:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    if user.profile_picture:
        file_path = os.path.join(str(user.profile_picture))
        if os.path.exists(file_path):
            response = FileResponse(open(file_path, "rb"))
            response[
                "Content-Disposition"
            ] = f"inline; filename={os.path.basename(file_path)}"
            return response
    return Response(
        {"error": "Profile picture not found"}, status=status.HTTP_404_NOT_FOUND
    )


@api_view(["POST"])
def validate_token(request):
    """
    A view for handling token validation requests.

    Args:
        request: The request object.

    Returns:
        Response: A response containing a message.
    """
    user = get_user(request)
    if user is None:
        return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({"message": "Token is valid"})


@api_view(["POST"])
def set_events(request):
    """
    A view for handling setting events requests.

    Args:
        request: The request object.

    Returns:
        Response: A response containing a message.
    """
    user = get_user(request)
    if user is None:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    # TODO: Add logic for event division migration
    # Get the new set of event IDs
    new_event_ids = set(request.data.get("events", []))

    # Get the current set of event IDs
    current_event_ids = set(user.chosen_events.values_list("id", flat=True))

    # Find events to add and remove
    events_to_add = new_event_ids - current_event_ids
    events_to_remove = current_event_ids - new_event_ids

    # Remove events
    user.chosen_events.remove(*events_to_remove)

    # Add new events
    for event_id in events_to_add:
        try:
            event = EventModel.objects.get(id=event_id)
            user.chosen_events.add(event)
        except EventModel.DoesNotExist:
            return Response(
                {"error": f"Event with id {event_id} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    # Update binders
    BinderModel.objects.filter(owner=user).update(old=True)

    for event in user.chosen_events.all():
        binder, created = BinderModel.objects.get_or_create(owner=user, event=event)
        binder.old = False
        binder.save()

    return Response({"message": "Events set successfully"})


@api_view(["GET"])
def get_events(request):
    """
    A view for handling getting events requests.

    Args:
        request: The request object.

    Returns:
        Response: A response containing the user's chosen events.
    """
    user = get_user(request)
    if user is None:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    events = user.chosen_events.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)
