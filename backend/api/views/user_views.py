from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

# Create your views here.

@api_view(['POST'])
def login_page(request):
    # Check if the HTTP request method is POST (form submission)
    username = request.POST.get('username')
    password = request.POST.get('password')
    
    if not username or not password:
        return JsonResponse({'success': False, 'error': 'Username and password are required'}, status=400)

    username = username.lower()

    # Check if a user with the provided username exists
    if not User.objects.filter(username=username).exists():
        return JsonResponse({'success': False, 'error': 'Invalid username'}, status=400)

    # Authenticate the user with the provided username and password
    user = authenticate(username=username, password=password)
    
    if user is None:
        return JsonResponse({'success': False, 'error': 'Invalid password'}, status=400)
    # Log in the user and redirect to the home page upon successful login
    login(request._request, user)
    print("Logged in")
    return JsonResponse({'success': True, 'message': 'Login successful'})

@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'username': request.user.username,
            'email':    request.user.email,
            'user_id':  request.user.id,
        })
    else:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
@api_view(['POST'])
def logout_view(request):
    auth_request = getattr(request, '_request', request)
    logout(auth_request)
    return JsonResponse({'success': True, 'message': 'Logged out successfully'})



