from datetime import datetime
from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import PatientSerializer, ScenarioSerializer
from ..models import Patient, Medication, Scenario_Medication
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from ..models import Scenario
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import uuid

@api_view(['GET'])
def get_scenario_without_auth(request, scenario_id):

    try:
        scenario = get_object_or_404(Scenario, scenario_id=scenario_id)
        serializer = ScenarioSerializer(scenario)
        data = serializer.data
        
        # Add medication data
        medication_data = []
        for med in scenario.medication.all():
            medication_data.append({
                'medication': med.medication,
                'start_times': med.start_times,
                'stop': med.stop,
                'time': med.time,
                'initial': med.initial,
                'site': med.site,
                'ndc': med.id,
                'dose': med.dose,
                'status': med.status,
                'frequency': med.frequency,
                'prn': med.prn,

            })
        
        data['medication'] = medication_data
        
        return Response(data, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=404)
# Helper function to generate a unique scenario ID
def generate_unique_scenario_id():
    while True:
        # Generate a random UUID
        scenario_id = str(uuid.uuid4())

        # Check if the ID already exists in the database
        if not Scenario.objects.filter(scenario_id=scenario_id).exists():
            return scenario_id

# Helper function to validate patient data
def validate_patient_data(patient_data):
    if 'dob' in patient_data:
        try:
            patient_data['dob'] = datetime.strptime(
                patient_data['dob'], '%Y-%m-%d').date()
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
    return patient

# Helper function to validate medications data
def validate_medications_data(medications_data):
    medication_ids = []
    for med_data in medications_data:

        # Check if 'ndc' exists and is valid
        if 'ndc' not in med_data or med_data['ndc'] is None:
            return Response({'error': 'Missing or invalid ndc field in medication data'}, status=400)

        try:
            med_data['id'] = int(med_data['ndc'])
        except ValueError:
            return Response({'error': 'Invalid ndc format, must be an integer'}, status=400)
            
        if 'stop' in med_data and med_data['stop'] == '':
            med_data['stop'] = None
            
        if 'time' in med_data:
            if med_data['time'] == '' or med_data['time'] is None:
                med_data['time'] = None
            else:
                try:
                    med_data['time'] = int(med_data['time'])
                except ValueError:
                    return Response({'error': f"Invalid time format: {med_data['time']}"}, status=400)

        try:
            try:
                # Try to fetch an existing medication
                medication = Medication.objects.get(id=med_data['id'])
                # Update fields with new values
                medication.medication = med_data.get('medication', medication.medication)
                medication.start_times = med_data.get('start_times', medication.start_times)
                medication.stop = med_data.get('stop', medication.stop)
                medication.time = med_data.get('time', medication.time)
                medication.initial = med_data.get('initial', medication.initial)
                medication.site = med_data.get('site', medication.site)
                medication.status = med_data.get('status', medication.status)
                medication.frequency = med_data.get('frequency', medication.frequency)
                medication.prn = med_data.get('prn', medication.prn)
                medication.dose = med_data.get('dose', medication.dose)
                medication.save()
            except Medication.DoesNotExist:
                # Create new medication if it doesn't exist
                medication = Medication.objects.create(
                    id=med_data['id'],
                    medication=med_data.get('medication'),
                    start_times=med_data.get('start_times'),
                    stop=med_data.get('stop'),
                    time=med_data.get('time'),
                    initial=med_data.get('initial'),
                    site=med_data.get('site'),
                    status=med_data.get('status'),
                    frequency=med_data.get('frequency'),
                    prn=med_data.get('prn'),
                    dose=med_data.get('dose'),
                )
            medication_ids.append(medication.id)
        except Exception as e:
            print(f"Error processing medication: {e}")
            return Response({'error': f"Failed to process medication: {med_data}"}, status=400)
    return medication_ids

def validate_scenario_data(data):
    data = data.copy()
    patient_data = data.pop('patient')
    medications_data = data.pop('medications')
    with transaction.atomic():
        patient = validate_patient_data(patient_data)
        if isinstance(patient, Response):
            return patient

        medication_ids = validate_medications_data(medications_data)
        if isinstance(medication_ids, Response):
            return medication_ids
    
@api_view(['POST'])
@login_required
def submit_scenario(request):
    data = request.data
    # Check if this is an update or a new scenario
    scenario_id = data.get('scenario_id')

    # Validate patient data
    patient_data = data.get('patient')
    if not patient_data:
        return Response({'error': 'Missing patient data'}, status=400)

    patient = validate_patient_data(patient_data)
    if isinstance(patient, Response):  # If validation failed, return the error response
        return patient

    # Validate medications data
    medications_data = data.get('medications')
    if not medications_data:
        return Response({'error': 'Missing medications data'}, status=400)

    medication_ids = validate_medications_data(medications_data)
    if isinstance(medication_ids, Response):  # If validation failed, return the error response
        return medication_ids

    # Prepare scenario data
    scenario_data = {
        "owner": request.user.id,
        "name": data.get("name"),
        "description": data.get("description"),
        "patient": patient.pk,
        "notes": data.get("notes"),
        "diagnosis": data.get("diagnosis"),
        "allergies": data.get("allergies"),
        "medical_doctor": data.get("medical_doctor"),
    }
    if scenario_id:
        scenario_data["scenario_id"] = scenario_id

    try:
        with transaction.atomic():
            if scenario_id:
                scenario_data.pop('owner', None)

                # Scenario Update
                try:
                    scenario_obj = Scenario.objects.get(scenario_id=scenario_id, owner=request.user)
                    print(scenario_obj)
                except Scenario.DoesNotExist:
                    return Response({'error': 'Scenario not found or does not belong to the user'}, 401)
                serializer = ScenarioSerializer(scenario_obj, data=scenario_data, partial=True)
                if serializer.is_valid():
                    # Clear existing medications and re-link them
                    Scenario_Medication.objects.filter(scenario=scenario_obj).delete()
                    scenario_obj = serializer.save()
                    
                    for med_id in medication_ids:
                        medication = Medication.objects.get(id=med_id)
                        Scenario_Medication.objects.create(
                            scenario=scenario_obj,
                            medication=medication,
                            owner=request.user
                        )
                else:
                    return Response(serializer.errors, status=400)
            
            else:
                # Create a new scenario
                scenario_data["scenario_id"] = generate_unique_scenario_id()
                scenario_serializer = ScenarioSerializer(data=scenario_data)
                if scenario_serializer.is_valid():
                    scenario_obj = scenario_serializer.save()
                    
                    # Link medications to the scenario
                    for med_id in medication_ids:
                        medication = Medication.objects.get(id=med_id)
                        Scenario_Medication.objects.create(
                            scenario=scenario_obj,
                            medication=medication,
                            owner=request.user
                        )
                else:
                    return Response(scenario_serializer.errors, status=400)

    except Medication.DoesNotExist:
        return Response({'error': f'Medication with id {med_id} does not exist'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

    return Response({'message': 'Scenario saved successfully'}, status=200)

@login_required
def get_user_scenarios(request):
    user = request.user.id

    # Fetch scenarios owned by the user or the global user
    scenarios = Scenario.objects.filter(
        Q(owner=user) | Q(owner__username='global')
    ).values()
    for scenario in scenarios:
        patient_obj = Patient.objects.get(pk=scenario["patient_id"])
        scenario["patient_name"] = patient_obj.name


    return JsonResponse({
        'scenarios': list(scenarios)
    })


@login_required
def get_single_scenario(request, scenario_id):
    scenario = get_object_or_404(Scenario, scenario_id=scenario_id)
    if request.user != scenario.owner:
        return JsonResponse({'error': 'Scenario does not belong to this user.'}, status=401)
    serializer = ScenarioSerializer(scenario)
    scenario_data = serializer.data
    scenario_medications = Scenario_Medication.objects.filter(scenario=scenario)
    medications = [
        {
            'medication': med.medication.medication,
            'start_times': med.medication.start_times,
            'stop': med.medication.stop,
            'time': med.medication.time,
            'initial': med.medication.initial,
            'site': med.medication.site,
            'ndc': med.medication.id,
            'dose': med.medication.dose,
            'status': med.medication.status,
            'frequency': med.medication.frequency,
            'prn': med.medication.prn,
        }
        for med in scenario_medications
    ]
    scenario_data['medication'] = medications
    return JsonResponse(scenario_data)

@api_view(['POST', 'DELETE'])
@login_required
def delete_scenario(request, scenario_id):
    try:
        scenario = Scenario.objects.get(scenario_id=scenario_id)
    except Scenario.DoesNotExist:
        return Response({'error': f'Scenario with id {scenario_id} does not exist'}, status=400)
    if request.user != scenario.owner:
        return JsonResponse({'error': 'Scenario does not belong to this user.'}, status=401)
    scenario_medications = Scenario_Medication.objects.filter(scenario=scenario)
    scenario_medications.delete()
    scenario.delete()

    remaining_scenarios = Scenario.objects.filter(owner=request.user)
    serializer = ScenarioSerializer(remaining_scenarios, many=True)

    return Response({
        'message': 'Scenario deleted successfully',
        'scenarios': serializer.data
    }, status=200)