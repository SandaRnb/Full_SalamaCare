import { getToken } from '../utils/authStorage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

// Fonction de base
const fetchFromBackend = async (url) => {

    const token = getToken()

    console.log("TOKEN ENVOYE :", token)

    const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
    }

    return await response.json()
}

// Patients
export const fetchPatientsFromBackend = async () => {
    const data = await fetchFromBackend('/api/patients/')
    return data.patients
}

// Médecins
export const fetchDoctorsFromBackend = async () => {
    const data = await fetchFromBackend('/api/medecins/')
    return data.medecins
}

// Rendez-vous
export const fetchAppointmentsFromBackend = async () => {
    const data = await fetchFromBackend('/api/rendezvous/')
    return data.rendezvous
}

// Rendez-vous par médecin
export const fetchAppointmentsByMedecin = async (medecin_id) => {
    const data = await fetchFromBackend(`/api/rendezvous/medecin/${medecin_id}/`)
    return data.rendezvous
}

// Rendez-vous par patient
export const fetchAppointmentsByPatient = async (patient_id) => {
    const data = await fetchFromBackend(`/api/rendezvous/patient/${patient_id}/`)
    return data.rendezvous
}

// Consultations
export const fetchConsultationsFromBackend = async () => {
    const data = await fetchFromBackend('/api/consultations/')
    return data.consultations
}

// Ajouter un RDV
export const createAppointmentInBackend = async (rdvData) => {
    const response = await fetch(`${BASE_URL}/api/rendezvous/creer/`, {
        method: 'POST',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
            patient_id: rdvData.patientId,
            medecin_id: rdvData.medecinId,
            date_heure: rdvData.dateHeure,
            motif:      rdvData.motif,
        })
    })
    if (!response.ok) throw new Error('Erreur création RDV')
    return await response.json()
}

// Modifier statut RDV
export const updateAppointmentStatus = async (rdv_id, statut) => {
    const response = await fetch(`${BASE_URL}/api/rendezvous/${rdv_id}/statut/`, {
        method: 'PUT',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ statut })
    })
    if (!response.ok) throw new Error('Erreur modification statut')
    return await response.json()
}

// Notifications
export const fetchNotificationsFromBackend = async () => {
    const data = await fetchFromBackend('/api/notifications/')
    return data.notifications
}

export const markNotificationAsRead = async (notification_id) => {
    
    const response = await fetch(`${BASE_URL}/api/notifications/${notification_id}/lu/`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (!response.ok) throw new Error('Erreur notification')
    return await response.json()
}