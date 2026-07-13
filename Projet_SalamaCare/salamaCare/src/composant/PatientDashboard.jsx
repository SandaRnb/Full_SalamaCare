import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import Patient, { Dossier }    from './patient'
import './CSS_UI/patient.css'
import { getUser, getToken, logout } from '../utils/authStorage'

// ── Fonctions utilitaires ──────────────────────────────────
const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const calculateAge = (dateString) => {
    if (!dateString) return '';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    // On retire 1 an si l'anniversaire n'est pas encore passé cette année
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export default function PatientDashboard() {
    const navigate = useNavigate()
    const user     = getUser()

    const [patientAccount, setPatientAccount] = useState(null)
    const [loading,        setLoading]        = useState(true)
    const [error,          setError]          = useState(null)

    useEffect(() => {
        const loadPatient = async () => {
            try {
                // PRIORITÉ 1 — profil stocké au login
                if (user?.profil) {
                    setPatientAccount({
                        id:        user.profil.profil_id  || null,
                        email:     user.email             || '',
                        patientId: user.profil.profil_id  || null,
                        dossier: {
                            nom:           capitalize(user.username),
                            prenom:        user.profil.prenom         || '',
                            adresse:       user.profil.adresse        || '',
                            telephone:     user.profil.telephone      || '',
                            dateNaissance: user.profil.date_naissance || '',
                            age:           calculateAge(user.profil.date_naissance),
                            sexe:          user.profil.sexe           || '',
                            groupe:        '',
                            antecedent:    [],
                            statut:        'actif',
                            email:         user.email                 || '',
                        }
                    })
                    return
                }

                // PRIORITÉ 2 — appel API /api/users/moi/
                const token    = getToken()
                const response = await fetch(
                    'http://127.0.0.1:8000/api/users/moi/',
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                if (!response.ok) throw new Error('Profil introuvable')

                const data = await response.json()
                
                setPatientAccount({
                    id:        data.profil?.profil_id || null,
                    email:     data.email             || '',
                    patientId: data.profil?.profil_id || null,
                    dossier: {
                        nom:           capitalize(data.username),
                        prenom:        data.profil?.prenom         || '',
                        adresse:       data.profil?.adresse        || '',
                        telephone:     data.profil?.telephone      || '',
                        dateNaissance: data.profil?.date_naissance || '',
                        age:           calculateAge(data.profil?.date_naissance),
                        sexe:          data.profil?.sexe           || '',
                        groupe:        '',
                        antecedent:    [],
                        statut:        'actif',
                        email:         data.email                  || '',
                    }
                })

            } catch(e) {
                console.error('Erreur loadPatient:', e)
                setError(e.message)
            } finally {
                setLoading(false)    // ← toujours appelé ✅
            }
        }

        loadPatient()
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // ── États d'affichage ──────────────────────────────────
    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                Chargement...
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ padding: '2rem', color: 'red' }}>
                Erreur : {error}
            </div>
        )
    }

    const dossierCourant = patientAccount?.dossier ?? Dossier

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