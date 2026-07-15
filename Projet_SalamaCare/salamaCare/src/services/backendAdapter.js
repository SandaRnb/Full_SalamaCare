import { getToken } from "../utils/authStorage"



const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000"





// FETCH GENERAL

const fetchFromBackend = async(url)=>{


    const token = getToken()


    console.log(
        "TOKEN ENVOYE API :",
        token
    )



    const headers = {

        "Content-Type":
            "application/json"

    }



    if(token){

        headers.Authorization =
            `Bearer ${token}`

    }




    const response =
        await fetch(
            `${BASE_URL}${url}`,
            {
                headers
            }
        )



    if(!response.ok){

        const error =
            await response.text()


        console.error(
            "ERREUR API :",
            error
        )


        throw new Error(
            `Erreur ${response.status}`
        )

    }



    return await response.json()


}





// ================================
// PATIENTS
// ================================


export const fetchPatientsFromBackend =
async()=>{


    const data =
        await fetchFromBackend(
            "/api/patients/"
        )


    console.log(
        "PATIENT API :",
        data
    )


    return (
        data.patients ||
        data.results ||
        data
    )


}







// ================================
// MEDECINS
// ================================


export const fetchDoctorsFromBackend =
async()=>{


    const data =
        await fetchFromBackend(
            "/api/medecins/"
        )


    console.log(
        "MEDECIN API :",
        data
    )


    return (

        data.medecins ||
        data.results ||
        data

    )


}






// ================================
// RENDEZ VOUS
// ================================


export const fetchAppointmentsFromBackend =
async()=>{


    const data =
        await fetchFromBackend(
            "/api/rendezvous/"
        )


    console.log(
        "RDV API :",
        data
    )


    return (

        data.rendezvous ||
        data.results ||
        data

    )


}






// ================================
// CREATION RDV
// ================================


export const createAppointmentInBackend = async (rdvData) => {

    console.log("DONNEES ENVOYEES AU BACKEND :", rdvData)

    const response = await fetch(`${BASE_URL}/api/rendezvous/creer/`, {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },

        body: JSON.stringify({

            patientId: Number(rdvData.patientId),

            medecinId: Number(rdvData.medecinId),

            dateHeure: rdvData.dateHeure,

            motif: rdvData.motif,

            lieu: rdvData.lieu || "",

            duree: Number(rdvData.duree) || 30,

            notes: rdvData.notes || ""

        })
    })


    const data = await response.json()


    if(!response.ok){

        console.error(
            "ERREUR BACKEND RDV :",
            data
        )

        throw new Error(
            "Erreur création RDV"
        )
    }


    return data
}