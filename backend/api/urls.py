from django.urls import path
from .views import application_data

urlpatterns = [
    path('api/application-data/', application_data),
]
