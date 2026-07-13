import { useEffect, useState } from 'react'
import './CSS_UI/patient.css'
import GenererDossier from './ConsultationDossier'
import { getStoredAppointments, getStoredConsultations, matchesPatientRecord } from '../utils/authStorage'

export const Dossier = {
    id_dossier: 1,
    nom: 'ANDRIANANTENAINA',
    prenom: 'Sarobidy',
    age: 30,
    adresse: 'Ankorondrano',
    sexe: 'Homme',
    groupe: 'O+',
    antecedent: [
        'Allérgie',
        'Hypertension',
        'Ashme'
    ]
}

const PATIENT_DATA_BY_ID = {
  p1: {
    rdv: [
      {
        id: 1,
        medecin: 'Gilbert',
        motif: 'Prise de tension arterielle',
        date: '2026-07-10T14:30:00',
        statut: 'Confirmé'
      }
    ],
    consultations: [
      {
        id: 1,
        date: '2026-07-10T14:30:00',
        medecin: 'Sitraka Benja',
        motif: 'Hypertension',
        statut: 'En cours',
        etape: 'consultation',
        note: 'Le patient est pris en charge en cabinet et la consultation est en cours.',
        bilans: [
          { libelle: 'Fièvre', resultat: '38,2 °C' },
          { libelle: 'Tension artérielle', resultat: '150/95 mmHg' }
        ],
        prescriptions: [
          { medicament: 'Paracétamol', dosage: '500 mg', frequence: '3 fois par jour', duree: '3 jours' },
          { medicament: 'Aspirine', dosage: '100 mg', frequence: '1 fois par jour', duree: '7 jours' }
        ]
      }
    ]
  },
  p2: {
    rdv: [
      {
        id: 2,
        medecin: 'Marie Daniella',
        motif: 'Première visite',
        date: '2026-07-11T09:00:00',
        statut: 'En attente'
      }
    ],
    consultations: [
      {
        id: 2,
        date: '2026-07-08T09:00:00',
        medecin: 'Marie Daniella',
        motif: 'Première visite',
        statut: 'Terminée',
        etape: 'suivi',
        note: 'Examen effectué, traitement prescrit et prochain contrôle programmé.',
        bilans: [
          { libelle: 'Analyse sanguine', resultat: 'Normale' },
          { libelle: 'Poids', resultat: '72 kg' }
        ],
        prescriptions: [
          { medicament: 'Paracétamol', dosage: '500 mg', frequence: '2 fois par jour', duree: '2 jours' }
        ]
      }
    ]
  },
  default: {
    rdv: [],
    consultations: []
  }
}

const getPatientDataForAccount = (patientAccount) => {
  const accountKey = patientAccount?.id || patientAccount?.dossierId || patientAccount?.dossier?.id_dossier || patientAccount?.email || ''
  const normalizedKey = String(accountKey).toLowerCase()
  return PATIENT_DATA_BY_ID[normalizedKey] || PATIENT_DATA_BY_ID.default
}

const formatDate = (value) => new Date(value).toLocaleString('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

const getStatusClassName = (statut) => {
  switch (statut) {
    case 'En cours':
      return 'ongoing'
    case 'Terminée':
      return 'confirmed'
    case 'Planifiée':
      return 'pending'
    default:
      return 'default'
  }
}

const NAV_ITEMS = [
  {
    id: 'dossier',
    texte: 'Consultation du dossier',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 1200 1200">
        <path fill="currentColor" d="M600 0c-65.168 0-115.356 54.372-115.356 119.385c0 62.619-.439 117.407-.439 117.407h-115.87c-2.181 0-4.291.241-6.372.586h-32.227v112.573h540.527V237.378h-32.227c-2.081-.345-4.191-.586-6.372-.586H715.796s1.318-49.596 1.318-117.041C717.114 57.131 665.168 0 600 0M175.195 114.185V1200h849.609V114.185H755.64v78.662h191.382v928.345h-693.97V192.847H444.36v-78.662zM600 115.649c21.35 0 38.599 17.18 38.599 38.452c0 21.311-17.249 38.525-38.599 38.525s-38.599-17.215-38.599-38.525c0-21.271 17.249-38.452 38.599-38.452M329.736 426.27v38.525h38.599V426.27zm115.869.732v38.525h424.658v-38.525zm-115.869 144.58v38.525h38.599v-38.525zm115.869.732v38.599h424.658v-38.599zM329.736 716.895v38.525h38.599v-38.525zm115.869.805v38.525h424.658V717.7zM329.736 862.28v38.525h38.599V862.28zm115.869.806v38.525h424.658v-38.525zm-115.869 144.507v38.525h38.599v-38.525zm115.869.805v38.525h424.658v-38.525z"></path>
      </svg>
    )
  },
  {
    id: 'suivi',
    texte: 'Suivi des consultation',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M20.5 14.833c-10.095 2.705-7.748 10.47 1.59 18.718c1.461 1.34 1.91 1.965 1.91 3.74V45.5c10.257 0 19.086-7.246 21.087-17.306S41.704 8.06 32.228 4.136s-20.406-.61-26.104 7.918A21.5 21.5 0 0 0 7.903 38.25"></path>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M27.5 14.833c10.095 2.705 7.748 10.471-1.59 18.718"></path>
        <circle cx={10.216} cy={41.5} r={4} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></circle>
      </svg>
    )
  }
]

function SuiviConsultation({ consultations }) {
    if (!consultations.length) {
        return (
            <div className="patient-content">
                <div className="card">
                    <div className="section-title">
                        <div>
                            <h2>Suivi de consultation</h2>
                            <p className="section-description">
                                Aucun suivi n’est encore associé à votre compte pour le moment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="patient-content">
            <div className="card">
                <div className="section-title">
                    <div>
                        <h2>Suivi de consultation</h2>
                        <p className="section-description">
                            Retrouvez ici l’état d’avancement des consultations, les prochaines étapes et les notes associées.
                        </p>
                    </div>
                </div>
            </div>

            {consultations.map((consultation) => (
                <article
                    key={consultation.id}
                    className="card consultation-card"
                >
                    <div className="section-title">
                        <div>
                            <h3>{consultation.motif}</h3>
                            <p className="section-description">
                                Dr {consultation.medecin} - {formatDate(consultation.date)}
                            </p>
                        </div>
                        <span className={`status-pill ${getStatusClassName(consultation.statut)}`}>
                            {consultation.statut}
                        </span>
                    </div>

                    <div className="tag-row">
                        <span className="detail-tag">Étape : {consultation.etape}</span>
                    </div>

                    <p className="section-description" style={{ marginTop: '1rem' }}>
                        {consultation.note}
                    </p>

                    <div className="consultation-detail-grid">
                        <div className="detail-card">
                            <h4>Bilan médical</h4>
                            <ul>
                                {(consultation.bilans || []).map((bilan, index) => (
                                    <li key={`${consultation.id}-bilan-${index}`}>
                                        <strong>{bilan.libelle}</strong> : {bilan.resultat}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="detail-card">
                            <h4>Prescription</h4>
                            <ul>
                                {(consultation.prescriptions || []).map((prescription, index) => (
                                    <li key={`${consultation.id}-prescription-${index}`}>
                                        <strong>{prescription.medicament}</strong> · {prescription.dosage} · {prescription.frequence} · {prescription.duree}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    )
}

export default function Patient({ dossier = Dossier, patientAccount = null, onLogout = () => {} }) {
    const [sectionActive, setSectionActive] = useState('dossier')
    const [sharedConsultations, setSharedConsultations] = useState(() => getStoredConsultations())
    const [sharedAppointments, setSharedAppointments] = useState(() => getStoredAppointments())
    const patientData = getPatientDataForAccount(patientAccount)

    useEffect(() => {
        const syncConsultations = () => setSharedConsultations(getStoredConsultations())
        const syncAppointments = () => setSharedAppointments(getStoredAppointments())

        syncConsultations()
        syncAppointments()

        if (typeof window !== 'undefined') {
            window.addEventListener('consultations-updated', syncConsultations)
            window.addEventListener('appointments-updated', syncAppointments)
            return () => {
                window.removeEventListener('consultations-updated', syncConsultations)
                window.removeEventListener('appointments-updated', syncAppointments)
            }
        }
    }, [])

    const dossierCourant = patientAccount?.dossier ? {
    id_dossier:    patientAccount.dossier.id_dossier    || patientAccount.id || '',
    nom:           patientAccount.dossier.nom            || '',
    prenom:        patientAccount.dossier.prenom         || '',
    age:           patientAccount.dossier.age            || '',
    adresse:       patientAccount.dossier.adresse        || '',
    sexe:          patientAccount.dossier.sexe           || '',
    groupe:        patientAccount.dossier.groupe         || '',
    antecedent:    patientAccount.dossier.antecedent     || [],
    telephone:     patientAccount.dossier.telephone      || '',
    email:         patientAccount.dossier.email          || user?.email || '',
    statut:        patientAccount.dossier.statut         || 'actif',
    dateNaissance: patientAccount.dossier.dateNaissance  || '',
} : {
    // ← si pas de patientAccount du tout
    nom:      user?.username || '',
    prenom:   '',
    adresse:  user?.profil?.adresse   || '',
    telephone: user?.profil?.telephone || '',
}

    const currentPatientId = patientAccount?.patientId || patientAccount?.id || patientAccount?.dossierId || patientAccount?.dossier?.id_dossier || patientAccount?.dossier?.patientId || ''
    const normalizedCurrentPatientId = String(currentPatientId).toLowerCase()
    const patientConsultations = (sharedConsultations || []).filter((consultation) => matchesPatientRecord(consultation, normalizedCurrentPatientId))
    const patientAppointments = (sharedAppointments || []).filter((appointment) => matchesPatientRecord(appointment, normalizedCurrentPatientId))
    const consultationsToDisplay = patientConsultations.length ? patientConsultations : patientData.consultations
    const appointmentsToDisplay = patientAppointments.length ? patientAppointments : patientData.rdv

    const renderSection = () => {
        switch (sectionActive) {
            case 'dossier':
                return <GenererDossier Dossier={dossierCourant} />
            default:
                return <SuiviConsultation consultations={consultationsToDisplay} rdv={appointmentsToDisplay} />
        }
    }

    return (
        <div className="patient-layout">
            <aside className="patient-sidebar">
                <div className="profile-card">
                    <img className="profile-avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaMXgiRLzm0Z5YBZ7l6CjDamfid8VifEWj-qsWUMYpFw&s=10" alt="Portrait patient" />
                    <div className="profile-meta">
                        <span className="profile-badge">Patient</span>
                        <h3>{dossierCourant.nom} {dossierCourant.prenom}</h3>
                        <p>{dossierCourant.sexe} · {dossierCourant.age} ans</p>
                    </div>
                </div>

                <div className="patient-info-card">
                    <div className="info-row">
                        <span>Groupe sanguin</span>
                        <strong>{dossierCourant.groupe}</strong>
                    </div>
                    <div className="info-row">
                        <span>Adresse</span>
                        <strong>{dossierCourant.adresse}</strong>
                    </div>
                    <div className="info-row">
                        <span>Rendez-vous</span>
                        <strong>{appointmentsToDisplay.length}</strong>
                    </div>
                </div>

                <div className="patient-nav-card">
                    <h4>Mes actions</h4>
                    <ul className="options">
                        {NAV_ITEMS.map(item => (
                            <li
                                key={item.id}
                                className={`liste-item ${sectionActive === item.id ? 'active' : ''}`}
                                onClick={() => setSectionActive(item.id)}
                            >
                                {item.icon}
                                <span>{item.texte}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <button className='btn-deconnexion' type='button' onClick={onLogout}>
                    Se déconnecter
                </button>
            </aside>

            <main className="patient-main">
                <div className="patient-main-header">
                    <div>
                        <p className="eyebrow">Espace patient</p>
                        <h1>Bonjour {dossierCourant.prenom}</h1>
                        <p className="section-description">Consultez votre dossier médical, gérez vos rendez-vous et suivez vos consultations en un seul endroit.</p>
                    </div>
                    <div className="stat-grid">
                        <div className="stat-card">
                            <span>Prochains RDV</span>
                            <strong>{appointmentsToDisplay.length}</strong>
                        </div>
                        <div className="stat-card">
                            <span>Consultations</span>
                            <strong>{consultationsToDisplay.length}</strong>
                        </div>
                    </div>
                </div>

                <div className="patient-content">
                    {renderSection()}
                </div>
            </main>
        </div>
    )
}