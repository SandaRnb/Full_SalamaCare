import { useState } from 'react'

import './App.css'
import './composant/CSS_UI/responsable.css'
import './composant/CSS_UI/gestion-dossier.css'
import './composant/CSS_UI/gestion-rdv.css'
import './composant/CSS_UI/attribution-medecin.css'
import './composant/CSS_UI/suivi-flux.css'
import NavBarResponsable from './composant/NavBarResponsable'
import {SideBar} from './composant/SideBar'
import GestionDossier from './composant/GestionDossier'
import GestionRdv from './composant/GestionRdv'
import AttributionMedecin from './composant/AttributionMedecin'
import SuiviFlux from './composant/SuiviFlux'
import medecin from './assets/images/medecin.jpg'
import { StatistiqueGeneral } from './composant/Statistique'




const sampleMedecins = [
  { id: 'm1', nom: 'Diaz', prenom: 'Sofia', specialite: 'Généraliste', email: 'sofia.diaz@salamacare.test', telephone: '0601020304', disponibilite: true, horaires: ['08:00-12:00', '14:00-18:00'], photoIdentite: medecin },
  { id: 'm2', nom: 'Ben Aissa', prenom: 'Nabil', specialite: 'Cardiologue', email: 'nabil.ben@salamacare.test', telephone: '0605060708', disponibilite: false, horaires: ['09:00-13:00'], photoIdentite: medecin }
]

const sampleDossiers = [
  { id: 'd1', patientId: 'p1', nomPatient: 'Yasmine Haddad', dateCreation: '2026-06-20', dateModification: '2026-07-01', statut: 'actif', documents: [
      { id: 'doc1', nom: 'Ordonnance initiale', type: 'Ordonnance', dateUpload: '2026-06-21', taille: 148000, url: '#', description: 'Ordonnance de suivi médical' }
    ],
    medecin: sampleMedecins[0],
    historique: [
      { id: 'h1', action: 'Création du dossier', dateAction: '2026-06-20T09:15:00', utilisateur: 'Admin', details: 'Dossier créé pour le patient Yasmine Haddad' }
    ]
  },
  { id: 'd2', patientId: 'p2', nomPatient: 'Karim Toumi', dateCreation: '2026-06-25', dateModification: '2026-06-30', statut: 'en_attente', documents: [], medecin: null, historique: [] }
]

const sampleRendezVous = [
  { id: 'r1', patientId: 'p1', medecinId: 'm1', dateHeure: '2026-07-03T14:30:00', duree: 30, statut: 'planifié', motif: 'Suivi hypertension', lieu: 'Cabinet A', notes: 'Mesure de tension et bilan sanguin', rappelEnvoyé: false },
  { id: 'r2', patientId: 'p2', medecinId: 'm2', dateHeure: '2026-07-03T10:00:00', duree: 45, statut: 'confirmé', motif: 'Douleur thoracique', lieu: 'Cabinet B', notes: '', rappelEnvoyé: true }
]

const sampleAttributions = [
  { id: 'a1', dossierPatientId: 'd1', medecinId: 'm1', dateAttribution: '2026-06-20', niveau: 'principal', raison: 'Suivi général', statut: 'active' },
  { id: 'a2', dossierPatientId: 'd2', medecinId: 'm2', dateAttribution: '2026-06-25', niveau: 'principal', raison: 'Spécialité cardiologie', statut: 'terminée', dateDesattribution: '2026-06-30' }
]

const sampleFileAttente = [
  { id: 'f1', patientId: 'p3', nomPatient: 'Lina Khouaja', heureArrivee: '2026-07-03T08:50:00', tempsAttente: 18, priorite: 'normale', statut: 'en_attente' },
  { id: 'f2', patientId: 'p4', nomPatient: 'Omar Fathi', heureArrivee: '2026-07-03T09:05:00', tempsAttente: 5, priorite: 'haute', statut: 'en_cours' },
  { id: 'f3', patientId: 'p5', nomPatient: 'Maya Zayani', heureArrivee: '2026-07-03T09:20:00', tempsAttente: 2, priorite: 'urgente', statut: 'en_attente' }
]

const notifications =[
  { id: "n1", contenus : 'demande de rendez-vous pour le patient Yasmine Haddad', date: '2026-07-03T09:00:00', statut: 'non_lu' , id_envoyeur : 'p1' , nom_envoyeur : 'Yasmine Haddad'},
  { id: "n2", contenus : 'demande de modification de dossier', date: '2026-07-03T10:00:00', statut: 'non_lu' , id_envoyeur : 'p2' , nom_envoyeur : 'Karim Toumi'}
]

const messages = [
  { id: "m1", contenus : 'Bonjour, je souhaite prendre rendez-vous avec une médecin généraliste', date: '2026-07-03T09:00:00', statut: 'non_lu' , id_envoyeur : 'p1' , nom_envoyeur : 'Yasmine Haddad'},
  { id: "m2", contenus : 'Bonsoir, mon enfant a de la fièvre depuis deux jours, que dois-je faire?', date: '2026-07-03T09:00:00', statut: 'non_lu' , id_envoyeur : 'p1' , nom_envoyeur : 'Yasmine Haddad'},
  { id: "m3", contenus : 'Je souhaite obtenir des informations sur les analyses médicales disponibles.', date: '2026-07-03T09:00:00', statut: 'non_lu' , id_envoyeur : 'p1' , nom_envoyeur : 'Yasmine Haddad'},
]


function App() {
  const [activeSection, setActiveSection] = useState('suivi')
  const [notifNumber] = useState([notifications, messages]) // [notifications, messages]  mettre setNotifNumber après


  const renderSectionComponent = () => {
    switch (activeSection) {
      case "stats" :
        return <StatistiqueGeneral medecins={sampleMedecins} dossiers={sampleDossiers} rendezVous={sampleRendezVous} />
      case 'dossier':
        return <GestionDossier dossiers={sampleDossiers} />
      case 'rdv':
        return <GestionRdv rendezVous={sampleRendezVous} onAnnulerRdv={(rdvId) => window.alert(`RDV ${rdvId} annulé (démo)`)} />
      case 'attribution':
        return <AttributionMedecin attributions={sampleAttributions} dossiers={sampleDossiers} medecins={sampleMedecins} onRetirerAttribution={(id) => window.alert(`Attribution ${id} retirée (démo)`)} />
      case 'suivi':
        return <SuiviFlux fileAttente={sampleFileAttente} />
      default:
        return null
    }
  }

  return (
    <div className='responsable-dashboard'>
      <SideBar
        activeSection={activeSection}
        onSelectSection={(sectionId) => {
          setActiveSection(sectionId)
        }}
        onSignOut={() => window.alert('Vous avez été déconnecté.')}
      />

      <div className='main-content'>
        <NavBarResponsable notifNumber={notifNumber} />

        <section className='content-panel'>
          {renderSectionComponent()}
        </section>
      </div>
    </div>
  )
}

export default App
