from django.urls import path
from .views.user_views import login_page, current_user, logout_view
from .views.scenario_view import  submit_scenario, get_user_scenarios, get_single_scenario, delete_scenario
from .views.patient_views import submit_patient, get_patient, get_user_patients, update_patient, delete_patient
from .views.scenario_view import  submit_scenario, get_user_scenarios, get_single_scenario, delete_scenario, get_scenario_without_auth
from .views.patient_views import submit_patient, get_patient_without_auth, get_user_patients, update_patient

urlpatterns = [
    path('api/submit-patient/', submit_patient),
    path('api/get-patient/<str:patient_id>/', get_patient_without_auth),
    path('api/get_user_patients/', get_user_patients),
    path('api/submit-scenario/', submit_scenario),
    path('api/login/', login_page),
    path('api/current_user/', current_user, name='current_user'),
    path('api/logout/', logout_view, name='logout'),
    path('api/scenario-data/', get_user_scenarios),
    path('api/single-scenario/<uuid:scenario_id>/', get_single_scenario),
    path('api/delete-scenario/<uuid:scenario_id>/', delete_scenario),
    path('api/update-patient/', update_patient),
    path('api/delete-patient/<str:patient_id>/', delete_patient),
    path('api/get-scenario/<str:scenario_id>/', get_scenario_without_auth, name='get-scenario'),
]
