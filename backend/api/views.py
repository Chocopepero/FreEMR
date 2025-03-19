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

# Helper function to generate a unique scenario ID
def generate_unique_scenario_id():
    while True:
        # Generate a random UUID
        scenario_id = str(uuid.uuid4())
        
        # Check if the ID already exists in the database
        if not Scenario.objects.filter(scenario_id=scenario_id).exists():
            return scenario_id

@api_view(['POST'])
@login_required
def submit_scenario(request):
    data = request.data
    patient_data = data.pop('patient')
    medications_data = data.pop('medications')

    # Handle patient data
    if 'dob' in patient_data:
        try:
            patient_data['dob'] = datetime.strptime(patient_data['dob'], '%Y-%m-%d').date()
        except ValueError as e:
            print(f"Error parsing dob: {e}")
            return Response({'error': 'Invalid date format for dob'}, status=400)

    try:
        patient = Patient.objects.get(patient_id=patient_data['patient_id'])
    except Patient.DoesNotExist:
        patient_serializer = PatientSerializer(data=patient_data)
        if patient_serializer.is_valid():
            patient = patient_serializer.save()
        else:
            print(f"Patient serializer errors: {patient_serializer.errors}")
            return Response(patient_serializer.errors, status=400)

    # Handle medications
    medication_ids = []
    for med_data in medications_data:
        if 'ndc' not in med_data:
            return Response({'error': 'Missing ndc field in medication data'}, status=400)

        try:
            med_data['id'] = int(med_data.pop('ndc'))  # Convert ndc to an integer
        except ValueError:
            return Response({'error': 'Invalid ndc format, must be an integer'}, status=400)

        if 'time' in med_data:
            if med_data['time'] == '':
                med_data['time'] = None
            else:
                try:
                    med_data['time'] = int(med_data['time'])
                except ValueError:
                    return Response({'error': f"Invalid time format: {med_data['time']}"}, status=400)

        medication, created = Medication.objects.get_or_create(
            id=med_data['id'],
            defaults={
                'medication': med_data.get('medication'),
                'start': med_data.get('start'),
                'stop': med_data.get('stop'),
                'time': med_data.get('time'),
                'initial': med_data.get('initial'),
                'site': med_data.get('site'),
            }
        )
        medication_ids.append(medication.id)

    # Create the scenario without medications
    scenario_data = {
        "scenario_id": generate_unique_scenario_id(),
        "owner": request.user.id,
        "name": data.get("name"),
        "description": data.get("description"),
        "patient": patient.patient_id,
    }
    scenario_serializer = ScenarioSerializer(data=scenario_data)
    if scenario_serializer.is_valid():
        scenario = scenario_serializer.save()
    else:
        print(f"Scenario serializer errors: {scenario_serializer.errors}")
        return Response(scenario_serializer.errors, status=400)

    # Add medications to the scenario
    for med_id in medication_ids:
        try:
            medication = Medication.objects.get(id=med_id)
            scenario.medication.add(medication)
        except Medication.DoesNotExist:
            return Response({'error': f'Medication with id {med_id} does not exist'}, status=400)

    return Response({'message': 'Form submitted successfully'}, status=200)

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

    # Fetch scenarios owned by the user or the global user
    scenarios = Scenario.objects.filter(
        Q(owner=user) | Q(owner__username='global')
    ).values(
        'scenario_id', 'name', 'description', 'patient', 'medication'
    )

    return JsonResponse({
        'scenarios': list(scenarios),
    })
