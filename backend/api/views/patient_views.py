from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..serializers import PatientSerializer
from ..models import Patient
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

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

@login_required
def get_user_patients(request):
    user = request.user.id

    patients = Patient.objects.filter(
        Q(owner=user) | Q(owner__username='global')
    ).values()

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