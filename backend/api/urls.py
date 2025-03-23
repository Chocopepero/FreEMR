from django.urls import path
from .views.user_views import submit_patient, get_patient, login_page, current_user, logout_view
from .views.scenario_view import  submit_scenario, get_user_scenarios, get_single_scenario

urlpatterns = [
    path('api/submit-patient/', submit_patient),
    path('api/get-patient/<str:patient_id>/', get_patient),
    path('api/submit-scenario/', submit_scenario),
    path('api/login/', login_page),
    path('api/current_user/', current_user, name='current_user'),
    path('api/logout/', logout_view, name='logout'),
    path('api/scenario-data/', get_user_scenarios),
    path('api/single-scenario/<uuid:scenario_id>/', get_single_scenario)

]
