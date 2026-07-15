// utils/authStorage.js


// ======================================================
// AUTH / SESSION
// ======================================================

export function getRoleFromToken(token, fallbackRole) {

    return fallbackRole || "patient"

}



export function getDashboardPathByRole(role) {

    switch(role){

        case "medecin":
            return "/dashboard/medecin"

        case "responsable":
            return "/dashboard"

        case "patient":
            return "/dashboard/patient"

        default:
            return "/dashboard/patient"

    }

}



// Sauvegarde après login JWT

export function saveSession(response){


    console.log("REPONSE LOGIN :", response)


    localStorage.setItem(
        "access_token",
        response.access || ""
    )


    localStorage.setItem(
        "refresh_token",
        response.refresh || ""
    )


    localStorage.setItem(
        "user",
        JSON.stringify(response.user || {})
    )


}




export function getUser(){

    try{

        return JSON.parse(
            localStorage.getItem("user") || "{}"
        )

    }catch{

        return {}

    }

}





// TOKEN JWT

export function getToken(){


    const token = localStorage.getItem(
        "access_token"
    )


    console.log(
        "TOKEN STORAGE :",
        token
    )


    return token

}





export function logout(){


    localStorage.removeItem(
        "access_token"
    )


    localStorage.removeItem(
        "refresh_token"
    )


    localStorage.removeItem(
        "user"
    )


}



// ======================================================
// MEDECINS
// ======================================================


export function createDoctorAccount(medecin){


    return {

        id:
            medecin.id ||
            `doc_${Date.now()}`,

        email:
            medecin.email || "",

        username:
            medecin.username || "",

        nom:
            medecin.nom || "",

        specialite:
            medecin.specialite || "",

        telephone:
            medecin.telephone || "",

        disponibilite:
            true,

        role:
            "medecin"

    }

}




export function getStoredDoctors(){

    try{

        return JSON.parse(
            localStorage.getItem("doctors") || "[]"
        )


    }catch{

        return []

    }

}





export function saveStoredDoctors(doctors){


    localStorage.setItem(
        "doctors",
        JSON.stringify(doctors)
    )


}



// ======================================================
// PATIENTS
// ======================================================


export function syncStoredPatientsFromDossiers(dossiers){


    try{


        localStorage.setItem(
            "patients",
            JSON.stringify(dossiers)
        )


    }catch{


        console.warn(
            "Erreur sauvegarde patients"
        )

    }


}





// ======================================================
// CONSULTATIONS
// ======================================================


export function getStoredConsultations(){

    try{

        return JSON.parse(
            localStorage.getItem("consultations") || "[]"
        )

    }catch{

        return []

    }

}





export function saveStoredConsultations(data){


    localStorage.setItem(
        "consultations",
        JSON.stringify(data)
    )


}





export function createSharedConsultation(data){


    return {


        id:
            `c${Date.now()}`,

        patientId:
            data.patientId || "",

        patientName:
            data.patientName || "",

        medecin:
            data.medecin || "",

        motif:
            data.motif || "",

        date:
            data.date || new Date().toISOString(),

        statut:
            data.statut || "En cours",

        etape:
            "consultation",

        note:
            data.note || "",

        bilans:
            data.bilans || [],

        prescriptions:
            data.prescriptions || []

    }


}



// ======================================================
// RENDEZ-VOUS
// ======================================================


export function getStoredAppointments(){


    try{

        return JSON.parse(
            localStorage.getItem("appointments") || "[]"
        )

    }catch{

        return []

    }


}




export function saveStoredAppointments(data){


    localStorage.setItem(
        "appointments",
        JSON.stringify(data)
    )


}




export function createSharedAppointment(data){


    return {


        id:
            data.id ||
            `r${Date.now()}`,


        patientId:
            data.patientId || "",


        dossierId:
            data.dossierId || "",


        patientName:
            data.patientName || "",


        medecinId:
            data.medecinId || null,


        dateHeure:
            data.dateHeure || "",


        duree:
            data.duree || 30,


        statut:
            data.statut || "planifié",


        motif:
            data.motif || "",


        lieu:
            data.lieu || "",


        notes:
            data.notes || ""

    }


}





// ======================================================
// RECHERCHE PATIENT
// ======================================================


export function matchesPatientRecord(record,id){


    if(!id)
        return true


    const value =
        String(id).toLowerCase()



    return (

        String(record?.id || "")
        .toLowerCase()
        === value


        ||

        String(record?.patientId || "")
        .toLowerCase()
        === value


        ||

        String(record?.dossierId || "")
        .toLowerCase()
        === value

    )


}