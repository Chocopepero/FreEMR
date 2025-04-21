from django.urls import path, re_path
from .views.user_views import login_page, current_user, logout_view
from .views.scenario_view import  submit_scenario, get_user_scenarios, get_single_scenario, delete_scenario
from .views.patient_views import submit_patient, get_user_patients, update_patient, delete_patient, get_patient_without_auth
from .views.scenario_view import  submit_scenario, get_user_scenarios, get_single_scenario, delete_scenario, get_scenario_without_auth

urlpatterns = [
    path('api/submit-patient/', submit_patient),
    re_path(r'^api/submit-patient$', submit_patient),

    path('api/get-patient/<str:patient_id>/', get_patient_without_auth),
    re_path(r'^api/get-patient/(?P<patient_id>[^/]+)$', get_patient_without_auth),

    path('api/get_user_patients/', get_user_patients),
    re_path(r'^api/get_user_patients$', get_user_patients),

    path('api/submit-scenario/', submit_scenario),
    re_path(r'^api/submit-scenario$', submit_scenario),

    path('api/login/', login_page),
    re_path(r'^api/login$', login_page),

    path('api/current_user/', current_user, name='current_user'),
    re_path(r'^api/current_user$', current_user, name='current_user'),

    path('api/logout/', logout_view, name='logout'),
    re_path(r'^api/logout$', logout_view, name='logout'),

    path('api/scenario-data/', get_user_scenarios),
    re_path(r'^api/scenario-data$', get_user_scenarios),

    path('api/single-scenario/<uuid:scenario_id>/', get_single_scenario),
    re_path(
        r'^api/single-scenario/(?P<scenario_id>[0-9a-fA-F-]{36})$',
        get_single_scenario
    ),

    path('api/delete-scenario/<uuid:scenario_id>/', delete_scenario),
    re_path(
        r'^api/delete-scenario/(?P<scenario_id>[0-9a-fA-F-]{36})$',
        delete_scenario
    ),

    path('api/update-patient/', update_patient),
    re_path(r'^api/update-patient$', update_patient),

    path('api/delete-patient/<str:patient_id>/', delete_patient),
    re_path(r'^api/delete-patient/(?P<patient_id>[^/]+)$', delete_patient),

    path('api/get-scenario/<str:scenario_id>/', get_scenario_without_auth, name='get-scenario'),
    re_path(
        r'^api/get-scenario/(?P<scenario_id>[^/]+)$',
        get_scenario_without_auth,
        name='get-scenario'
    ),
]
