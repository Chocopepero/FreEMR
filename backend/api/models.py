from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

# Create your models here.
class Patient(models.Model):
    patient_id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=100)
    dob = models.DateField()
    sex = models.CharField(max_length=1)
    room_num = models.CharField(max_length=100)
    height = models.FloatField()
    weight = models.FloatField()

    def __str__(self):
        return f"{self.name} ({self.patient_id})"
    
class Medication(models.Model):
    id = models.IntegerField()
    medication = models.CharField(max_length=100, primary_key=True)
    start = models.IntegerField(validators=[MinValueValidator(0)])
    stop = models.IntegerField(validators=[MinValueValidator(0)])
    time = models.IntegerField(blank=True, null=True)
    initial = models.CharField(max_length=5, blank=True, null=True)
    site = models.CharField(max_length=5, blank=True, null=True)

    def __str__(self):
        return f"({self.medication})"
    
def get_global_user():
    try:
        # Try to get the global user; adjust the username as needed.
        global_user = User.objects.get(username='global')
    except ObjectDoesNotExist:
        # If the global user doesn't exist, create it. You might want to do this in a data migration instead.
        global_user = User.objects.create_user(username='global', password='somepassword')
    return global_user.pk
    
class Scenario(models.Model):
    scenario_id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    owner = models.ForeignKey(User, related_name='scenarios', on_delete=models.CASCADE, default=get_global_user)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    medication = models.ManyToManyField(Medication)

    def __str__(self):
        return f"{self.name} ({self.scenario_id})"