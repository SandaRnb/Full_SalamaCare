from django.urls import path

from .views import (
    ListeRendezVousView,
    CreerRendezVousView,
    DetailRendezVousView,
    ModifierStatutView,
    RendezVousPatientView,
    RendezVousMedecinView,
)


urlpatterns = [

    # Liste tous les rendez-vous
    # GET /api/rendezvous/
    path(
        '',
        ListeRendezVousView.as_view(),
        name="liste-rendezvous"
    ),


    # Création d'un rendez-vous
    # POST /api/rendezvous/creer/
    path(
        'creer/',
        CreerRendezVousView.as_view(),
        name="creer-rendezvous"
    ),


    # Détail d'un rendez-vous
    # GET /api/rendezvous/1/
    # DELETE /api/rendezvous/1/
    path(
        '<int:rdv_id>/',
        DetailRendezVousView.as_view(),
        name="detail-rendezvous"
    ),


    # Modifier statut
    # PUT /api/rendezvous/1/statut/
    path(
        '<int:rdv_id>/statut/',
        ModifierStatutView.as_view(),
        name="modifier-statut-rendezvous"
    ),


    # Rendez-vous d'un patient
    # GET /api/rendezvous/patient/3/
    path(
        'patient/<int:patient_id>/',
        RendezVousPatientView.as_view(),
        name="rendezvous-patient"
    ),


    # Rendez-vous d'un médecin
    # GET /api/rendezvous/medecin/2/
    path(
        'medecin/<int:medecin_id>/',
        RendezVousMedecinView.as_view(),
        name="rendezvous-medecin"
    ),

]