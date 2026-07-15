from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated

from users.permissions import IsResponsable


from .serializers import (

    RendezVousSerializer,

    CreerRendezVousSerializer,

    ModifierStatutSerializer

)


from .services import (

    get_tous_les_rendezvous,

    get_rendezvous_par_id,

    get_rendezvous_par_patient,

    get_rendezvous_par_medecin,

    creer_rendezvous,

    modifier_statut,

    supprimer_rendezvous

)





# ==================================
# LISTE DES RDV
# ==================================

class ListeRendezVousView(APIView):

    permission_classes=[
        IsAuthenticated
    ]


    def get(self,request):

        rdvs = get_tous_les_rendezvous()


        serializer = RendezVousSerializer(
            rdvs,
            many=True
        )


        return Response({

            "rendezvous":serializer.data

        })







# ==================================
# CREATION
# ==================================

class CreerRendezVousView(APIView):

    permission_classes=[
        IsResponsable
    ]


    def post(self,request):

        serializer = CreerRendezVousSerializer(
            data=request.data
        )


        serializer.is_valid(
            raise_exception=True
        )



        rdv, erreur = creer_rendezvous(
            serializer.validated_data
        )



        if erreur:

            return Response(
                {
                    "erreur":erreur
                },
                status=status.HTTP_400_BAD_REQUEST
            )



        return Response(

            {
                "message":"Rendez-vous créé",

                "rendezvous":
                    RendezVousSerializer(rdv).data
            },

            status=status.HTTP_201_CREATED
        )







# ==================================
# DETAIL / DELETE
# ==================================

class DetailRendezVousView(APIView):

    permission_classes=[
        IsAuthenticated
    ]



    def get(self,request,rdv_id):

        rdv=get_rendezvous_par_id(rdv_id)



        if not rdv:

            return Response(
                {
                    "erreur":"RDV introuvable"
                },
                status=404
            )



        return Response({

            "rendezvous":
            RendezVousSerializer(rdv).data

        })





    def delete(self,request,rdv_id):

        if request.user.role != "responsable":

            return Response(
                {
                    "erreur":
                    "Permission refusée"
                },
                status=403
            )



        ok=supprimer_rendezvous(rdv_id)



        if not ok:

            return Response(
                {
                    "erreur":"RDV introuvable"
                },
                status=404
            )



        return Response({

            "message":
            "Rendez-vous supprimé"

        })









# ==================================
# MODIFIER STATUT
# ==================================

class ModifierStatutView(APIView):

    permission_classes=[
        IsAuthenticated
    ]



    def put(self,request,rdv_id):

        serializer=ModifierStatutSerializer(
            data=request.data
        )


        serializer.is_valid(
            raise_exception=True
        )



        rdv=modifier_statut(

            rdv_id,

            serializer.validated_data["statut"]

        )



        if not rdv:

            return Response(
                {
                    "erreur":"RDV introuvable"
                },
                status=404
            )



        return Response({

            "message":
            "Statut modifié",

            "rendezvous":
            RendezVousSerializer(rdv).data

        })









# ==================================
# PAR PATIENT
# ==================================

class RendezVousPatientView(APIView):

    permission_classes=[
        IsAuthenticated
    ]


    def get(self,request,patient_id):

        rdvs=get_rendezvous_par_patient(
            patient_id
        )


        return Response({

            "rendezvous":
            RendezVousSerializer(
                rdvs,
                many=True
            ).data

        })








# ==================================
# PAR MEDECIN
# ==================================

class RendezVousMedecinView(APIView):

    permission_classes=[
        IsAuthenticated
    ]


    def get(self,request,medecin_id):

        rdvs=get_rendezvous_par_medecin(
            medecin_id
        )


        return Response({

            "rendezvous":
            RendezVousSerializer(
                rdvs,
                many=True
            ).data

        })