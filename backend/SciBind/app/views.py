import os

from django.conf import settings
from django.contrib.auth import authenticate
from django.http import FileResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from django.db.models import Q

from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets

from .models import BinderModel, EventModel, User
from .serializers import BinderSerializer, EventSerializer

def get_user(request):
    if 'Authorization' not in request.headers:
        return None
    token = request.headers.get('Authorization').split(' ')[1]
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
    def list(self, request):
        user = get_user(request)
        if user is None:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = BinderModel.objects.filter(Q(owner=user) | Q(shared_with=user)).distinct()
        serializer = BinderSerializer(queryset, many=True)
        return Response(serializer.data)
    def create(self, request):
        user = get_user(request)
        if user is None:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        request.data['owner'] = user.id
        return super().create(request)

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
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        queryset = EventModel.objects.all()
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)

# User views
@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """
    A view for handling login requests.

    Args:
        request: The request object.

    Returns:
        Response: A response containing the user's token.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """
    A view for handling registration requests.

    Args:
        request: The request object.

    Returns:
        Response: A response containing the user's token.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name, last_name=last_name)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key})

@api_view(['POST'])
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
    return Response({'message': 'Successfully logged out'})

@api_view(['GET'])
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
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({
        'username': user.username, 
        'email': user.email, 
        'first_name': user.first_name, 
        'last_name': user.last_name,
    })
    
@api_view(['GET'])
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
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    if user.profile_picture:
        file_path = os.path.join(settings.MEDIA_ROOT, str(user.profile_picture))
        if os.path.exists(file_path):
            response = FileResponse(open(file_path, 'rb'))
            response['Content-Disposition'] = (
                f'inline; filename={os.path.basename(file_path)}'
            )
            return response
    return Response({'error': 'Profile picture not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
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
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({'message': 'Token is valid'})

@api_view(['POST'])
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
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    user.chosen_events.clear()
    for event in request.data['events']:
        try:
            event = EventModel.objects.get(name=event)
            user.chosen_events.add(event)
        except EventModel.DoesNotExist:
            print(f'Event {event} not found')
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'message': 'Events set'})