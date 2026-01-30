from django.db import models

# Create your models here.

class Patient(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    

""" 
Each medication should include fields like:
• medication name
• dose
• route (oral, IV, etc)
• start date
• end date (or ongoing)
• prescribing facility or source
"""
class Medication(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    dose_amount = models.FloatField(null=True, blank=True)
    dose_measurement = models.CharField(max_length=50, null=True, blank=True)
    route = models.CharField(max_length=50, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    prescribing_facility = models.CharField(max_length=100, null=True, blank=True)

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medications')

    def __str__(self):
        return f"{self.name} for {self.patient.first_name} {self.patient.last_name}"