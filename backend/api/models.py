from django.db import models

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