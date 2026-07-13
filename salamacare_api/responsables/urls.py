from django.urls import path
from .views import (
    RegisterResponsableView,
    PatientRechercheView,
    StatutPatientsView,
)

urlpatterns = [
    path('inscription/', 
        RegisterResponsableView.as_view()),
        
    path('patients/recherche/', 
        PatientRechercheView.as_view()),
        
    path('patients/statut/', 
        StatutPatientsView.as_view()),
]