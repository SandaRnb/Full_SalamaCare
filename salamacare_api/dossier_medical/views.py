from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import DossierMedicalSerializer
from .services import DossierMedicalService

class MonDossierMedicalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Récupère le dossier médical complet du patient connecté."""
        try:
            dossier = DossierMedicalService.get_or_create_dossier(request.user)
            serializer = DossierMedicalSerializer(dossier)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Met à jour le groupe sanguin ou les antécédents médicaux."""
        try:
            dossier = DossierMedicalService.update_dossier(request.user, request.data)
            serializer = DossierMedicalSerializer(dossier)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)