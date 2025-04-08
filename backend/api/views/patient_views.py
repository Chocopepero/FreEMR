from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import PatientSerializer
from ..models import Patient
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

@api_view(['POST'])
@login_required
def submit_patient(request):
    print(request.data)
    serializer = PatientSerializer(data=request.data)
    new_list = Patient.objects.filter(Q(owner=request.user) | Q(owner__username='global'))
    new_list_serializer = PatientSerializer(new_list, many=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Form submitted successfully', 
            'patients': new_list_serializer.data                 
        }, status=200)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_patient(request, patient_id):
    print(request)
    patient = get_object_or_404(Patient, patient_id=patient_id)
    serializer = PatientSerializer(patient)
    return Response(serializer.data, status=200)

@login_required
def get_user_patients(request):
    patients = Patient.objects.filter(
        Q(owner=request.user) | Q(owner__username='global')
    ).values()

    for patient in patients:
        patient['owner'] = patient.pop('owner_id')

    return JsonResponse({
        'patients': list(patients)
    })

@api_view(['POST'])
@login_required
def update_patient(request):
    patient_data = request.data.get('patient')
    try:
        patient_obj = Patient.objects.get(pk = patient_data.patient_id)
    except Patient.DoesNotExist:
        return Response({'error': 'Patient not found'}, 400)
    patient_serializer = PatientSerializer(patient_obj, data=patient_data, partial=True)
    if patient_serializer.is_valid():
        patient_serializer.save()
    else:
        return Response({'error':'Patient data invalid'}, status=400)
    return Response({'message': 'Patient updated successfully'}, status=200)

@api_view(['POST', 'DELETE'])
@login_required
def delete_patient(request, patient_id):    
    try:
        patient = Patient.objects.get(patient_id=patient_id)
    except Patient.DoesNotExist:
        return Response({'error': f'Patient with id {patient_id} does not exist'}, status=400)
    if request.user != patient.owner:
        return JsonResponse({'error': 'Patient does not belong to this user.'}, status=401)
    patient.delete()

    remaining_patients = Patient.objects.filter(Q(owner=request.user) | Q(owner__username='global'))
    serializer = PatientSerializer(remaining_patients, many=True)

    return Response({
        'message': 'Patient deleted successfully',
        'patients': serializer.data
    }, status=200)