from django.urls import path

from .views import (
    CreateDossierMedicalView,
    MonDossierMedicalView,
    ListeDossiersMedicauxView,
    DetailDossierMedicalView,
)

urlpatterns = [

    # Responsable
    path(
        "create/",
        CreateDossierMedicalView.as_view(),
        name="create_dossier"
    ),

    # Responsable : liste de tous les dossiers
    path(
        "liste/",
        ListeDossiersMedicauxView.as_view(),
        name="liste_dossiers"
    ),

    # Responsable : détail d'un dossier
    path(
    "me/",
    DetailDossierMedicalView.as_view(),
    name="mon_dossier"
),

    # Patient connecté
    path(
        "moi/",
        MonDossierMedicalView.as_view(),
        name="mon_dossier"
    ),
]