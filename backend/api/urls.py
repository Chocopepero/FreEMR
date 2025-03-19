from django.urls import path
from .views import application_data, submit_patient, get_patient, submit_scenario, login_page, current_user, logout_view, scenario_data

urlpatterns = [
    path('api/application-data/', application_data),
    path('api/submit-patient/', submit_patient),
    path('api/get-patient/<patient_id>/', get_patient),
    path('api/submit-scenario/', submit_scenario),
    path('api/login/', login_page),
    path('api/current_user/', current_user, name='current_user'),
    path('api/logout/', logout_view, name='logout'),
    path('api/scenario-data/', scenario_data),

]
