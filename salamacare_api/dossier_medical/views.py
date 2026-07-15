from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import (
    CreateDossierMedicalSerializer,
    DossierMedicalReadSerializer,
)

from .services import DossierMedicalService


class CreateDossierMedicalView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CreateDossierMedicalSerializer(data=request.data)

        if serializer.is_valid():
            dossier = DossierMedicalService.create_dossier(
                serializer.validated_data
            )

            return Response(
                {
                    "message": "Patient et dossier médical créés avec succès.",
                    "dossier": DossierMedicalReadSerializer(dossier).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MonDossierMedicalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        dossier = DossierMedicalService.get_mon_dossier(request.user)

        serializer = DossierMedicalReadSerializer(dossier)

        return Response(serializer.data)


class ListeDossiersMedicauxView(APIView):
    #permission_classes = [AllowAny]

    def get(self, request):
        dossiers = DossierMedicalService.get_tous_les_dossiers()

        serializer = DossierMedicalReadSerializer(
            dossiers,
            many=True
        )

        return Response(serializer.data)


class DetailDossierMedicalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        dossier = DossierMedicalService.get_mon_dossier(request.user)

        serializer = DossierMedicalReadSerializer(dossier)

        return Response(serializer.data)

    def put(self, request):
        dossier = DossierMedicalService.update_mon_dossier(
            request.user,
            request.data
        )

        serializer = DossierMedicalReadSerializer(dossier)

        return Response(
            {
                "message": "Dossier médical mis à jour.",
                "dossier": serializer.data,
            }
        )

    def delete(self, request):
        DossierMedicalService.delete_mon_dossier(request.user)

        return Response(
            {
                "message": "Dossier médical supprimé."
            },
            status=status.HTTP_204_NO_CONTENT,
        )