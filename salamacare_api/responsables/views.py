from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from users.permissions import IsResponsable
from patients.models import ProfilPatient
from .serializers import (
    PatientRechercheSerializer, 
    StatutPatientSerializer, 
    RegisterResponsableSerializer
)
from .services import ResponsableService

class RegisterResponsableView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterResponsableSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "Responsable inscrit avec succès !",
                    "username": user.username,
                    "email": user.email
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientRechercheView(generics.ListAPIView):
    permission_classes = [IsResponsable]
    serializer_class = PatientRechercheSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q', '').strip()
        if not q:
            return ProfilPatient.objects.none()
        return ProfilPatient.objects.filter(
            user__username__icontains=q
        ).select_related('user')


class StatutPatientsView(generics.ListAPIView):
    permission_classes = [IsResponsable]
    serializer_class = StatutPatientSerializer

    def get_queryset(self):
        return ProfilPatient.objects.all().select_related('user')