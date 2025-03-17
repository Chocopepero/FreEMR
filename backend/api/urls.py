from django.urls import path
from .views import application_data, submit_patient, get_patient


urlpatterns = [
    path('api/application-data/', application_data),
    path('api/submit-patient/', submit_patient),
    path('api/get-patient/<patient_id>/', get_patient),

]
