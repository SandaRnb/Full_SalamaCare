from django.db import models
from patients.models import ProfilPatient


class DossierMedical(models.Model):

    GROUPE_SANGUIN_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ]


    patient = models.OneToOneField(
        ProfilPatient,
        on_delete=models.CASCADE,
        related_name="dossier_medical"
    )


    groupe_sanguin = models.CharField(
        max_length=3,
        choices=GROUPE_SANGUIN_CHOICES,
        blank=True,
        null=True
    )


    antecedents_medicaux = models.TextField(
        blank=True,
        null=True
    )


    allergies = models.TextField(
        blank=True,
        null=True
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    updated_at = models.DateTimeField(
        auto_now=True
    )


    class Meta:
        verbose_name = "Dossier Médical"
        verbose_name_plural = "Dossiers Médicaux"


    def __str__(self):
        return f"Dossier de {self.patient.user.username}"