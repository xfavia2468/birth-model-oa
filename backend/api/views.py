from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Patient, Medication
from .serializers import PatientSerializer, MedicationSerializer, PatientSearchSerializer

# Tester endpoint
@api_view(['GET'])
def hello(request):
    return Response({"status": "API says hello!"})


# ViewSet for Patient, including custom update logic
class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer

    def get_queryset(self):
        serializer = PatientSearchSerializer(
            data=self.request.query_params
        )

        serializer.is_valid(raise_exception=True)
        params = serializer.validated_data

        qs = Patient.objects.all()

        if "firstName" in params:
            qs = qs.filter(first_name__icontains=params["firstName"])

        if "lastName" in params:
            qs = qs.filter(last_name__icontains=params["lastName"])

        if "dob" in params:
            qs = qs.filter(date_of_birth=params["dob"])

        return qs

    # Override update for custom handling
    def update(self, request, *args, **kwargs):
        """
        Custom update:
            ?mode=wipe → wipe previous medications
            default → keep previous medications and add new ones
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Determine mode
        mode = request.query_params.get('mode', 'keep').lower()

        if mode == 'wipe':
            updated_instance = serializer.update_and_wipe_medications(instance, serializer.validated_data)
        else:
            updated_instance = serializer.update_and_keep_medications(instance, serializer.validated_data)

        # Return serialized data
        return Response(self.get_serializer(updated_instance).data, status=status.HTTP_200_OK)

