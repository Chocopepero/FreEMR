from django.urls import path
from .views import application_data, submit_form, get_patient


urlpatterns = [
    path('api/application-data/', application_data),
    path('api/submit-form/', submit_form),
    path('api/get-patient/<patient_id>/', get_patient),

]
