# rendezvous/models.py

from django.db import models
from medecins.models import ProfilMedecin
from patients.models import ProfilPatient


class RendezVous(models.Model):

    class Statut(models.TextChoices):
        PLANIFIE = 'planifié', 'Planifié'
        CONFIRME = 'confirmé', 'Confirmé'
        REPORTE = 'reporté', 'Reporté'
        EN_COURS = 'en_cours', 'En cours'
        TERMINE = 'terminé', 'Terminé'
        ANNULE = 'annulé', 'Annulé'


    patient = models.ForeignKey(
        ProfilPatient,
        on_delete=models.CASCADE,
        related_name="rendez_vous"
    )

    medecin = models.ForeignKey(
        ProfilMedecin,
        on_delete=models.CASCADE,
        related_name="rendez_vous"
    )


    date_heure = models.DateTimeField()


    duree = models.IntegerField(
        default=30
    )


    motif = models.TextField()


    lieu = models.CharField(
        max_length=255,
        default="Cabinet"
    )


    notes = models.TextField(
        blank=True,
        null=True
    )


    specialite = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )


    statut = models.CharField(
        max_length=20,
        choices=Statut.choices,
        default=Statut.PLANIFIE
    )


    rappel_envoye = models.BooleanField(
        default=False
    )


    created_at=models.DateTimeField(
        auto_now_add=True
    )


    class Meta:
        ordering=[
            "-date_heure"
        ]



    def __str__(self):
        return f"{self.patient} - {self.date_heure}"