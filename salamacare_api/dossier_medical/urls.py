from django.urls import path
from .views import (
    MonDossierMedicalView,
)

urlpatterns = [
    path("moi/",
        MonDossierMedicalView.as_view()),
]