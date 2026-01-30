from rest_framework import serializers
from .models import Patient, Medication


# Query Validator
class PatientSearchSerializer(serializers.Serializer):
    firstName = serializers.CharField(required=False, allow_blank=False)
    lastName = serializers.CharField(required=False, allow_blank=False)
    dob = serializers.DateField(
        required=False,
        input_formats=["%Y-%m-%d"]
    )


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = [
            'id',
            'name',
            'dose_amount',
            'dose_measurement',
            'route',
            'start_date',
            'end_date',
            'prescribing_facility',
            'patient'
        ]


class PatientSerializer(serializers.ModelSerializer):
    
    medications = MedicationSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id',
            'first_name',
            'last_name',
            'date_of_birth',
            'medications'
        ]


    def create(self, validated_data):
        medications_data = validated_data.pop('medications', [])
        patient = Patient.objects.create(**validated_data)
        # Create each medication linked to this patient
        for med_data in medications_data:
            Medication.objects.create(patient=patient, **med_data)
        return patient
    

    def update_and_wipe_medications(self, instance, validated_data):
        """Update patient and replace all medications."""
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.save()

        medications_data = validated_data.get('medications', [])
        # Remove all previous medications
        instance.medications.all().delete()
        # Add new medications
        for med_data in medications_data:
            Medication.objects.create(patient=instance, **med_data)

        return instance


    def update_and_keep_medications(self, instance, validated_data):
        """Update patient and add new medications, keeping existing ones."""
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.save()

        medications_data = validated_data.get('medications', [])
        # Add new medications without deleting old ones
        for med_data in medications_data:
            Medication.objects.create(patient=instance, **med_data)

        return instance
