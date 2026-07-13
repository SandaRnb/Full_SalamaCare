from django.shortcuts import get_object_or_404
from .models import DossierMedical
from patients.models import ProfilPatient

class DossierMedicalService:
    
    @staticmethod
    def get_or_create_dossier(user):
        """Récupère ou initialise le dossier médical à partir du ProfilPatient de l'user."""
        # 1. On récupère d'abord le profil du patient lié à l'utilisateur connecté
        profil_patient = get_object_or_404(ProfilPatient, user=user)
        
        # 2. On récupère ou crée le dossier médical lié à ce profil patient
        dossier, created = DossierMedical.objects.get_or_create(patient=profil_patient)
        return dossier

    @staticmethod
    def update_dossier(user, data):
        """Met à jour les données médicales (et éventuellement le profil patient)."""
        profil_patient = get_object_or_404(ProfilPatient, user=user)
        dossier = get_object_or_404(DossierMedical, patient=profil_patient)
        
        # Séparation des champs médicaux et des champs du profil de base
        dossier_fields = ['groupe_sanguin', 'antecedents_medicaux']
        profil_fields = ['adresse', 'telephone', 'date_naissance']
        
        # Mise à jour du dossier médical
        for field in dossier_fields:
            if field in data:
                setattr(dossier, field, data[field])
        dossier.save()
        
        # Optionnel : permettre aussi de mettre à jour le profil de base depuis cette API
        profil_updated = False
        for field in profil_fields:
            if field in data:
                setattr(profil_patient, field, data[field])
                profil_updated = True
        if profil_updated:
            profil_patient.save()
            
        return dossier