from django.urls import path
from .views import application_data
from .views import submit_form

urlpatterns = [
    path('api/application-data/', application_data),
    path('api/submit-form/', submit_form),

]
