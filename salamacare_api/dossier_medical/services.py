from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import DossierMedical
from patients.models import ProfilPatient
from patients.serializers import RegisterPatientSerializer


class DossierMedicalService:

    @staticmethod
    @transaction.atomic
    def create_dossier(data):
        """
        Crée un Patient puis son Dossier Médical.
        """

        patient_data = {
            "username": data.get("username", ""),
            "email": data.get("email"),
            "password": data.get("password"),
            "password2": data.get("password2"),
            "date_naissance": data.get("date_naissance"),
            "adresse": data.get("adresse"),
            "telephone": data.get("telephone"),
        }

        serializer = RegisterPatientSerializer(data=patient_data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        profil_patient = user.patient

        dossier = DossierMedical.objects.create(
            patient=profil_patient,
            groupe_sanguin=data.get("groupe_sanguin"),
            antecedents_medicaux=data.get("antecedents_medicaux"),
            allergies=data.get("allergies"),
        )

        return dossier

    @staticmethod
    def get_mon_dossier(user):
        """
        Retourne le dossier du patient connecté.
        """

        profil = get_object_or_404(
            ProfilPatient,
            user=user
        )

        dossier = get_object_or_404(
            DossierMedical.objects.select_related(
                "patient",
                "patient__user"
            ),
            patient=profil
        )

        return dossier

    @staticmethod
    def get_tous_les_dossiers():
        """
        Retourne tous les dossiers.
        """

        return DossierMedical.objects.select_related(
            "patient",
            "patient__user"
        ).all()

    @staticmethod
    def get_dossier(pk):
        """
        Retourne un dossier par son id.
        """

        return get_object_or_404(
            DossierMedical.objects.select_related(
                "patient",
                "patient__user"
            ),
            pk=pk
        )

    @staticmethod
    @transaction.atomic
    def update_mon_dossier(user, data):
        """
        Met à jour le dossier du patient connecté.
        """

        profil = get_object_or_404(
            ProfilPatient,
            user=user
        )

        dossier = get_object_or_404(
            DossierMedical,
            patient=profil
        )

        if "groupe_sanguin" in data:
            dossier.groupe_sanguin = data["groupe_sanguin"]

        if "antecedents_medicaux" in data:
            dossier.antecedents_medicaux = data["antecedents_medicaux"]

        if "allergies" in data:
            dossier.allergies = data["allergies"]

        dossier.save()

        return dossier

    @staticmethod
    @transaction.atomic
    def update_dossier(pk, data):
        """
        Met à jour un dossier par son id.
        """

        dossier = get_object_or_404(
            DossierMedical,
            pk=pk
        )

        if "groupe_sanguin" in data:
            dossier.groupe_sanguin = data["groupe_sanguin"]

        if "antecedents_medicaux" in data:
            dossier.antecedents_medicaux = data["antecedents_medicaux"]

        if "allergies" in data:
            dossier.allergies = data["allergies"]

        dossier.save()

        return dossier

    @staticmethod
    @transaction.atomic
    def delete_mon_dossier(user):
        """
        Supprime le dossier et le compte du patient connecté.
        """

        profil = get_object_or_404(
            ProfilPatient,
            user=user
        )

        dossier = get_object_or_404(
            DossierMedical,
            patient=profil
        )

        dossier.delete()
        profil.user.delete()

        return True

    @staticmethod
    @transaction.atomic
    def delete_dossier(pk):
        """
        Supprime le dossier ainsi que le patient associé.
        """

        dossier = get_object_or_404(
            DossierMedical,
            pk=pk
        )

        user = dossier.patient.user

        dossier.delete()
        user.delete()

        return True