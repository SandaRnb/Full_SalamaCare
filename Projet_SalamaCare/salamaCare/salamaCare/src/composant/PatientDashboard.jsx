import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Patient, { Dossier } from './patient'
import './CSS_UI/patient.css'
import { getUser, logout } from '../utils/authStorage'
import { fetchPatientsFromBackend } from '../services/backendAdapter'

export default function PatientDashboard() {
    const navigate   = useNavigate()
    const user       = getUser()  // ← récupère { id, username, email, role, profil }

    const [patientAccount, setPatientAccount] = useState(null)

    useEffect(() => {
        const loadPatient = async () => {
            try {
                // Option 1 — depuis le backend
                const patients = await fetchPatientsFromBackend()
                const match    = patients.find(
                    (p) => p.email?.toLowerCase() === user.email?.toLowerCase()
                )
                if (match) {
                    setPatientAccount(match)
                    return
                }
            } catch {
                console.warn('Backend indisponible, fallback local')
            }

            // Option 2 — depuis le profil stocké au login
            if (user?.profil) {
                setPatientAccount({
                    id:        user.profil.profil_id,
                    email:     user.email,
                    patientId: user.profil.profil_id,
                    dossier: {
                        nom:           user.username,
                        prenom:        '',
                        adresse:       user.profil.adresse       || '',
                        telephone:     user.profil.telephone     || '',
                        dateNaissance: user.profil.date_naissance || '',
                        age:           '',
                        sexe:          '',
                        groupe:        '',
                        antecedent:    [],
                        statut:        'actif',
                    }
                })
            }
        }

        loadPatient()
    }, [])

    const handleLogout = () => {
        logout()  // ← nettoie tout le localStorage
        navigate('/login')
    }

    const dossierCourant = patientAccount?.dossier ? {
        id_dossier:       patientAccount.dossier.id_dossier    || patientAccount.id,
        nom:              patientAccount.dossier.nom            || Dossier.nom,
        prenom:           patientAccount.dossier.prenom         || Dossier.prenom,
        age:              patientAccount.dossier.age            || Dossier.age,
        adresse:          patientAccount.dossier.adresse        || Dossier.adresse,
        sexe:             patientAccount.dossier.sexe           || Dossier.sexe,
        groupe:           patientAccount.dossier.groupe         || Dossier.groupe,
        antecedent:       patientAccount.dossier.antecedent     || Dossier.antecedent,
        telephone:        patientAccount.dossier.telephone      || '',
        email:            patientAccount.dossier.email          || user.email || '',
        statut:           patientAccount.dossier.statut         || 'actif',
        dateNaissance:    patientAccount.dossier.dateNaissance  || '',
        dateCreation:     patientAccount.dossier.dateCreation   || '',
        dateModification: patientAccount.dossier.dateModification || ''
    } : Dossier

    return (
        <div style={{ minHeight: '90vh', background: '#f8fafc' }}>
            <main style={{ padding: '2rem' }}>
                <Patient
                    dossier={dossierCourant}
                    patientAccount={patientAccount}
                    onLogout={handleLogout}
                />
            </main>
        </div>
    )
}