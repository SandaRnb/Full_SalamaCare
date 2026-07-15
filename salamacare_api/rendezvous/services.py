from .models import RendezVous

from patients.models import ProfilPatient
from medecins.models import ProfilMedecin



# ===============================
# LISTE TOUS LES RDV
# ===============================

def get_tous_les_rendezvous():

    return RendezVous.objects.select_related(
        "patient__user",
        "medecin__user"
    ).all()





# ===============================
# RDV PAR ID
# ===============================

def get_rendezvous_par_id(rdv_id):

    try:

        return RendezVous.objects.select_related(
            "patient__user",
            "medecin__user"
        ).get(id=rdv_id)

    except RendezVous.DoesNotExist:

        return None





# ===============================
# CREATION RDV
# ===============================

def creer_rendezvous(data):

    try:

        patient = ProfilPatient.objects.get(
            id=data["patientId"]
        )


        medecin = ProfilMedecin.objects.get(
            id=data["medecinId"]
        )



        rdv = RendezVous.objects.create(

            patient=patient,

            medecin=medecin,

            date_heure=data["dateHeure"],

            duree=data.get(
                "duree",
                30
            ),

            motif=data["motif"],

            lieu=data.get(
                "lieu",
                "Cabinet"
            ),

            specialite=data.get(
                "specialite",
                ""
            ),

            notes=data.get(
                "notes",
                ""
            )

        )


        return rdv, None



    except ProfilPatient.DoesNotExist:

        return None, "Patient introuvable"



    except ProfilMedecin.DoesNotExist:

        return None, "Médecin introuvable"







# ===============================
# RDV PAR PATIENT
# ===============================

def get_rendezvous_par_patient(patient_id):

    return RendezVous.objects.filter(
        patient_id=patient_id
    ).select_related(
        "patient__user",
        "medecin__user"
    )







# ===============================
# RDV PAR MEDECIN
# ===============================

def get_rendezvous_par_medecin(medecin_id):

    return RendezVous.objects.filter(
        medecin_id=medecin_id
    ).select_related(
        "patient__user",
        "medecin__user"
    )






# ===============================
# MODIFICATION STATUT
# ===============================

def modifier_statut(rdv_id, statut):

    try:

        rdv = RendezVous.objects.get(
            id=rdv_id
        )

        rdv.statut = statut

        rdv.save()

        return rdv


    except RendezVous.DoesNotExist:

        return None






# ===============================
# SUPPRESSION
# ===============================

def supprimer_rendezvous(rdv_id):

    try:

        rdv = RendezVous.objects.get(
            id=rdv_id
        )

        rdv.delete()

        return True


    except RendezVous.DoesNotExist:

        return False