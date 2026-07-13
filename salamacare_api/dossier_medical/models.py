from django.db import models
from django.conf import settings
from datetime import date
# Remplace 'patients' par le nom exact de ton app si nécessaire
from patients.models import ProfilPatient 

class DossierMedical(models.Model):
    GROUPE_SANGUIN_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    ]

    # patient_id INT NOT NULL UNIQUE FK -> ProfilPatient
    patient = models.OneToOneField(
        ProfilPatient, 
        on_delete=models.CASCADE, 
        related_name='dossier_medical',
        verbose_name="Patient"
    )
    groupe_sanguin = models.CharField(max_length=3, choices=GROUPE_SANGUIN_CHOICES, blank=True)
    antecedents_medicaux = models.TextField(blank=True, help_text="Liste des antécédents médicaux")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Dossier Médical"
        verbose_name_plural = "Dossiers Médicaux"

    def __str__(self):
        return f"Dossier Médical de {self.patient.user.username}"