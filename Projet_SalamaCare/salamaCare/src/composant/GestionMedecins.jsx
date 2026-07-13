import { useState } from 'react'
import './CSS_UI/responsable.css'

const specialites = ['Généraliste', 'Cardiologue', 'Pédiatre', 'Dermatologue', 'Gynécologue', 'Orthopédiste']

export default function GestionMedecins({ medecins = [], onAjouterMedecin = () => {} }) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    specialite: 'Généraliste',
    email: '',
    telephone: '',
    disponibilite: true,
    password: 'medecin123'
  })
  const [feedback, setFeedback] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const newDoctor = {
      id: `m${Date.now()}`,
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      specialite: formData.specialite.trim() || 'Généraliste',
      email: formData.email.trim() || `${formData.prenom.trim().toLowerCase()}.${formData.nom.trim().toLowerCase()}@salamacare.test`,
      telephone: formData.telephone.trim(),
      disponibilite: formData.disponibilite,
      password: formData.password || 'medecin123',
      horaires: ['08:00-12:00', '14:00-18:00'],
      photoIdentite: '/src/assets/images/medecin.jpg'
    }

    onAjouterMedecin(newDoctor)
    setFeedback(`Médecin ajouté : ${newDoctor.prenom} ${newDoctor.nom}`)
    setFormData({
      nom: '',
      prenom: '',
      specialite: 'Généraliste',
      email: '',
      telephone: '',
      disponibilite: true,
      password: 'medecin123'
    })
  }

  const medecinsDisponibles = medecins.filter((medecin) => medecin.disponibilite).length

  return (
    <div className='gestion-medecins-container'>
      <div className='gestion-medecins-hero'>
        <div>
          <h2>Gestion des médecins</h2>
          <p>Ajoutez de nouveaux praticiens et gardez une vue claire sur l’équipe médicale disponible.</p>
        </div>
        <div className='gestion-medecins-summary'>
          <div className='gestion-medecins-summary-card'>
            <span className='summary-label'>Médecins</span>
            <strong>{medecins.length}</strong>
          </div>
          <div className='gestion-medecins-summary-card'>
            <span className='summary-label'>Disponibles</span>
            <strong>{medecinsDisponibles}</strong>
          </div>
        </div>
      </div>

      <div className='gestion-medecins-grid'>
        <form onSubmit={handleSubmit} className='gestion-medecins-form-card'>
          <div className='gestion-medecins-card-title'>Ajouter un médecin</div>
          <div className='gestion-medecins-form-grid'>
            <label className='gestion-medecins-field'>
              <span>Nom</span>
              <input value={formData.nom} onChange={(event) => setFormData({ ...formData, nom: event.target.value })} required />
            </label>
            <label className='gestion-medecins-field'>
              <span>Prénom</span>
              <input value={formData.prenom} onChange={(event) => setFormData({ ...formData, prenom: event.target.value })} required />
            </label>
          </div>

          <div className='gestion-medecins-form-grid'>
            <label className='gestion-medecins-field'>
              <span>Spécialité</span>
              <select value={formData.specialite} onChange={(event) => setFormData({ ...formData, specialite: event.target.value })}>
                {specialites.map((specialite) => (
                  <option key={specialite} value={specialite}>{specialite}</option>
                ))}
              </select>
            </label>
            <label className='gestion-medecins-field'>
              <span>Téléphone</span>
              <input value={formData.telephone} onChange={(event) => setFormData({ ...formData, telephone: event.target.value })} />
            </label>
          </div>

          <label className='gestion-medecins-field'>
            <span>Email</span>
            <input type='email' value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} />
          </label>

          <label className='gestion-medecins-field'>
            <span>Mot de passe initial</span>
            <input type='password' value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} />
          </label>

          <label className='gestion-medecins-toggle'>
            <input type='checkbox' checked={formData.disponibilite} onChange={(event) => setFormData({ ...formData, disponibilite: event.target.checked })} />
            <span>Disponible pour les consultations</span>
          </label>

          {feedback && <div className='gestion-medecins-feedback'>{feedback}</div>}

          <button type='submit' className='btn-primary'>
            Ajouter le médecin
          </button>
        </form>

        <div className='gestion-medecins-list-card'>
          <div className='gestion-medecins-card-title'>Équipe médicale</div>
          <div className='gestion-medecins-list'>
            {medecins.length > 0 ? medecins.map((medecin) => (
              <div key={medecin.id} className='gestion-medecin-item'>
                <div className='gestion-medecin-profile'>
                  <div className='gestion-medecin-avatar'>
                    {medecin.prenom?.charAt(0)}{medecin.nom?.charAt(0)}
                  </div>
                  <div className='gestion-medecin-meta'>
                    <div className='gestion-medecin-name'>{medecin.prenom} {medecin.nom}</div>
                    <div className='gestion-medecin-speciality'>{medecin.specialite}</div>
                    <div className='gestion-medecin-contact'>{medecin.email}</div>
                  </div>
                </div>
                <span className={`gestion-medecin-status ${medecin.disponibilite ? 'available' : 'unavailable'}`}>
                  {medecin.disponibilite ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
            )) : <div className='gestion-medecins-empty'>Aucun médecin enregistré pour l’instant.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
