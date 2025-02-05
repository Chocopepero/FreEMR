import api
from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import PatientSerializer


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
def submit_form(request):
    print(request.data)
    serializer = PatientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Form submitted successfully'}, status=200)
    return Response(serializer.errors, status=400)
