from django.urls import path
#from .views import application_data
from . import views

urlpatterns = [
    #path('api/application-data/', application_data),
    path('api/submit-form/', views.submit_form, name='submit_form'),
]
