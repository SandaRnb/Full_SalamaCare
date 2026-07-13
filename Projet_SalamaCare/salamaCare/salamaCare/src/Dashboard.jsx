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
import { createDoctorAccount, getStoredDoctors, saveStoredDoctors, syncStoredPatientsFromDossiers, getStoredConsultations, saveStoredConsultations, createSharedConsultation, getStoredAppointments, saveStoredAppointments, createSharedAppointment } from './utils/authStorage'
import { fetchAppointmentsFromBackend, fetchDoctorsFromBackend, fetchPatientsFromBackend } from './services/backendAdapter'

function Dashboard() {
  const [activeSection, setActiveSection] = useState('stats')
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('notifications') || 'null')
      return Array.isArray(stored) ? stored : initialNotifications
    } catch {
      return initialNotifications
    }
  })

  const [medecins, setMedecins] = useState(initialMedecins)
  const [dossiers, setDossiers] = useState(initialDossiers)
  const [attributions, setAttributions] = useState(initialAttributions)
  const [rendezVous, setRendezVous] = useState(() => getStoredAppointments())
  const [consultations, setConsultations] = useState(() => getStoredConsultations())
  const [toasts, setToasts] = useState([])
  const [pendingRequests, setPendingRequests] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('rdvRequests') || '[]')
    return Array.isArray(stored) ? stored : []
  })
  const [fileAttente, setFileAttente] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('fileAttente') || 'null')
      return Array.isArray(stored) && stored.length > 0 ? stored : initialFileAttente
    } catch {
      return initialFileAttente
    }
  })

  useEffect(() => {
    localStorage.setItem('rdvRequests', JSON.stringify(pendingRequests))
  }, [pendingRequests])

  // persist notifications and messages so they survive reloads
  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications))
    } catch (e) {
      console.warn('Could not persist notifications', e)
    }
  }, [notifications])

 
 

  useEffect(() => {
    try {
      localStorage.setItem('fileAttente', JSON.stringify(fileAttente))
    } catch (error) {
      console.warn('Could not persist file d\'attente', error)
    }
  }, [fileAttente])

  useEffect(() => {
    syncStoredPatientsFromDossiers(dossiers)
  }, [dossiers])

  useEffect(() => {
    saveStoredConsultations(consultations)
  }, [consultations])

  useEffect(() => {
    saveStoredAppointments(rendezVous)
  }, [rendezVous])

  useEffect(() => {
    const loadBackendData = async () => {
        try {
            const [patientsData, doctorsData, appointmentsData, notificationsData] = await Promise.all([
                fetchPatientsFromBackend(),
                fetchDoctorsFromBackend(),
                fetchAppointmentsFromBackend(),
                fetchNotificationsFromBackend(),
            ])

            if (patientsData?.length)      setDossiers(patientsData)
            if (doctorsData?.length)       setMedecins(doctorsData)
            if (appointmentsData?.length)  setRendezVous(appointmentsData)
            if (notificationsData?.length) setNotifications(notificationsData)

        } catch (err) {
            console.warn('Backend non disponible, données mock utilisées', err)
        }
    }
    loadBackendData()
}, [])

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  const pushConfirmToast = ({ message, onConfirm, timeout = 30000 }) => {
    const id = `t${Date.now()}`
    const t = {
      id,
      type: 'confirm',
      message,
      actions: [
        { label: 'Confirmer', onClick: () => { try { onConfirm() } finally { removeToast(id) } } },
        { label: 'Annuler', onClick: () => removeToast(id) }
      ]
    }
    setToasts(prev => [t, ...prev])
    if (timeout > 0) setTimeout(() => removeToast(id), timeout)
    return id
  }

  const handleAjouterDossier = (newDossier) => {
    const nextDossiers = [...dossiers, newDossier]
    setDossiers(nextDossiers)
    syncStoredPatientsFromDossiers(nextDossiers)
  }

  const handleModifierDossier = (updatedDossier) => {
    const nextDossiers = dossiers.map((dossier) => dossier.id === updatedDossier.id ? updatedDossier : dossier)
    setDossiers(nextDossiers)
    syncStoredPatientsFromDossiers(nextDossiers)
  }

  const handleAnnulerRdv = (rdvId) => {
      pushConfirmToast({
          message: `Confirmer l'annulation du rendez-vous ${rdvId} ?`,
          onConfirm: async () => {
              try {
                  await updateAppointmentStatus(rdvId, 'annule')
              } catch {
                  console.warn('Statut non mis à jour en backend')
              }
              setRendezVous(prev => prev.map(rdv =>
                  rdv.id === rdvId
                      ? { ...rdv, statut: 'annulé', dateModification: new Date().toISOString() }
                      : rdv
              ))
          }
      })
  }

  const handleAjouterRendezVous = async (nouveauRdv) => {
    try {
        const result = await createAppointmentInBackend(nouveauRdv)
        setRendezVous(prev => [...prev, result.rendezvous])
    } catch {
        // fallback local si backend indisponible
        setRendezVous(prev => [...prev, nouveauRdv])
    }
}

  const handleReporterRdv = (rdvId, nouvelleDateHeure) => {
    pushConfirmToast({
      message: `Confirmer le report du rendez-vous ${rdvId} au ${new Date(nouvelleDateHeure).toLocaleString()} ?`,
      onConfirm: () => {
        setRendezVous(prev => prev.map(rdv => rdv.id === rdvId ? { ...rdv, dateHeure: nouvelleDateHeure, statut: 'reporté', dateModification: new Date().toISOString() } : rdv))
        setNotifications(prev => [
          {
            id: `n${Date.now()}`,
            contenus: `Rendez-vous ${rdvId} reporté au ${new Date(nouvelleDateHeure).toLocaleString()}.`,
            date: new Date().toISOString(),
            statut: 'non_lu',
            id_envoyeur: 'system',
            nom_envoyeur: 'Système'
          },
          ...prev
        ])
      }
    })
  }

  const handleModifierRdv = (updatedRdv) => {
    pushConfirmToast({
      message: `Confirmer la modification du rendez-vous ${updatedRdv.id} ?`,
      onConfirm: () => {
        setRendezVous(prev => prev.map(rdv => rdv.id === updatedRdv.id ? { ...rdv, ...updatedRdv, statut: updatedRdv.statut || 'confirmé', dateModification: new Date().toISOString() } : rdv))
        setNotifications(prev => [
          {
            id: `n${Date.now()}`,
            contenus: `Rendez-vous ${updatedRdv.id} modifié.`,
            date: new Date().toISOString(),
            statut: 'non_lu',
            id_envoyeur: 'system',
            nom_envoyeur: 'Système'
          },
          ...prev
        ])
      }
    })
  }

  const handleAppelerPatient = (patientId) => {
    setFileAttente(prev => prev.map(patient => patient.id === patientId ? { ...patient, statut: 'appele' } : patient))
  }

  const handleChangerPriorite = (patientId, priorite) => {
    setFileAttente(prev => prev.map(patient => patient.id === patientId ? { ...patient, priorite } : patient))
  }

  const handleConfirmerConsultation = (patientId) => {
    const patient = dossiers.find((item) => item.id === patientId || item.patientId === patientId)
    setFileAttente(prev => prev.map(patientItem => patientItem.id === patientId ? { ...patientItem, statut: 'en_cours' } : patientItem))

    setConsultations(prev => {
      const matchingPatientId = patient?.patientId || patient?.id || patientId
      const existing = prev.find((item) => item.patientId === matchingPatientId)
      const nextConsultations = existing
        ? prev.map((item) => item.patientId === matchingPatientId ? {
            ...item,
            statut: 'En cours',
            etape: 'consultation',
            note: `Consultation confirmée pour ${patient?.nomPatient || 'le patient'}.`,
            date: new Date().toISOString(),
            medecin: patient?.medecin?.prenom ? `${patient.medecin.prenom} ${patient.medecin.nom}` : item.medecin || 'Médecin'
          } : item)
        : [...prev, createSharedConsultation({
            patientId: matchingPatientId,
            patientName: patient?.nomPatient || 'Patient',
            medecin: patient?.medecin?.prenom ? `${patient.medecin.prenom} ${patient.medecin.nom}` : 'Médecin',
            motif: 'Consultation médicale',
            date: new Date().toISOString(),
            statut: 'En cours',
            etape: 'consultation',
            note: `Consultation confirmée pour ${patient?.nomPatient || 'le patient'}.`,
            bilans: [
              { libelle: 'Température', resultat: 'À renseigner' },
              { libelle: 'Observation', resultat: 'À compléter' }
            ],
            prescriptions: [
              { medicament: 'Paracétamol', dosage: '500 mg', frequence: '3 fois par jour', duree: '3 jours' }
            ]
          })]

      saveStoredConsultations(nextConsultations)
      return nextConsultations
    })
  }

  const handleTerminerPatient = (patientId) => {
    setFileAttente(prev => prev.map(patientItem => patientItem.id === patientId ? { ...patientItem, statut: 'termine' } : patientItem))

    setConsultations(prev => {
      const matchingPatientId = dossiers.find((item) => item.id === patientId || item.patientId === patientId)?.patientId || patientId
      const nextConsultations = prev.map((item) => item.patientId === matchingPatientId ? {
        ...item,
        statut: 'Terminée',
        etape: 'suivi',
        note: 'Consultation terminée et transmise au patient.'
      } : item)

      saveStoredConsultations(nextConsultations)
      return nextConsultations
    })
  }

  const handleValiderDemande = (requestId, propositionData) => {
    setPendingRequests(prev => {
      const request = prev.find(r => r.id === requestId)
      const updates = prev.map(requestItem => {
        if (requestItem.id !== requestId) return requestItem
        return {
          ...requestItem,
          statut: 'confirmé',
          proposition: {
            ...propositionData,
            notifiedDoctor: true,
            dateReservee: new Date().toISOString()
          }
        }
      })

      if (request) {
        setRendezVous(current => [
          ...current,
          createSharedAppointment({
            id: `r${Date.now()}`,
            patientId: request.patientId,
            dossierId: request.dossierId || request.patientDossierId || '',
            patientName: request.patientName || request.nomPatient || '',
            medecinId: propositionData.medecinId || null,
            dateHeure: propositionData.dateHeure,
            duree: propositionData.duree || 30,
            statut: 'confirmé',
            motif: request.motif,
            lieu: propositionData.lieu,
            notes: `RDV confirmé et médecin notifié${propositionData.note ? ` : ${propositionData.note}` : ''}`
          })
        ])
      }

      return updates
    })
  }

  const handleRetirerAttribution = (id) => {
    setAttributions(prev => prev.map(a => {
      if (a.id !== id) return a
      return {
        ...a,
        statut: 'terminée',
        dateDesattribution: new Date().toISOString().split('T')[0]
      }
    }))
  }

  const handleAjouterAttribution = (newAttribution) => {
    setAttributions(prev => [...prev, newAttribution])
  }

  const handleAjouterMedecin = (newMedecin) => {
    setMedecins(prev => [...prev, newMedecin])

    const doctors = getStoredDoctors()
    const doctorAccount = createDoctorAccount(newMedecin)
    const hasAccount = doctors.some((account) => account.email === doctorAccount.email)

    if (!hasAccount) {
      saveStoredDoctors([...doctors, doctorAccount])
    }
  }

  const availableMedecins = medecins.filter(m => m.disponibilite)

  const renderSectionComponent = () => {
    switch (activeSection) {
      case 'stats':
        return <StatistiqueGeneral medecins={medecins} dossiers={dossiers} rendezVous={rendezVous} />
      case 'dossier':
        return <GestionDossier dossiers={dossiers} rendezVous={rendezVous} medecins={medecins} onAjouterDossier={handleAjouterDossier} onModifierDossier={handleModifierDossier} searchQuery={searchQuery} />
      case 'rdv':
        return (
          <GestionRdv
            rendezVous={rendezVous}
            pendingRequests={pendingRequests}
            medecins={medecins}
            dossiers={dossiers}
            fileAttente={fileAttente}
            onAnnulerRdv={handleAnnulerRdv}
            onAjouterRendezVous={handleAjouterRendezVous}
            onValiderDemande={handleValiderDemande}
            onReporterRdv={handleReporterRdv}
            onModifierRdv={handleModifierRdv}
          />
        )
      case 'attribution':
        return (
          <AttributionMedecin
            attributions={attributions}
            dossiers={dossiers}
            medecins={medecins}
            availableMedecins={availableMedecins}
            onRetirerAttribution={handleRetirerAttribution}
            onAjouterAttribution={handleAjouterAttribution}
          />
        )
      case 'suivi':
        return (
          <SuiviFlux
            fileAttente={fileAttente}
            onAppelerPatient={handleAppelerPatient}
            onChangerPriorite={handleChangerPriorite}
            onConfirmerConsultation={handleConfirmerConsultation}
            onTerminerPatient={handleTerminerPatient}
          />
        )
      case 'medecins':
        return <GestionMedecins medecins={medecins} onAjouterMedecin={handleAjouterMedecin} />
      default:
        return null
    }
  }

  return (
    <DashboardLayout
      activeSection={activeSection}
      onSelectSection={(sectionId) => {
        setActiveSection(sectionId)
      }}
      onSignOut={() => {
        localStorage.removeItem('access_token')   // ← clé correcte
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
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
