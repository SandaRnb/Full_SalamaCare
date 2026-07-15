import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Patient, { Dossier } from './patient'
import './CSS_UI/patient.css'

import { getToken, logout } from '../utils/authStorage'


// ─────────────────────────
// Fonctions utilitaires
// ─────────────────────────

const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}


const calculateAge = (dateString) => {
    if (!dateString) return ''
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
}



// ─────────────────────────
// Dashboard Patient
// ─────────────────────────

export default function PatientDashboard() {
    const navigate = useNavigate()
    const [patientAccount, setPatientAccount] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [patientRendezVous, setPatientRendezVous] = useState([])

    useEffect(() => {
        const loadPatient = async () => {
            try {
                const token = getToken()
                if (!token) {
                    throw new Error("Utilisateur non connecté")
                }

                // Récupération du dossier médical connecté
                const response = await fetch(
                    "http://127.0.0.1:8000/api/dossier-medical/me/",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                )

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.detail || "Impossible de récupérer le dossier médical")
                }

                const data = await response.json()
                console.log("🔍 Dossier reçu :", data)

                // ⚠️ IMPORTANT : Utiliser patient_id pour les rendez-vous !
                const patientIdForRdv = data.patient_id || data.id
                const patientIdForAccount = data.id
                
                console.log("🔍 ID patient (pour compte) :", patientIdForAccount)
                console.log("🔍 patient_id (pour RDV) :", patientIdForRdv)

                setPatientAccount({
                    id: data.id,
                    patientId: patientIdForRdv, // ⚠️ Stocker patient_id pour les RDV
                    email: data.email || '',
                    dossier: {
                        nom: capitalize(data.username),
                        prenom: "",
                        adresse: data.adresse || "",
                        telephone: data.telephone || "",
                        dateNaissance: data.date_naissance || "",
                        age: calculateAge(data.date_naissance),
                        sexe: data.sexe || "",
                        groupe: data.groupe_sanguin || "",
                        antecedent: data.antecedents_medicaux ? [data.antecedents_medicaux] : [],
                        allergies: data.allergies ? [data.allergies] : [],
                        statut: "actif",
                        email: data.email || ""
                    }
                })

                // ─── Chargement des rendez-vous du patient ───
                // ⚠️ Utiliser patient_id ici !
                if (patientIdForRdv) {
                    try {
                        const url = `http://127.0.0.1:8000/api/rendezvous/patient/${patientIdForRdv}/`
                        console.log("🔍 URL appelée :", url)
                        
                        const rdvResponse = await fetch(
                            url,
                            {
                                method: "GET",
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                }
                            }
                        )

                        console.log("🔍 Status RDV response:", rdvResponse.status)

                        if (rdvResponse.ok) {
                            const rdvData = await rdvResponse.json()
                            console.log("🔍 Rendez-vous du patient (brut) :", rdvData)
                            
                            // Normalisation des données
                            let rendezVous = []
                            if (Array.isArray(rdvData)) {
                                rendezVous = rdvData
                            } else if (rdvData.rendezvous) {
                                rendezVous = rdvData.rendezvous
                            } else if (rdvData.results) {
                                rendezVous = rdvData.results
                            } else if (rdvData.data) {
                                rendezVous = rdvData.data
                            }
                            
                            console.log("🔍 Rendez-vous normalisés :", rendezVous)
                            console.log("🔍 Nombre de RDV :", rendezVous.length)
                            
                            setPatientRendezVous(rendezVous)
                        } else {
                            const errorText = await rdvResponse.text()
                            console.warn("❌ Erreur récupération RDV :", rdvResponse.status, errorText)
                            setPatientRendezVous([])
                        }
                    } catch (rdvError) {
                        console.error("❌ Erreur chargement rendez-vous :", rdvError)
                        setPatientRendezVous([])
                    }
                } else {
                    console.warn("❌ Aucun patient_id trouvé !")
                    setPatientRendezVous([])
                }

            } catch(e) {
                console.error("❌ Erreur loadPatient :", e)
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }

        loadPatient()
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // ─────────────────────────
    // Affichage
    // ─────────────────────────

    if (loading) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                Chargement...
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ padding: "2rem", color: "red" }}>
                Erreur : {error}
            </div>
        )
    }

    const dossierCourant = patientAccount?.dossier ?? Dossier

    console.log("📤 Envoi au Patient :", {
        rendezVousBackend: patientRendezVous,
        count: patientRendezVous.length
    })

    return (
        <div style={{ minHeight: '90vh', background: '#f8fafc' }}>
            <main style={{ padding: '2rem' }}>
                <Patient
                    dossier={dossierCourant}
                    patientAccount={patientAccount}
                    onLogout={handleLogout}
                    rendezVousBackend={patientRendezVous}
                />
            </main>
        </div>
    )
}