from django.utils.text import slugify
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import ProfilResponsable
from patients.models import ProfilPatient

User = get_user_model()


def build_username_from_email(email: str) -> str:
    base = slugify((email or '').split('@')[0] or 'user') or 'user'
    username = base
    counter = 1

    while User.objects.filter(username__iexact=username).exists():
        username = f"{base}{counter}"
        counter += 1

    return username


# ============================
# Inscription Responsable
# ============================
class RegisterResponsableSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)
    departement = serializers.CharField()

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "password2",
            "departement",
        ]

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError(
                {"password": "Les mots de passe ne correspondent pas."}
            )

        if not data.get("username"):
            data["username"] = build_username_from_email(data["email"])

        return data

    def create(self, validated_data):
        from .services import ResponsableService
        return ResponsableService.register_responsable(validated_data)


# ============================
# Profil Responsable
# ============================
class ProfilResponsableSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = ProfilResponsable
        fields = [
            "id",
            "username",
            "email",
            "departement",
        ]


# ============================
# Recherche Patient
# ============================
class PatientRechercheSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = ProfilPatient
        fields = [
            "id",
            "username",
            "email",
        ]


# ============================
# Statut Patient
# ============================
class StatutPatientSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = ProfilPatient
        fields = "__all__"