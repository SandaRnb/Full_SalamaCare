// utils/authStorage.js

// ── Auth / Session ────────────────────────────────────────
export function getRoleFromToken(token, fallbackRole) {
    return fallbackRole || 'patient'
}

export function getDashboardPathByRole(role) {
    switch (role) {
        case 'medecin':     return '/dashboard/medecin'
        case 'responsable': return '/dashboard/responsable'
        case 'patient':     return '/dashboard/patient'
        default:            return '/dashboard/patient'
    }
}

export function saveSession(response) {
    localStorage.setItem('access_token',  response.access)
    localStorage.setItem('refresh_token', response.refresh)
    localStorage.setItem('user',          JSON.stringify(response.user))
}

export function getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}')
}

export function getToken() {
    return localStorage.getItem('access_token')
}

export function logout() {
    localStorage.clear()
}

// ── Médecins ──────────────────────────────────────────────
export function createDoctorAccount(medecin) {
    return {
        id:         medecin.id || `doc_${Date.now()}`,
        email:      medecin.email || '',
        username:   medecin.username || '',
        nom:        medecin.nom || '',
        specialite: medecin.specialite || '',
        telephone:  medecin.telephone || '',
        role:       'medecin',
    }
}

export function getStoredDoctors() {
    try {
        return JSON.parse(localStorage.getItem('doctors') || '[]')
    } catch {
        return []
    }
}

export function saveStoredDoctors(doctors) {
    localStorage.setItem('doctors', JSON.stringify(doctors))
}

// ── Patients ──────────────────────────────────────────────
export function syncStoredPatientsFromDossiers(dossiers) {
    try {
        localStorage.setItem('patients', JSON.stringify(dossiers))
    } catch {
        console.warn('Could not sync patients')
    }
}

// ── Consultations ─────────────────────────────────────────
export function getStoredConsultations() {
    try {
        return JSON.parse(localStorage.getItem('consultations') || '[]')
    } catch {
        return []
    }
}

export function saveStoredConsultations(consultations) {
    try {
        localStorage.setItem('consultations', JSON.stringify(consultations))
    } catch {
        console.warn('Could not persist consultations')
    }
}

export function createSharedConsultation(data) {
    return {
        id:            `c${Date.now()}`,
        patientId:     data.patientId     || '',
        patientName:   data.patientName   || '',
        medecin:       data.medecin       || '',
        motif:         data.motif         || '',
        date:          data.date          || new Date().toISOString(),
        statut:        data.statut        || 'En cours',
        etape:         data.etape         || 'consultation',
        note:          data.note          || '',
        bilans:        data.bilans        || [],
        prescriptions: data.prescriptions || [],
    }
}

// ── Rendez-vous ───────────────────────────────────────────
export function getStoredAppointments() {
    try {
        return JSON.parse(localStorage.getItem('appointments') || '[]')
    } catch {
        return []
    }
}

export function saveStoredAppointments(appointments) {
    try {
        localStorage.setItem('appointments', JSON.stringify(appointments))
    } catch {
        console.warn('Could not persist appointments')
    }
}

export function createSharedAppointment(data) {
    return {
        id:           data.id           || `r${Date.now()}`,
        patientId:    data.patientId    || '',
        dossierId:    data.dossierId    || '',
        patientName:  data.patientName  || '',
        medecinId:    data.medecinId    || null,
        dateHeure:    data.dateHeure    || '',
        duree:        data.duree        || 30,
        statut:       data.statut       || 'planifié',
        motif:        data.motif        || '',
        lieu:         data.lieu         || '',
        notes:        data.notes        || '',
    }
}

// ── Recherche patient ─────────────────────────────────────
export function matchesPatientRecord(record, patientId) {
    if (!patientId) return true
    const id = String(patientId).toLowerCase()

    return (
        String(record?.patientId  || '').toLowerCase() === id ||
        String(record?.id         || '').toLowerCase() === id ||
        String(record?.dossierId  || '').toLowerCase() === id ||
        String(record?.id_dossier || '').toLowerCase() === id
    )
}