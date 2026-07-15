from rest_framework import serializers
from .models import RendezVous



class RendezVousSerializer(serializers.ModelSerializer):

    patientId = serializers.IntegerField(
        source="patient.id",
        read_only=True
    )

    medecinId = serializers.IntegerField(
        source="medecin.id",
        read_only=True
    )

    patientNom = serializers.CharField(
        source="patient.user.username",
        read_only=True
    )

    medecinNom = serializers.CharField(
        source="medecin.user.username",
        read_only=True
    )

    dateHeure = serializers.DateTimeField(
        source="date_heure"
    )

    rappelEnvoyé = serializers.BooleanField(
        source="rappel_envoye"
    )


    class Meta:
        model = RendezVous

        fields = [

            "id",

            "patientId",
            "patientNom",

            "medecinId",
            "medecinNom",

            "dateHeure",

            "duree",

            "motif",

            "lieu",

            "specialite",

            "notes",

            "statut",

            "rappelEnvoyé",

            "created_at"

        ]





class CreerRendezVousSerializer(serializers.Serializer):

    patientId = serializers.IntegerField()

    medecinId = serializers.IntegerField()

    dateHeure = serializers.DateTimeField()

    duree = serializers.IntegerField(
        required=False,
        default=30
    )

    motif = serializers.CharField()

    lieu = serializers.CharField(
        required=False,
        default="Cabinet"
    )

    specialite = serializers.CharField(
        required=False,
        allow_blank=True,
        default=""
    )

    notes = serializers.CharField(
        required=False,
        allow_blank=True,
        default=""
    )





class ModifierStatutSerializer(serializers.Serializer):

    statut = serializers.ChoiceField(
        choices=RendezVous.Statut.values
    )