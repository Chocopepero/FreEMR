from datetime import datetime
from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import PatientSerializer, ScenarioSerializer
from ..models import Patient, Medication, Scenario_Medication
from .decorators import login_required
from django.db.models import Q
from ..models import Scenario
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import uuid

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

    with transaction.atomic():
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

        medication_ids = []
        for med_data in medications_data:
            if 'ndc' not in med_data:
                return Response({'error': 'Missing ndc field in medication data'}, status=400)

            try:
                med_data['id'] = int(med_data.pop('ndc')) 
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

            try:
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
            except Exception as e:
                print(f"Error creating medication: {e}")
                return Response({'error': f"Failed to process medication: {med_data}"}, status=400)
        scenario_data = {
            "scenario_id":generate_unique_scenario_id(),
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

        for med_id in medication_ids:
            try:
                medication = Medication.objects.get(id=med_id)
                Scenario_Medication.objects.create(
                    scenario=scenario,
                    medication=medication,
                    owner=request.user
                )
            except Medication.DoesNotExist:
                return Response({'error': f'Medication with id {med_id} does not exist'}, status=400)

    return Response({'message': 'Form submitted successfully'}, status=200)

@login_required
def get_user_scenarios(request):
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

@login_required
def get_single_scenario(request, scenario_id):
    scenario = get_object_or_404(Scenario, scenario_id=scenario_id)
    if request.user != scenario.owner:
        return JsonResponse({'error': 'Scenario does not belong to this user.'}, status=401 )
    serializer = ScenarioSerializer(scenario)
    return JsonResponse(serializer.data)