from rest_framework import serializers
from .models import DossierMedical


class CreateDossierMedicalSerializer(serializers.Serializer):

    username = serializers.CharField(required=False, allow_blank=True)

    email = serializers.EmailField()

    password = serializers.CharField(write_only=True)

    password2 = serializers.CharField(write_only=True)

    date_naissance = serializers.DateField()

    adresse = serializers.CharField()

    telephone = serializers.CharField()

    groupe_sanguin = serializers.ChoiceField(
        choices=DossierMedical.GROUPE_SANGUIN_CHOICES,
        required=False,
        allow_null=True
    )

    antecedents_medicaux = serializers.CharField(
        required=False,
        allow_blank=True
    )

    allergies = serializers.CharField(
        required=False,
        allow_blank=True
    )


class DossierMedicalReadSerializer(serializers.ModelSerializer):

    patient_id = serializers.IntegerField(
        source="patient.id",
        read_only=True
    )

    username = serializers.CharField(
        source="patient.user.username",
        read_only=True
    )

    email = serializers.EmailField(
        source="patient.user.email",
        read_only=True
    )

    telephone = serializers.CharField(
        source="patient.telephone",
        read_only=True
    )

    adresse = serializers.CharField(
        source="patient.adresse",
        read_only=True
    )

    date_naissance = serializers.DateField(
        source="patient.date_naissance",
        read_only=True
    )

    class Meta:
        model = DossierMedical
        fields = [
            "id",
            "patient_id",
            "username",
            "email",
            "telephone",
            "adresse",
            "date_naissance",
            "groupe_sanguin",
            "antecedents_medicaux",
            "allergies",
            "created_at",
            "updated_at",
        ]