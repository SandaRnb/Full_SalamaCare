from django.contrib.auth import get_user_model
from django.db import transaction
from .models import ProfilResponsable

User = get_user_model()

class ResponsableService:

    @staticmethod
    def register_responsable(validated_data):
        """
        Crée l'utilisateur avec son rôle de Responsable 
        et initialise son ProfilResponsable.
        """
        validated_data.pop("password2")
        departement = validated_data.pop("departement")
        password = validated_data.pop("password")

        with transaction.atomic():
            # 1. Création de l'utilisateur de base
            # Note : Adapte 'role=User.Role.RESPONSABLE' selon la structure exacte de ton modèle User custom
            user = User.objects.create_user(
                username=validated_data.get("username"),
                email=validated_data.get("email"),
                role=getattr(User.Role, 'RESPONSABLE', 'RESPONSABLE') 
            )
            user.set_password(password)
            user.save()

            # 2. Création du profil lié
            ProfilResponsable.objects.create(
                user=user,
                departement=departement
            )

        return user