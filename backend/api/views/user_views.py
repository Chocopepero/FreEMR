import api
import uuid
from django.db.models import Q
from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import PatientSerializer, ScenarioSerializer, MedicationSerializer
from ..models import Patient, Scenario, Medication, Scenario_Medication
from datetime import datetime
from django.db import transaction


# Create your views here.
@api_view(['POST'])
def submit_patient(request):
    print(request.data)
    serializer = PatientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Form submitted successfully'}, status=200)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_patient(request, patient_id):
    print(request)
    patient = get_object_or_404(Patient, patient_id=patient_id)
    serializer = PatientSerializer(patient)
    return Response(serializer.data, status=200)


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

@api_view(['GET'])
def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'username': request.user.username,
            'email': request.user.email,
        })
    else:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
@api_view(['POST'])
def logout_view(request):
    auth_request = getattr(request, '_request', request)
    logout(auth_request)
    return JsonResponse({'success': True, 'message': 'Logged out successfully'})

