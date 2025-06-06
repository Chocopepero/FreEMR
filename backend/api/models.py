from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

def get_global_user():
    try:
        # Try to get the global user; adjust the username as needed.
        global_user = User.objects.get(username='global')
    except ObjectDoesNotExist:
        # If the global user doesn't exist, create it. You might want to do this in a data migration instead.
        global_user = User.objects.create_user(username='global', password='somepassword', last_login=timezone.now())
    return global_user.pk

# Create your models here.
class Patient(models.Model):
    patient_id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=100)
    dob = models.DateField()
    sex = models.CharField(max_length=1)
    room_num = models.CharField(max_length=100)
    height = models.FloatField()
    weight = models.FloatField()
    owner = models.ForeignKey(User, related_name='patient', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.patient_id})"
    
class Medication(models.Model):
    id = models.BigIntegerField(primary_key=True)
    medication = models.CharField(max_length=100)
    dose = models.CharField(max_length=100)
    start_times = models.JSONField()
    stop = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(0)])
    time = models.IntegerField(blank=True, null=True)
    initial = models.CharField(max_length=5, blank=True, null=True)
    site = models.CharField(max_length=5, blank=True, null=True)
    status = models.CharField(max_length=20, blank=True, null=True)
    frequency = models.CharField(max_length=100, blank=True, null=True)
    prn = models.BooleanField(default=False)

    def __str__(self):
        return f"({self.medication})"
    
class Scenario(models.Model):
    scenario_id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    owner = models.ForeignKey(User, related_name='scenario', on_delete=models.CASCADE, default=get_global_user)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    medication = models.ManyToManyField(Medication, through='Scenario_Medication')
    notes = models.JSONField(blank=True, null=True)
    diagnosis = models.CharField(max_length=1000)
    allergies = models.CharField(max_length=1000, default="NKA")
    medical_doctor = models.CharField(max_length=1000)

    def __str__(self):
        return f"{self.name} ({self.scenario_id})"
    

class Scenario_Medication(models.Model):
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)  # Tie the medication to the scenario owner

    class Meta:
        unique_together = ('scenario', 'medication')  # Prevent duplicate entries

    def __str__(self):
        return f"Scenario: {self.scenario.name}, Medication: {self.medication.medication}, Owner: {self.owner.username}"