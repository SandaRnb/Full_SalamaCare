import { useState, useEffect } from 'react'

import './App.css'
import './composant/CSS_UI/responsable.css'
import './composant/CSS_UI/gestion-dossier.css'
import './composant/CSS_UI/gestion-rdv.css'
import './composant/CSS_UI/attribution-medecin.css'
import './composant/CSS_UI/suivi-flux.css'

import GestionDossier from './composant/GestionDossier'
import GestionRdv from './composant/GestionRdv'
import AttributionMedecin from './composant/AttributionMedecin'
import SuiviFlux from './composant/SuiviFlux'
import GestionMedecins from './composant/GestionMedecins'
import { StatistiqueGeneral } from './composant/Statistique'
import { DashboardLayout } from './components/DashboardLayout'

import {
    initialAttributions,
    initialDossiers,
    initialFileAttente,
    initialMedecins,
    initialNotifications
} from './data/mockData'


import {
    createDoctorAccount,
    getStoredDoctors,
    saveStoredDoctors,
    syncStoredPatientsFromDossiers,
    getStoredConsultations,
    saveStoredConsultations,
    createSharedConsultation,
    getStoredAppointments,
    saveStoredAppointments,
    createSharedAppointment
} from './utils/authStorage'


import {
    fetchAppointmentsFromBackend,
    fetchDoctorsFromBackend,
    fetchPatientsFromBackend
} from './services/backendAdapter'



function Dashboard() {


const [activeSection,setActiveSection] = useState('stats')

const [searchQuery,setSearchQuery] = useState('')


const [notifications,setNotifications] = useState(()=>{

    try{

        const stored =
            JSON.parse(
                localStorage.getItem('notifications') || 'null'
            )

        return Array.isArray(stored)
            ? stored
            : initialNotifications

    }catch{

        return initialNotifications

    }

})



const [medecins,setMedecins] =
    useState(initialMedecins)


const [dossiers,setDossiers] =
    useState(initialDossiers)



const [rendezVous,setRendezVous] =
    useState(()=>getStoredAppointments())



const [consultations,setConsultations] =
    useState(()=>getStoredConsultations())



const [toasts,setToasts] =
    useState([])



const [attributions,setAttributions] =
    useState(initialAttributions)



const [fileAttente,setFileAttente] =
    useState(initialFileAttente)



const [pendingRequests,setPendingRequests] =
    useState([])




/*
=====================================
CHARGEMENT DES DONNEES BACKEND
=====================================
*/


useEffect(()=>{


const loadBackendData = async()=>{


    try{


        const [
            patientsData,
            doctorsData,
            appointmentsData

        ] = await Promise.all([

            fetchPatientsFromBackend(),

            fetchDoctorsFromBackend(),

            fetchAppointmentsFromBackend()

        ])



        console.log(
            "PATIENTS BACKEND",
            patientsData
        )


        console.log(
            "MEDECINS BACKEND",
            doctorsData
        )


        console.log(
            "RDV BACKEND",
            appointmentsData
        )



        if(
            Array.isArray(patientsData)
        ){

            setDossiers(patientsData)

        }



        if(
            Array.isArray(doctorsData)
        ){

            setMedecins(doctorsData)

        }



        if(
            Array.isArray(appointmentsData)
        ){

            setRendezVous(appointmentsData)

        }



    }
    catch(error){


        console.error(
            "Erreur chargement backend :",
            error
        )


    }


}



loadBackendData()



},[])




useEffect(()=>{

    syncStoredPatientsFromDossiers(dossiers)

},[dossiers])




useEffect(()=>{

    saveStoredConsultations(consultations)

},[consultations])




useEffect(()=>{

    saveStoredAppointments(rendezVous)

},[rendezVous])





const removeToast=(id)=>{

    setToasts(
        prev=>prev.filter(
            t=>t.id!==id
        )
    )

}





const availableMedecins =
    medecins.filter(
        m=>m.disponibilite
    )






const renderSectionComponent = ()=>{


switch(activeSection){



case 'stats':

return (

<StatistiqueGeneral

    medecins={medecins}

    dossiers={dossiers}

    rendezVous={rendezVous}

/>

)




case 'dossier':

return (

<GestionDossier

    dossiers={dossiers}

    rendezVous={rendezVous}

    medecins={medecins}

    searchQuery={searchQuery}

/>

)




case 'rdv':

return (

<GestionRdv

    rendezVous={rendezVous}

    pendingRequests={pendingRequests}

    medecins={medecins}

    dossiers={dossiers}

    fileAttente={fileAttente}

/>

)




case 'attribution':

return (

<AttributionMedecin

    attributions={attributions}

    dossiers={dossiers}

    medecins={medecins}

    availableMedecins={availableMedecins}

/>

)



case 'suivi':

return (

<SuiviFlux

    fileAttente={fileAttente}

/>

)



case 'medecins':

return (

<GestionMedecins

    medecins={medecins}

/>

)



default:

return null


}



}






return (

<DashboardLayout


activeSection={activeSection}


onSelectSection={
    setActiveSection
}



onSignOut={()=>{


localStorage.removeItem(
    'access_token'
)


localStorage.removeItem(
    'refresh_token'
)


localStorage.removeItem(
    'user'
)


window.location.href='/login'


}}



searchValue={searchQuery}


onSearchChange={setSearchQuery}



notifications={notifications}



toasts={toasts}



>


{renderSectionComponent()}



</DashboardLayout>


)


}


export default Dashboard