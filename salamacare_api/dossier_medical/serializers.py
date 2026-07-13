from rest_framework import serializers
from .models import DossierMedical
from datetime import date

class DossierMedicalSerializer(serializers.ModelSerializer):
    # Champs récupérés depuis ProfilPatient et User (lecture seule ou calculés)
    nom = serializers.CharField(source='patient.user.last_name', read_only=True)
    prenom = serializers.CharField(source='patient.user.first_name', read_only=True)
    adresse = serializers.CharField(source='patient.adresse', read_only=True)
    telephone = serializers.CharField(source='patient.telephone', read_only=True)
    date_naissance = serializers.DateField(source='patient.date_naissance', read_only=True)
    age = serializers.SerializerMethodField()

    class Meta:
        model = DossierMedical
        fields = [
            'id', 'patient_id', 'nom', 'prenom', 'date_naissance', 'age', 
            'adresse', 'telephone', 'groupe_sanguin', 'antecedents_medicaux', 'updated_at'
        ]
        read_only_fields = ['id', 'patient_id', 'updated_at']

    def get_age(self, obj):
        """Calcule l'âge dynamiquement à partir de la date de naissance du ProfilPatient."""
        if not obj.patient or not obj.patient.date_naissance:
            return None
        today = date.today()
        birth_date = obj.patient.date_naissance
        age = today.year - birth_date.year - (
            (today.month, today.day) < (birth_date.month, birth_date.day)
        )
        return f"{age} ans"