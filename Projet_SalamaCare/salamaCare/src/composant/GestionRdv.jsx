import { useState } from 'react'
import './CSS_UI/gestion-rdv.css'


const IconRendezVous = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
		<path d="M16 2v4M8 2v4m5-2h-2C7.229 4 5.343 4 4.172 5.172S3 8.229 3 12v2c0 3.771 0 5.657 1.172 6.828S7.229 22 11 22h2c3.771 0 5.657 0 6.828-1.172S21 17.771 21 14v-2c0-3.771 0-5.657-1.172-6.828S16.771 4 13 4M3 10h18"></path>
		<path d="M9 16.5s1.5.5 2 2c0 0 2.177-4 5-5"></path>
	</g>
</svg>
export default function GestionRdv({
  rendezVous = [],
  onAnnulerRdv,
  onAjouterRendezVous,
  onReporterRdv,
  onModifierRdv,
  medecins = [],
  dossiers = []
}) {
  const [rdvSelectionne, setRdvSelectionne] = useState(null)
  const [afficherModal, setAfficherModal] = useState(false)
  const [typeModal, setTypeModal] = useState('nouveau')
  const [filtreStatut, setFiltreStatut] = useState('tous')
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({
    dateHeure: '',
    duree: '30',
    motif: '',
    lieu: '',
    patientId: '',
    specialite: '',
    medecinId: '',
    notes: ''
  })

  const rdvAujourdhui = rendezVous.filter(r => {
    const date = new Date(r.dateHeure).toDateString()
    return date === new Date().toDateString()
  })

  const rdvFiltrés = filtreStatut === 'tous' 
    ? rendezVous 
    : rendezVous.filter(r => r.statut === filtreStatut)

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'planifié': return 'statut-bleu'
      case 'confirmé': return 'statut-vert'
      case 'reporté': return 'statut-orange'
      case 'en_cours': return 'statut-orange'
      case 'terminé': return 'statut-gris'
      case 'annulé': return 'statut-rouge'
      default: return ''
    }
  }

  const getPatientName = (patientId) => {
    const patient = dossiers.find(d => d.patientId === patientId || d.id === patientId)
    return patient ? patient.nomPatient : 'Patient inconnu'
  }

  const getMedecinName = (medecinId) => {
    const medecin = medecins.find(m => m.id === medecinId)
    return medecin ? `${medecin.prenom} ${medecin.nom}` : 'Médecin non attribué'
  }

  const specialtyOptions = Array.from(new Set(medecins.map((medecin) => medecin.specialite).filter(Boolean)))

  const availableMedecinsForSelection = medecins.filter((medecin) => {
    const matchesSpecialty = !formData.specialite || medecin.specialite?.toLowerCase() === formData.specialite.toLowerCase()
    return matchesSpecialty && medecin.disponibilite !== false
  })

  const buildFormData = (rdv = null) => {
    const selectedMedecin = rdv?.medecinId ? medecins.find((medecin) => medecin.id === rdv.medecinId) : null

    return {
      dateHeure: rdv?.dateHeure || '',
      duree: String(rdv?.duree || 30),
      motif: rdv?.motif || '',
      lieu: rdv?.lieu || '',
      patientId: rdv?.patientId || '',
      specialite: selectedMedecin?.specialite || '',
      medecinId: rdv?.medecinId || '',
      notes: rdv?.notes || ''
    }
  }

  const handleAjouterRdv = () => {
    setTypeModal('nouveau')
    setFormError('')
    setFormData(buildFormData())
    setAfficherModal(true)
  }

  const handleEnvoyerRappel = () => {
    if (rdvSelectionne) {
      setTypeModal('rappel')
      setAfficherModal(true)
    }
  }

  const handleReporterClick = () => {
    if (rdvSelectionne) {
      setTypeModal('report')
      setFormError('')
      setFormData(buildFormData(rdvSelectionne))
      setAfficherModal(true)
    }
  }

  const handleModifierClick = () => {
    if (rdvSelectionne) {
      setTypeModal('edit')
      setFormError('')
      setFormData(buildFormData(rdvSelectionne))
      setAfficherModal(true)
    }
  }

  const handleSubmitModal = (event) => {
    event.preventDefault()

    if (typeModal === 'nouveau' || typeModal === 'edit') {
      if (!formData.specialite) {
        setFormError('Veuillez choisir une spécialité de médecin.')
        return
      }

      const selectedDoctor = medecins.find((medecin) => medecin.id === formData.medecinId)
      const hasAvailableDoctor = availableMedecinsForSelection.some((medecin) => medecin.id === formData.medecinId)

      if (!selectedDoctor || !hasAvailableDoctor) {
        setFormError('Aucun médecin disponible n’est actuellement disponible pour cette spécialité.')
        return
      }

      setFormError('')
    }

    if (typeModal === 'nouveau') {
      const generatedId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `r${Date.now()}-${Math.random().toString(16).slice(2)}`

      const newRdv = {
        id: generatedId,
        patientId: formData.patientId || (dossiers[0]?.patientId || dossiers[0]?.id || ''),
        medecinId: formData.medecinId || null,
        specialite: formData.specialite,
        dateHeure: formData.dateHeure,
        duree: Number(formData.duree) || 30,
        statut: 'planifié',
        motif: formData.motif || 'Consultation',
        lieu: formData.lieu || 'Cabinet',
        notes: formData.notes || '',
        rappelEnvoyé: false
      }

      onAjouterRendezVous?.(newRdv)
      setRdvSelectionne(newRdv)
    }

    if (typeModal === 'report' && rdvSelectionne) {
      onReporterRdv?.(rdvSelectionne.id, formData.dateHeure)
    }

    if (typeModal === 'edit' && rdvSelectionne) {
      onModifierRdv?.({
        ...rdvSelectionne,
        ...formData,
        duree: Number(formData.duree) || rdvSelectionne.duree,
        patientId: formData.patientId || rdvSelectionne.patientId,
        specialite: formData.specialite,
        medecinId: formData.medecinId || rdvSelectionne.medecinId,
        dateHeure: formData.dateHeure,
        motif: formData.motif,
        lieu: formData.lieu,
        notes: formData.notes
      })
    }

    if (typeModal === 'rappel' && rdvSelectionne) {
      window.alert(`Rappel envoyé pour le rendez-vous ${rdvSelectionne.id}`)
    }

    setAfficherModal(false)
  }

  return (
    <div className='gestion-rdv-container'>
      <div className='rdv-header'>
        <h2>Gestion des Rendez-vous</h2>
        <button className='btn-primary' onClick={handleAjouterRdv}>
          <iconify-icon icon="material-symbols:calendar-month"></iconify-icon>
          Créer un rendez-vous
        </button>
      </div>

      <div className='rdv-stats'>
        <div className='stat-card'>
          <div className='stat-icon'>{IconRendezVous}</div>
          <div className='stat-content'>
            <p className='stat-label'>Rendez-vous aujourd'hui</p>
            <p className='stat-value'>{rdvAujourdhui.length}</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <g fill="none" stroke="#2bf17e" strokeLinecap="square" strokeWidth={2}>
                <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2a10 10 0 0 1 3.847.767"></path>
                <path d="m22 4.5l-10 10L7.5 10"></path>
              </g>
            </svg>
          </div>
          <div className='stat-content'>
            <p className='stat-label'>Confirmés</p>
            <p className='stat-value'>{rendezVous.filter(r => r.statut === 'confirmé').length}</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V3m0 18v-2m7-7h2M3 12h3m11.657-5.657l.707-.707M5.636 18.364L7.05 16.95m9.9 0l1.414 1.414M5.636 5.636l2.121 2.121"></path>
            </svg>
          </div>
          <div className='stat-content'>
            <p className='stat-label'>En cours</p>
            <p className='stat-value'>{rendezVous.filter(r => r.statut === 'en_cours').length}</p>
          </div>
        </div>
      </div>

      <div className='rdv-content'>
        <div className='rdv-filters'>
          <h3>Filtrer par statut</h3>
          <div className='filter-buttons'>
            <button 
              className={`filter-btn ${filtreStatut === 'tous' ? 'active' : ''}`}
              onClick={() => setFiltreStatut('tous')}
            >
              Tous
            </button>
            <button 
              className={`filter-btn ${filtreStatut === 'planifié' ? 'active' : ''}`}
              onClick={() => setFiltreStatut('planifié')}
            >
              Planifiés
            </button>
            <button 
              className={`filter-btn ${filtreStatut === 'confirmé' ? 'active' : ''}`}
              onClick={() => setFiltreStatut('confirmé')}
            >
              Confirmés
            </button>
            <button 
              className={`filter-btn ${filtreStatut === 'reporté' ? 'active' : ''}`}
              onClick={() => setFiltreStatut('reporté')}
            >
              Reportés
            </button>
            <button 
              className={`filter-btn ${filtreStatut === 'en_cours' ? 'active' : ''}`}
              onClick={() => setFiltreStatut('en_cours')}
            >
              En cours
            </button>
          </div>
        </div>

        <div className='rdv-list'>
          <h3>Rendez-vous ({rdvFiltrés.length})</h3>
          {rdvFiltrés.length > 0 ? (
            <div className='rdv-items'>
              {rdvFiltrés.map(rdv => (
                <div
                  key={rdv.id}
                  className={`rdv-item ${rdvSelectionne?.id === rdv.id ? 'active' : ''}`}
                  onClick={() => setRdvSelectionne(rdv)}
                >
                  <div className='rdv-item-time'>
                    <div className='rdv-heure'>
                      {new Date(rdv.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className='rdv-date'>
                      {new Date(rdv.dateHeure).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className='rdv-item-content'>
                    <p className='rdv-motif'>{rdv.motif}</p>
                    <p className='rdv-lieu'>{rdv.lieu}</p>
                    <p className='rdv-lieu' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Patient : {getPatientName(rdv.patientId)}
                    </p>
                    <p className='rdv-lieu' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Médecin : {getMedecinName(rdv.medecinId)}
                    </p>
                  </div>
                  <div className={`rdv-statut ${getStatusColor(rdv.statut)}`}>
                    {rdv.statut}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='empty-state'>
              <p>Aucun rendez-vous trouvé</p>
            </div>
          )}
        </div>

        {rdvSelectionne && (
          <div className='rdv-details'>
            <div className='details-header'>
              <h3>Détails du Rendez-vous</h3>
              <button className='btn-secondary btn-small' onClick={() => setRdvSelectionne(null)}>×</button>
            </div>

            <div className='details-grid'>
              <div className='detail-item'>
                <label>Date et Heure</label>
                <p>{new Date(rdvSelectionne.dateHeure).toLocaleString('fr-FR')}</p>
              </div>
              <div className='detail-item'>
                <label>Durée</label>
                <p>{rdvSelectionne.duree} minutes</p>
              </div>
              <div className='detail-item'>
                <label>Motif</label>
                <p>{rdvSelectionne.motif}</p>
              </div>
              <div className='detail-item'>
                <label>Lieu</label>
                <p>{rdvSelectionne.lieu}</p>
              </div>
              <div className='detail-item'>
                <label>Patient</label>
                <p>{getPatientName(rdvSelectionne.patientId)}</p>
              </div>
              <div className='detail-item'>
                <label>Médecin attribué</label>
                <p>{getMedecinName(rdvSelectionne.medecinId)}</p>
              </div>
              <div className='detail-item'>
                <label>Statut</label>
                <span className={`statut-badge ${getStatusColor(rdvSelectionne.statut)}`}>
                  {rdvSelectionne.statut}
                </span>
              </div>
              <div className='detail-item'>
                <label>Rappel</label>
                <p>{rdvSelectionne.rappelEnvoyé ? '✓ Envoyé' : '⊘ Non envoyé'}</p>
              </div>
            </div>

            {rdvSelectionne.notes && (
              <div className='details-section'>
                <h4>Notes</h4>
                <p className='notes-content'>{rdvSelectionne.notes}</p>
              </div>
            )}

            <div className='details-actions'>
              <button className='btn-secondary' onClick={handleEnvoyerRappel}>
                Envoyer un rappel
              </button>
              <button className='btn-secondary' onClick={handleReporterClick}>
                Reporter
              </button>
              <button className='btn-secondary' onClick={handleModifierClick}>
                Modifier
              </button>
              {rdvSelectionne.statut !== 'terminé' && rdvSelectionne.statut !== 'annulé' && (
                <button 
                  className='btn-danger' 
                  onClick={() => onAnnulerRdv?.(rdvSelectionne.id)}
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {afficherModal && (
        <div className='modal-overlay' onClick={() => setAfficherModal(false)}>
          <div className='modal-content rdv-modal' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>
                {typeModal === 'nouveau' ? 'Créer un rendez-vous' : 'Envoyer un rappel'}
              </h3>
              <button className='btn-close' onClick={() => setAfficherModal(false)}>×</button>
            </div>

            <div className='modal-body'>
              {typeModal === 'nouveau' || typeModal === 'edit' || typeModal === 'report' ? (
                <form onSubmit={handleSubmitModal}>
                  {formError && (
                    <div style={{ marginBottom: '1rem', color: '#dc2626', fontSize: '0.95rem' }} role='alert'>
                      {formError}
                    </div>
                  )}

                  <div className='form-group'>
                    <label>Date et Heure</label>
                    <input
                      type="datetime-local"
                      value={formData.dateHeure}
                      onChange={(e) => setFormData({ ...formData, dateHeure: e.target.value })}
                      required
                    />
                  </div>
                  <div className='form-row'>
                    <div className='form-group'>
                      <label>Durée (minutes)</label>
                      <input
                        type="number"
                        min="15"
                        step="15"
                        value={formData.duree}
                        onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                        required
                      />
                    </div>
                    <div className='form-group'>
                      <label>Patient</label>
                      <select
                        value={formData.patientId}
                        onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                        required
                      >
                        <option value=''>Sélectionner un patient</option>
                        {dossiers.map(dossier => (
                          <option key={dossier.id} value={dossier.patientId || dossier.id}>{dossier.nomPatient}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className='form-row'>
                    <div className='form-group'>
                      <label>Spécialité du médecin</label>
                      <select
                        value={formData.specialite}
                        onChange={(e) => setFormData({ ...formData, specialite: e.target.value, medecinId: '' })}
                        required
                      >
                        <option value=''>Sélectionner une spécialité</option>
                        {specialtyOptions.map((specialite) => (
                          <option key={specialite} value={specialite}>{specialite}</option>
                        ))}
                      </select>
                    </div>
                    <div className='form-group'>
                      <label>Médecin disponible</label>
                      <select
                        value={formData.medecinId}
                        onChange={(e) => setFormData({ ...formData, medecinId: e.target.value })}
                        required
                        disabled={!formData.specialite || availableMedecinsForSelection.length === 0}
                      >
                        <option value=''>
                          {formData.specialite
                            ? (availableMedecinsForSelection.length > 0 ? 'Sélectionner un médecin' : 'Aucun médecin disponible')
                            : 'Sélectionner une spécialité'}
                        </option>
                        {availableMedecinsForSelection.map((medecin) => (
                          <option key={medecin.id} value={medecin.id}>Dr. {medecin.prenom} {medecin.nom}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {formData.specialite && availableMedecinsForSelection.length === 0 && (
                    <p style={{ marginTop: '-0.25rem', color: '#dc2626', fontSize: '0.9rem' }}>
                      Aucun médecin disponible n’est actuellement disponible pour cette spécialité.
                    </p>
                  )}
                  <div className='form-group'>
                    <label>Lieu</label>
                    <input
                      type="text"
                      value={formData.lieu}
                      onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                      placeholder="Ex: Cabinet A, Salle 1"
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label>Motif de la consultation</label>
                    <textarea
                      value={formData.motif}
                      onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                      placeholder="Décrivez le motif de la consultation"
                      rows={3}
                      required
                    ></textarea>
                  </div>
                  <div className='form-group'>
                    <label>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Informations complémentaires"
                      rows={2}
                    ></textarea>
                  </div>
                </form>
              ) : (
                <form>
                  <div className='form-group'>
                    <label>Type de rappel</label>
                    <div className='radio-group'>
                      <label className='radio-label'>
                        <input type="radio" name="type" value="email" defaultChecked />
                        Email
                      </label>
                      <label className='radio-label'>
                        <input type="radio" name="type" value="sms" />
                        SMS
                      </label>
                      <label className='radio-label'>
                        <input type="radio" name="type" value="notification" />
                        Notification
                      </label>
                    </div>
                  </div>
                  <div className='form-group'>
                    <label>Message personnalisé</label>
                    <textarea
                      placeholder="Entrez le message de rappel"
                      rows={4}
                    ></textarea>
                  </div>
                  <div className='form-group'>
                    <label>
                      <input type="checkbox" defaultChecked />
                      Envoyer immédiatement
                    </label>
                  </div>
                </form>
              )}
            </div>

            <div className='modal-footer'>
              <button className='btn-secondary' onClick={() => setAfficherModal(false)}>Annuler</button>
              <button className='btn-primary' onClick={handleSubmitModal} type='button'>
                {typeModal === 'nouveau' ? 'Créer' : typeModal === 'report' ? 'Reporter' : typeModal === 'edit' ? 'Enregistrer' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
