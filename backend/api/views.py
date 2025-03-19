import api
from django.db.models import Q
from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import PatientSerializer, ScenarioSerializer, MedicationSerializer
from .models import Patient, Scenario, Medication
from datetime import datetime


# Create your views here.

@api_view(['GET'])
def application_data(request):
    data = {
        "appName": "Test Data",
        "version": "1.0.0",
        "description": "This is CORS Test Data."
    }
    return JsonResponse(data)

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
def submit_scenario(request):
    data = request.data
    patient_data = data.pop('patient')
    medications_data = data.pop('medications')

    existing_patient = Patient.objects.get(patient_id=patient_data['patient_id'])
    existing_patient_serializer = PatientSerializer(existing_patient)
    # Normalize the date field for comparison
    normalized_existing = existing_patient_serializer.data.copy()
    if 'dob' in patient_data:
        try:
            # Convert incoming dob string to a date object
            patient_data['dob'] = datetime.strptime(patient_data['dob'], '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format for dob'}, status=400)
        
    # Save or get the patient
    try:
        existing_patient = Patient.objects.get(patient_id=patient_data['patient_id'])
        existing_patient_serializer = PatientSerializer(existing_patient)
        normalized_existing = existing_patient_serializer.data.copy()

        # Normalize the date field for comparison
        if 'dob' in normalized_existing:
            normalized_existing['dob'] = datetime.strptime(normalized_existing['dob'], '%Y-%m-%d').date()

        # Normalize numeric fields for comparison
        for field in ['height', 'weight']:
            if field in normalized_existing:
                normalized_existing[field] = str(normalized_existing[field])
            if field in patient_data:
                patient_data[field] = str(patient_data[field])

        if normalized_existing == patient_data:
            patient = existing_patient
        else:
            print(f"Patient data does not match for patient_id {patient_data['patient_id']}")
            return Response({'error': 'Patient data does not match existing record'}, status=400)
    except Patient.DoesNotExist:
        # Save the new patient
        patient_serializer = PatientSerializer(data=patient_data)
        if patient_serializer.is_valid():
            patient = patient_serializer.save()
        else:
            print(f"Patient serializer errors: {patient_serializer.errors}")
            return Response(patient_serializer.errors, status=400)

    # Save medications
    medication_ids = []
    for med_data in medications_data:
        # Convert time to integer or set to None if empty
        if 'time' in med_data and med_data['time'] == '':
            med_data['time'] = None
        if 'time' in med_data and med_data['time'] is not None:
            try:
                med_data['time'] = int(med_data['time'])
            except ValueError:
                return Response({'error': 'Invalid integer format for time'}, status=400)

        med_serializer = MedicationSerializer(data=med_data)
        if med_serializer.is_valid():
            medication = med_serializer.save()
            medication_ids.append(medication.id)
        else:
            print(f"Medication serializer errors: {med_serializer.errors}")
            return Response(med_serializer.errors, status=400)

    # Create the scenario
    scenario_data = {
        "scenario_id": data.get("scenario_id"),
        "name": data.get("name"),
        "description": data.get("description"),
        "patient": patient.patient_id,
        "medication": medication_ids
    }
    scenario_serializer = ScenarioSerializer(data=scenario_data)
    if scenario_serializer.is_valid():
        scenario_serializer.save()
        return Response({'message': 'Form submitted successfully'}, status=200)
    print(f"Scenario serializer errors: {scenario_serializer.errors}")
    return Response(scenario_serializer.errors, status=400)

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

@login_required
def scenario_data(request):
    user = request.user.id
    print(user)

    # Fetch scenarios owned by the user or the global user
    scenarios = Scenario.objects.filter(
        Q(owner=user) | Q(owner__username='global')
    ).values(
        'scenario_id', 'name', 'description', 'patient', 'medication'
    )

    return JsonResponse({
        'scenarios': list(scenarios),
    })
