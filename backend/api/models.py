from django.db import models
from django.core.validators import MinValueValidator

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
    time = models.IntegerField(validators=[MinValueValidator(0)])
    initial = models.CharField(max_length=5)
    site = models.CharField(max_length=5)

    def __str__(self):
        return f"({self.medication})"
    
class Scenario(models.Model):
    scenario_id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.scenario_id})"