# backend/myapp/management/commands/seed.py
from django.core.management.base import BaseCommand
from api.models import Patient, Medication
from faker import Faker
import random
from datetime import timedelta, date

fake = Faker()

class Command(BaseCommand):
    help = 'Seed the database with realistic, messy patients and medications'

    def handle(self, *args, **kwargs):
        # Clear existing data
        Medication.objects.all().delete()
        Patient.objects.all().delete()

        self.stdout.write("Seeding patients and medications...")

        # Medication templates
        med_names = ["Amoxicillin", "Ibuprofen", "Paracetamol", "Metformin", "Aspirin", "Lisinopril", "Omeprazole"]
        routes = ["oral", "IV", "injection", "topical", "sublingual"]
        dose_options = [50, 100, 200, 250, 500, 750, 1000]

        # Create patients
        patients = []
        for _ in range(100): # NUMBER OF PATIENTS
            patient = Patient.objects.create(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                date_of_birth=fake.date_of_birth(minimum_age=0, maximum_age=90)
            )
            patients.append(patient)

        # Create medications
        for patient in patients:
            num_meds = random.randint(1, 10)  # meds per patient
            patient_meds = []
            for _ in range(num_meds):
                name = random.choice(med_names)
                
                # Randomly leave some names blank to simulate missing data
                if random.random() < 0.005:
                    name = None

                dose_amount = random.choice(dose_options)
                # Randomly leave dose blank
                if random.random() < 0.05:
                    dose_amount = None

                dose_measurement = "mg" if dose_amount else None
                route = random.choice(routes)
                start = fake.date_between(start_date='-2y', end_date='today')
                
                # 20% ongoing
                if random.random() < 0.2:
                    end = None
                else:
                    end = start + timedelta(days=random.randint(3, 180))

                # Random duplicate: same medication, different facility
                if random.random() < 0.1 and patient_meds:
                    name = random.choice(patient_meds)  # pick a previous medication to duplicate

                prescribing_facility = fake.company()
                # Occasionally missing facility
                if random.random() < 0.05:
                    prescribing_facility = None

                med = Medication.objects.create(
                    name=name,
                    dose_amount=dose_amount,
                    dose_measurement=dose_measurement,
                    route=route,
                    start_date=start,
                    end_date=end,
                    prescribing_facility=prescribing_facility,
                    patient=patient
                )
                patient_meds.append(name)

                # Occasionally add conflicting record: same med overlapping dates
                if random.random() < 0.05:
                    conflict_start = start - timedelta(days=random.randint(1, 10))
                    conflict_end = end if end else start + timedelta(days=random.randint(1, 30))
                    Medication.objects.create(
                        name=name,
                        dose_amount=dose_amount,
                        dose_measurement=dose_measurement,
                        route=route,
                        start_date=conflict_start,
                        end_date=conflict_end,
                        prescribing_facility=fake.company(),
                        patient=patient
                    )

        self.stdout.write(self.style.SUCCESS('Database seeded with realistic and messy data!'))
