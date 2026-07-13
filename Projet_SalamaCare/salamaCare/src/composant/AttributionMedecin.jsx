import { useState } from 'react'
import './CSS_UI/attribution-medecin.css'

export default function AttributionMedecin({
  attributions = [],
  dossiers = [],
  medecins = [],
  availableMedecins = [],
  onRetirerAttribution,
  onAjouterAttribution
}) {
  const [attributionSelectionnee, setAttributionSelectionnee] = useState(null)
  const [afficherModal, setAfficherModal] = useState(false)
  const [filtreStatut, setFiltreStatut] = useState('tous')
  const [formData, setFormData] = useState({
    dossierPatientId: '',
    medecinId: '',
    niveau: 'principal',
    raison: ''
  })

  const attributionsFiltrées = filtreStatut === 'tous'
    ? attributions
    : attributions.filter(a => a.statut === filtreStatut)

  const handleAjouterAttribution = () => {
    setFormData({
      dossierPatientId: '',
      medecinId: '',
      niveau: 'principal',
      raison: ''
    })
    setAfficherModal(true)
  }

  const handleSubmitAttribution = (e) => {
    e.preventDefault()
    const newAttribution = {
      id: `a${Date.now()}`,
      dossierPatientId: formData.dossierPatientId || (dossiers[0]?.id ?? ''),
      medecinId: formData.medecinId,
      dateAttribution: new Date().toISOString().split('T')[0],
      niveau: formData.niveau,
      raison: formData.raison,
      statut: 'active'
    }
    onAjouterAttribution?.(newAttribution)
    setAfficherModal(false)
  }

  const handleRetirerAttribution = () => {
    if (attributionSelectionnee) {
      onRetirerAttribution?.(attributionSelectionnee.id)
      setAttributionSelectionnee(null)
    }
  }

  const getMedecinNom = (medecinId) => {
    const medecin = medecins.find(m => m.id === medecinId)
    return medecin ? `${medecin.nom} ${medecin.prenom}` : 'Inconnu'
  }

  const getDossierNom = (dossierId) => {
    const dossier = dossiers.find(d => d.id === dossierId)
    return dossier ? dossier.nomPatient : 'Inconnu'
  }

  const getAttributionsParMedecin = (medecinId) => {
    return attributions.filter(a => a.medecinId === medecinId && a.statut === 'active').length
  }

  return (
    <div className='attribution-medecin-container'>
      <div className='attribution-header'>
        <h2>Attribution au Médecin</h2>
        <button className='btn-primary' onClick={handleAjouterAttribution}>
          <iconify-icon icon="material-symbols:person-add"></iconify-icon>
          Attribuer un médecin
        </button>
      </div>

      <div className='attribution-stats'>
        <div className='stat-card'>
          <div className='stat-icon'>
            <svg xmlns="http://www.w3.org/2000/svg" width="0.94em" height="1em" viewBox="0 0 15 16">
              <path fill="currentColor" d="M7.5 7a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5m0-4C6.67 3 6 3.67 6 4.5S6.67 6 7.5 6S9 5.33 9 4.5S8.33 3 7.5 3"></path>
              <path fill="currentColor" d="M13.5 11c-.28 0-.5-.22-.5-.5s.22-.5.5-.5s.5-.22.5-.5A2.5 2.5 0 0 0 11.5 7h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5c.83 0 1.5-.67 1.5-1.5S11.33 3 10.5 3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5A2.5 2.5 0 0 1 13 4.5c0 .62-.22 1.18-.6 1.62c1.49.4 2.6 1.76 2.6 3.38c0 .83-.67 1.5-1.5 1.5m-12 0C.67 11 0 10.33 0 9.5c0-1.62 1.1-2.98 2.6-3.38c-.37-.44-.6-1-.6-1.62A2.5 2.5 0 0 1 4.5 2c.28 0 .5.22.5.5s-.22.5-.5.5C3.67 3 3 3.67 3 4.5S3.67 6 4.5 6c.28 0 .5.22.5.5s-.22.5-.5.5h-1A2.5 2.5 0 0 0 1 9.5c0 .28.22.5.5.5s.5.22.5.5s-.22.5-.5.5m9 3h-6c-.83 0-1.5-.67-1.5-1.5v-1C3 9.57 4.57 8 6.5 8h2c1.93 0 3.5 1.57 3.5 3.5v1c0 .83-.67 1.5-1.5 1.5m-4-5A2.5 2.5 0 0 0 4 11.5v1c0 .28.22.5.5.5h6c.28 0 .5-.22.5-.5v-1A2.5 2.5 0 0 0 8.5 9z"></path>
            </svg>
          </div>
          <div className='stat-content'>
            <p className='stat-label'>Attributions actives</p>
            <p className='stat-value'>{attributions.filter(a => a.statut === 'active').length}</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M3 14v-4c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172c.654.653.943 1.528 1.07 2.828M21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172c-.654-.653-.943-1.528-1.07-2.828M8 14h5m-5-4h1m7 0h-4"></path>
          </svg>
          </div>
          <div className='stat-content'>
            <p className='stat-label'>Dossiers attribués</p>
            <p className='stat-value'>{new Set(attributions.filter(a => a.statut === 'active').map(a => a.dossierPatientId)).size}</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                <path d="M13.498 2h-5a1.5 1.5 0 1 0 0 3h5a1.5 1.5 0 1 0 0-3m-6.5 13h3.429m-3.429-4h8"></path>
                <path d="M18.998 13.5V9.483c0-2.829 0-4.243-.879-5.122c-.64-.64-1.567-.814-3.12-.861M11.997 22h-3c-2.828 0-4.243 0-5.121-.88c-.879-.878-.879-2.292-.879-5.12V9.482c0-2.829 0-4.243.879-5.122c.641-.64 1.568-.814 3.121-.861M13.998 20s1 0 2 2c0 0 2.176-5 5-6"></path>
              </g>
            </svg>

          </div>
          <div className='stat-content'>
            <p className='stat-label'>Attributions terminées</p>
            <p className='stat-value'>{attributions.filter(a => a.statut === 'terminée').length}</p>
          </div>
        </div>
      </div>

      <div className='attribution-content'>
        <div className='attribution-filters'>
          <h3>Filtrer par statut</h3>
          <div className='filter-buttons'>
            <button 
              className={`filter-btn ${filtreStatut === 'tous' ? 'active' : ''}`}
              onClick={() => setFiltreStatut('tous')}
            >
              Tous
            </button>
            <button 
              className={`filter-btn ${filtreStatut === 'active' ? 'active' : ''}`}
              onClick={() => setFiltreStatut('active')}
            >
              Actives
            </button>
            <button 
              className={`filter-btn ${filtreStatut === 'terminée' ? 'active' : ''}`}
              onClick={() => setFiltreStatut('terminée')}
            >
              Terminées
            </button>
          </div>
        </div>

        <div className='attribution-list'>
          <h3>Attributions ({attributionsFiltrées.length})</h3>
          {attributionsFiltrées.length > 0 ? (
            <div className='attribution-items'>
              {attributionsFiltrées.map(attribution => (
                <div
                  key={attribution.id}
                  className={`attribution-item ${attributionSelectionnee?.id === attribution.id ? 'active' : ''}`}
                  onClick={() => setAttributionSelectionnee(attribution)}
                >
                  <div className='attribution-item-content'>
                    <div className='attribution-patient'>
                      <p className='attribution-label'>Patient</p>
                      <p className='attribution-value'>{getDossierNom(attribution.dossierPatientId)}</p>
                    </div>
                    <div className='attribution-medecin'>
                      <p className='attribution-label'>Médecin</p>
                      <p className='attribution-value'>{getMedecinNom(attribution.medecinId)}</p>
                    </div>
                    <div className='attribution-niveau'>
                      <span className={`niveau-badge niveau-${attribution.niveau}`}>
                        {attribution.niveau}
                      </span>
                    </div>
                  </div>
                  <div className={`attribution-statut ${attribution.statut === 'active' ? 'actif' : 'termine'}`}>
                    {attribution.statut}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='empty-state'>
              <p>Aucune attribution trouvée</p>
            </div>
          )}
        </div>

        {attributionSelectionnee && (
          <div className='attribution-details'>
            <div className='details-header'>
              <h3>Détails de l'Attribution</h3>
              <button className='btn-secondary btn-small' onClick={() => setAttributionSelectionnee(null)}>×</button>
            </div>

            <div className='details-section'>
              <h4>Informations Principales</h4>
              <div className='details-grid'>
                <div className='detail-item'>
                  <label>Patient</label>
                  <p>{getDossierNom(attributionSelectionnee.dossierPatientId)}</p>
                </div>
                <div className='detail-item'>
                  <label>Médecin</label>
                  <p>{getMedecinNom(attributionSelectionnee.medecinId)}</p>
                </div>
                <div className='detail-item'>
                  <label>Niveau d'attribution</label>
                  <span className={`niveau-badge niveau-${attributionSelectionnee.niveau}`}>
                    {attributionSelectionnee.niveau}
                  </span>
                </div>
                <div className='detail-item'>
                  <label>Statut</label>
                  <span className={`statut-badge ${attributionSelectionnee.statut === 'active' ? 'statut-vert' : 'statut-gris'}`}>
                    {attributionSelectionnee.statut}
                  </span>
                </div>
              </div>
            </div>

            <div className='details-section'>
              <h4>Statut Temporel</h4>
              <div className='details-grid'>
                <div className='detail-item'>
                  <label>Date d'attribution</label>
                  <p>{new Date(attributionSelectionnee.dateAttribution).toLocaleDateString('fr-FR')}</p>
                </div>
                {attributionSelectionnee.dateDesattribution && (
                  <div className='detail-item'>
                    <label>Date de désattribution</label>
                    <p>{new Date(attributionSelectionnee.dateDesattribution).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className='details-section'>
              <h4>Raison de l'Attribution</h4>
              <p className='raison-content'>{attributionSelectionnee.raison}</p>
            </div>

            <div className='details-actions'>
              {attributionSelectionnee.statut === 'active' && (
                <button 
                  className='btn-danger' 
                  onClick={handleRetirerAttribution}
                >
                  Retirer l'attribution
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='medecins-overview'>
        <h3>Charge de Travail des Médecins</h3>
        <div className='medecins-grid'>
          {medecins.map(medecin => {
            const charge = getAttributionsParMedecin(medecin.id)
            const pourcentageFill = Math.min((charge / 5) * 100, 100)
            return (
              <div key={medecin.id} className='medecin-card'>
                <div className='medecin-header'>
                  <div className='medecin-info'>
                    <p className='medecin-nom'>{medecin.nom} {medecin.prenom}</p>
                    <p className='medecin-specialite'>{medecin.specialite}</p>
                  </div>
                  <div className={`medecin-status ${medecin.disponibilite ? 'disponible' : 'occupe'}`}>
                    {medecin.disponibilite ? 'Disponible' : 'Occupé'}
                  </div>
                </div>
                <div className='charge-wrapper'>
                  <div className='charge-bar'>
                    <div 
                      className='charge-fill'
                      style={{ width: `${pourcentageFill}%` }}
                    ></div>
                  </div>
                  <p className='charge-label'>{charge} patient(s) assigné(s)</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {afficherModal && (
        <div className='modal-overlay' onClick={() => setAfficherModal(false)}>
          <div className='modal-content attribution-modal' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>Attribuer un médecin à un dossier</h3>
              <button className='btn-close' onClick={() => setAfficherModal(false)}>×</button>
            </div>

            <div className='modal-body'>
              <form>
                <div className='form-group'>
                  <label>Patient (Dossier)</label>
                  <select
                    value={formData.dossierPatientId}
                    onChange={(e) => setFormData({ ...formData, dossierPatientId: e.target.value })}
                  >
                    <option value="">Sélectionner un patient</option>
                    {dossiers.map(dossier => (
                      <option key={dossier.id} value={dossier.id}>
                        {dossier.nomPatient}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>Médecin</label>
                  <select
                    value={formData.medecinId}
                    onChange={(e) => setFormData({ ...formData, medecinId: e.target.value })}
                  >
                    <option value="">Sélectionner un médecin</option>
                    {medecins.map(medecin => (
                      <option key={medecin.id} value={medecin.id}>
                        Dr. {medecin.nom} {medecin.prenom} - {medecin.specialite}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>Niveau d'attribution</label>
                  <div className='radio-group'>
                    <label className='radio-label'>
                      <input
                        type="radio"
                        name="niveau"
                        value="principal"
                        checked={formData.niveau === 'principal'}
                        onChange={() => setFormData({ ...formData, niveau: 'principal' })}
                      />
                      Principal
                    </label>
                    <label className='radio-label'>
                      <input
                        type="radio"
                        name="niveau"
                        value="secondaire"
                        checked={formData.niveau === 'secondaire'}
                        onChange={() => setFormData({ ...formData, niveau: 'secondaire' })}
                      />
                      Secondaire
                    </label>
                  </div>
                </div>

                <div className='form-group'>
                  <label>Raison de l'attribution</label>
                  <textarea
                    value={formData.raison}
                    onChange={(e) => setFormData({ ...formData, raison: e.target.value })}
                    placeholder="Expliquez pourquoi ce médecin est attribué"
                    rows={4}
                  ></textarea>
                </div>
              </form>
            </div>

            <div className='modal-footer'>
              <button className='btn-secondary' onClick={() => setAfficherModal(false)}>Annuler</button>
              <button className='btn-primary'>Attribuer</button>
            </div>
          </div>
        </div>
      )}
      {afficherModal && (
        <div className='modal-overlay' onClick={() => setAfficherModal(false)}>
          <div className='modal-content attribution-modal' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>Nouvelle attribution</h3>
              <button className='btn-close' onClick={() => setAfficherModal(false)}>×</button>
            </div>

            <div className='modal-body'>
              <form id='attribution-form' onSubmit={handleSubmitAttribution}>
                <div className='form-group'>
                  <label>Patient / Dossier</label>
                  <select value={formData.dossierPatientId} onChange={(e) => setFormData({ ...formData, dossierPatientId: e.target.value })}>
                    <option value=''>-- Choisir --</option>
                    {dossiers.map(d => (
                      <option key={d.id} value={d.id}>{d.nomPatient}</option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>Médecin</label>
                  <select value={formData.medecinId} onChange={(e) => setFormData({ ...formData, medecinId: e.target.value })}>
                    <option value=''>-- Choisir --</option>
                    {(availableMedecins.length > 0 ? availableMedecins : medecins).map(medecin => (
                      <option key={medecin.id} value={medecin.id}>{medecin.nom} {medecin.prenom} — {medecin.specialite} {medecin.disponibilite ? '(disponible)' : '(occupé)'}</option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>Niveau</label>
                  <select value={formData.niveau} onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}>
                    <option value='principal'>principal</option>
                    <option value='secondaire'>secondaire</option>
                  </select>
                </div>

                <div className='form-group'>
                  <label>Raison</label>
                  <input type='text' value={formData.raison} onChange={(e) => setFormData({ ...formData, raison: e.target.value })} />
                </div>
              </form>
            </div>

            <div className='modal-footer'>
              <button className='btn-secondary' onClick={() => setAfficherModal(false)}>Annuler</button>
              <button className='btn-primary' type='submit' form='attribution-form'>Attribuer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
