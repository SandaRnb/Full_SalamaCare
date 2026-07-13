import { useState } from 'react'
import './CSS_UI/gestion-dossier.css'

export default function GestionDossier({ dossiers = [], rendezVous = [], medecins = [], onAjouterDossier = () => {}, onModifierDossier = () => {}, searchQuery = '' }) {
  const [dossierSelectionne, setDossierSelectionne] = useState(null)
  const [afficherModal, setAfficherModal] = useState(false)
  const [typeModal, setTypeModal] = useState('nouveau')
  const [formData, setFormData] = useState({
    nomPatient: '',
    dateNaissance: '',
    email: '',
    telephone: '',
    adresse: '',
    groupeSanguin: '',
    antecedents: '',
    allergies: '',
    password: '',
    dateCreation: '',
  })

  const handleAjouterDossier = () => {
    setTypeModal('nouveau')
    setFormData({
      nomPatient: '',
      dateNaissance: '',
      email: '',
      telephone: '',
      adresse: '',
      groupeSanguin: '',
      antecedents: '',
      allergies: '',
      dateCreation: new Date().toISOString().split('T')[0],
    })
    setAfficherModal(true)
  }

  const handleAjouterDocument = () => {
    if (dossierSelectionne) {
      setTypeModal('document')
      setAfficherModal(true)
    }
  }

  const handleModifierDossier = () => {
    if (dossierSelectionne) {
      setTypeModal('edit')
      setFormData({
        nomPatient: dossierSelectionne.nomPatient || '',
        dateNaissance: dossierSelectionne.dateNaissance || '',
        email: dossierSelectionne.email || '',
        telephone: dossierSelectionne.telephone || '',
        adresse: dossierSelectionne.adresse || '',
        groupeSanguin: dossierSelectionne.groupeSanguin || '',
        antecedents: dossierSelectionne.antecedents || '',
        allergies: Array.isArray(dossierSelectionne.allergies) ? dossierSelectionne.allergies.join(', ') : '',
        password: dossierSelectionne.password || '',
        dateCreation: dossierSelectionne.dateCreation || new Date().toISOString().split('T')[0],
      })
      setAfficherModal(true)
    }
  }

  const getMedecinNom = (medecin) => {
    return medecin ? `${medecin.nom} ${medecin.prenom}` : 'Aucun médecin assigné'
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const getSelectedRendezVous = () => {
    if (!dossierSelectionne) return []
    return rendezVous.filter(rdv => rdv.patientId === dossierSelectionne.patientId)
  }

  const filteredDossiers = searchQuery
    ? dossiers.filter(d => (d.nomPatient || '').toLowerCase().includes(searchQuery.toLowerCase()) || (d.patientId || '').toLowerCase().includes(searchQuery.toLowerCase()))
    : dossiers

  const handleCreateFromSearch = () => {
    setTypeModal('nouveau')
    setFormData({
      nomPatient: searchQuery,
      dateNaissance: '',
      email: '',
      telephone: '',
      adresse: '',
      groupeSanguin: '',
      antecedents: '',
      allergies: '',
      password: '',
      dateCreation: new Date().toISOString().split('T')[0],
    })
    setAfficherModal(true)
  }

  const handleSubmitDossier = (event) => {
    event.preventDefault()

    if (typeModal === 'edit' && dossierSelectionne) {
      const updatedDossier = {
        ...dossierSelectionne,
        nomPatient: formData.nomPatient || dossierSelectionne.nomPatient,
        dateNaissance: formData.dateNaissance,
        email: formData.email,
        password: formData.password,
        telephone: formData.telephone,
        adresse: formData.adresse,
        groupeSanguin: formData.groupeSanguin,
        antecedents: formData.antecedents,
        allergies: formData.allergies.split(',').map(item => item.trim()).filter(Boolean),
        dateCreation: formData.dateCreation || dossierSelectionne.dateCreation,
        dateModification: new Date().toISOString().split('T')[0],
        historique: [
          ...(dossierSelectionne.historique || []),
          {
            id: `h${Date.now()}`,
            action: 'Modification du dossier',
            dateAction: new Date().toISOString(),
            utilisateur: 'Responsable',
            details: `Dossier mis à jour pour ${formData.nomPatient || dossierSelectionne.nomPatient}`
          }
        ]
      }

      onModifierDossier(updatedDossier)
      setDossierSelectionne(updatedDossier)
      setAfficherModal(false)
      return
    }

    const newDossier = {
      id: `d${Date.now()}`,
      patientId: `p${Date.now()}`,
      nomPatient: formData.nomPatient || 'Nouveau patient',
      dateNaissance: formData.dateNaissance,
      email: formData.email,
      password: formData.password,
      telephone: formData.telephone,
      adresse: formData.adresse,
      groupeSanguin: formData.groupeSanguin,
      antecedents: formData.antecedents,
      allergies: formData.allergies.split(',').map(item => item.trim()).filter(Boolean),
      dateCreation: formData.dateCreation || new Date().toISOString().split('T')[0],
      dateModification: new Date().toISOString().split('T')[0],
      statut: 'actif',
      documents: [],
      medecin: null,
      historique: [
        {
          id: `h${Date.now()}`,
          action: 'Création du dossier',
          dateAction: new Date().toISOString(),
          utilisateur: 'Responsable',
          details: `Dossier créé pour le patient ${formData.nomPatient}`
        }
      ]
    }

    onAjouterDossier(newDossier)
    setDossierSelectionne(newDossier)
    setAfficherModal(false)
  }

  return (
    <div className='gestion-dossier-container'>
      <div className='gestion-dossier-header'>
        <h2>Gestion des Dossiers Patients</h2>
        <button className='btn-primary' onClick={handleAjouterDossier}>
          <iconify-icon icon="material-symbols:post-add"></iconify-icon>
          Nouveau Dossier
        </button>
      </div>

      <div className='dossier-content'>
        <div className='dossier-list'>
          <h3>Liste des Dossiers</h3>
          {filteredDossiers.length > 0 ? (
            <ul className='dossier-ul'>
              {filteredDossiers.map(dossier => (
                <li
                  key={dossier.id}
                  className={`dossier-item ${dossierSelectionne?.id === dossier.id ? 'active' : ''}`}
                  onClick={() => setDossierSelectionne(dossier)}
                >
                  <div className='dossier-item-header'>
                    <span className='dossier-nom'>{dossier.nomPatient}</span>
                    <span className={`dossier-statut statut-${dossier.statut}`}>{dossier.statut}</span>
                  </div>
                  <p className='dossier-date'>{new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className='empty-state'>
              <p>Aucun dossier patient pour le moment</p>
              {searchQuery && (
                <div className='quick-create'>
                  <p>Créer un dossier pour « {searchQuery} »</p>
                  <button className='btn-primary btn-small' onClick={handleCreateFromSearch}>Créer rapidement</button>
                </div>
              )}
            </div>
          )}
        </div>

        {dossierSelectionne && (
          <div className='dossier-details'>
            <div className='details-header'>
              <h3>{dossierSelectionne.nomPatient}</h3>
              <div className='section-actions'>
                <button className='btn-secondary btn-small' onClick={handleModifierDossier}>Modifier le dossier</button>
                <span className={`statut-badge statut-${dossierSelectionne.statut}`}>
                  {dossierSelectionne.statut}
                </span>
              </div>
            </div>

            <div className='details-section'>
              <h4>Informations Complètes</h4>
              <div className='info-grid'>
                <div className='info-item'>
                  <label>Date de Naissance</label>
                  <p>{formatDate(dossierSelectionne.dateNaissance)}</p>
                </div>
                <div className='info-item'>
                  <label>Email</label>
                  <p>{dossierSelectionne.email || '-'}</p>
                </div>
                <div className='info-item'>
                  <label>Mot de passe patient</label>
                  <p>{dossierSelectionne.password || '-'}</p>
                </div>
                <div className='info-item'>
                  <label>Téléphone</label>
                  <p>{dossierSelectionne.telephone || '-'}</p>
                </div>
                <div className='info-item'>
                  <label>Adresse</label>
                  <p>{dossierSelectionne.adresse || '-'}</p>
                </div>
                <div className='info-item'>
                  <label>Groupe sanguin</label>
                  <p>{dossierSelectionne.groupeSanguin || '-'}</p>
                </div>
                <div className='info-item'>
                  <label>Antécédents</label>
                  <p>{dossierSelectionne.antecedents || 'Aucun'}</p>
                </div>
                <div className='info-item'>
                  <label>Allergies</label>
                  <p>{dossierSelectionne.allergies?.length > 0 ? dossierSelectionne.allergies.join(', ') : 'Aucune'}</p>
                </div>
                <div className='info-item'>
                  <label>Médecin responsable</label>
                  <p>{getMedecinNom(dossierSelectionne.medecin)}</p>
                </div>
              </div>
            </div>

            <div className='details-section'>
              <h4>Dates de gestion</h4>
              <div className='info-grid'>
                <div className='info-item'>
                  <label>Date de Création</label>
                  <p>{formatDate(dossierSelectionne.dateCreation)}</p>
                </div>
                <div className='info-item'>
                  <label>Dernière Modification</label>
                  <p>{formatDate(dossierSelectionne.dateModification)}</p>
                </div>
              </div>
            </div>

            <div className='details-section'>
              <div className='section-header'>
                <h4>Documents Médicaux</h4>
                <button className='btn-secondary btn-small' onClick={handleAjouterDocument}>
                  Ajouter un document
                </button>
              </div>

              {dossierSelectionne.documents.length > 0 ? (
                <div className='documents-list'>
                  {dossierSelectionne.documents.map(doc => (
                    <div key={doc.id} className='document-item'>
                      <div className='document-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 13h-4v2H9v-2H5v-2h4v-2h2v2h4z"/>
                        </svg>
                      </div>
                      <div className='document-info'>
                        <p className='document-nom'>{doc.nom}</p>
                        <p className='document-type'>{doc.type} • {new Date(doc.dateUpload).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className='document-size'>{(doc.taille / 1024).toFixed(2)} KB</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='empty-state small'>
                  <p>Aucun document importé</p>
                </div>
              )}
            </div>

            <div className='details-section'>
              <h4>Rendez-vous associés</h4>
              {getSelectedRendezVous().length > 0 ? (
                <div className='documents-list'>
                  {getSelectedRendezVous().map(rdv => {
                    const medecin = medecins.find(m => m.id === rdv.medecinId)
                    return (
                      <div key={rdv.id} className='document-item'>
                        <div className='document-icon'>
                          <svg xmlns='http://www.w3.org/2000/svg' width='1.5em' height='1.5em' viewBox='0 0 24 24'>
                            <path fill='currentColor' d='M7 8h10v2H7V8m0 4h7v2H7v-2m0 4h3v2H7v-2M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m0 2v2h14V6H5Z'/>
                          </svg>
                        </div>
                        <div className='document-info'>
                          <p className='document-nom'>{new Date(rdv.dateHeure).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                          <p className='document-type'>{rdv.motif} • {rdv.lieu}</p>
                        </div>
                        <div className='document-size'>{medecin ? `${medecin.nom} ${medecin.prenom}` : 'Médecin non attribué'}</div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className='empty-state small'>
                  <p>Aucun rendez-vous enregistré</p>
                </div>
              )}
            </div>

            <div className='details-section'>
              <h4>Historique</h4>
              {dossierSelectionne.historique.length > 0 ? (
                <div className='historique-list'>
                  {dossierSelectionne.historique.slice(-5).map(item => (
                    <div key={item.id} className='historique-item'>
                      <div className='historique-date'>{new Date(item.dateAction).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      <div className='historique-content'>
                        <p className='historique-action'>{item.action}</p>
                        <p className='historique-details'>{item.details}</p>
                        <p className='historique-user'>Par: {item.utilisateur}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='empty-state small'>
                  <p>Aucun historique</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {afficherModal && (
        <div className='modal-overlay' onClick={() => setAfficherModal(false)}>
          <div className='modal-content gestion-dossier-modal' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>{typeModal === 'nouveau' ? 'Créer un nouveau dossier' : typeModal === 'edit' ? 'Modifier le dossier' : 'Ajouter un document'}</h3>
              <button className='btn-close' onClick={() => setAfficherModal(false)}>×</button>
            </div>

            <div className='modal-body'>
              {typeModal === 'nouveau' || typeModal === 'edit' ? (
                <form id='nouveau-dossier-form' onSubmit={handleSubmitDossier}>
                  <div className='form-group'>
                    <label>Nom du Patient</label>
                    <input
                      type="text"
                      value={formData.nomPatient}
                      onChange={(e) => setFormData({ ...formData, nomPatient: e.target.value })}
                      placeholder="Entrez le nom du patient"
                    />
                  </div>
                  <div className='form-group'>
                    <label>Date de Naissance</label>
                    <input
                      type="date"
                      value={formData.dateNaissance}
                      onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Email du patient</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="exemple@domaine.com"
                    />
                  </div>
                  <div className='form-group'>
                    <label>Mot de passe du patient</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Choisir un mot de passe"
                    />
                  </div>
                  <div className='form-group'>
                    <label>Téléphone</label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      placeholder="06XXXXXXXX"
                    />
                  </div>
                  <div className='form-group'>
                    <label>Adresse</label>
                    <input
                      type="text"
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                      placeholder="Adresse du patient"
                    />
                  </div>
                  <div className='form-group'>
                    <label>Groupe sanguin</label>
                    <input
                      type="text"
                      value={formData.groupeSanguin}
                      onChange={(e) => setFormData({ ...formData, groupeSanguin: e.target.value })}
                      placeholder="Ex: O+"
                    />
                  </div>
                  <div className='form-group'>
                    <label>Antécédents</label>
                    <textarea
                      rows={3}
                      value={formData.antecedents}
                      onChange={(e) => setFormData({ ...formData, antecedents: e.target.value })}
                      placeholder="Ex: Asthme, hypertension"
                    />
                  </div>
                  <div className='form-group'>
                    <label>Allergies</label>
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="Séparez par des virgules"
                    />
                  </div>
                  <div className='form-group'>
                    <label>Date de Création</label>
                    <input
                      type="date"
                      value={formData.dateCreation}
                      onChange={(e) => setFormData({ ...formData, dateCreation: e.target.value })}
                    />
                  </div>
                </form>
              ) : (
                <form>
                  <div className='form-group'>
                    <label>Nom du Document</label>
                    <input type="text" placeholder="Ex: Ordonnance, Bilan sanguin" />
                  </div>
                  <div className='form-group'>
                    <label>Type de Document</label>
                    <select>
                      <option>Ordonnance</option>
                      <option>Bilan</option>
                      <option>Diagnostic</option>
                      <option>Rapport</option>
                    </select>
                  </div>
                  <div className='form-group'>
                    <label>Importer le fichier</label>
                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" />
                  </div>
                </form>
              )}
            </div>

            <div className='modal-footer'>
              <button className='btn-secondary' onClick={() => setAfficherModal(false)}>Annuler</button>
              <button className='btn-primary' type={typeModal === 'nouveau' ? 'submit' : 'button'} form={typeModal === 'nouveau' ? 'nouveau-dossier-form' : undefined}>
                {typeModal === 'nouveau' ? 'Créer le dossier' : typeModal === 'edit' ? 'Enregistrer les modifications' : 'Importer le document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
