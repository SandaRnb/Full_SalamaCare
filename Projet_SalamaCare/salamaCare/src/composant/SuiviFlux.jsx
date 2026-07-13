import { useMemo, useState } from 'react'
import './CSS_UI/suivi-flux.css'

export default function SuiviFlux({
  fileAttente = [],
  onAppelerPatient = () => {},
  onChangerPriorite = () => {},
  onConfirmerConsultation = () => {},
  onTerminerPatient = () => {}
}) {
  const [patientSelectionne, setPatientSelectionne] = useState(null)

  //const etapes = ['accueil', 'consultation', 'traitement', 'suivi', 'sortie']

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'urgente': return 'priorite-rouge'
      case 'haute': return 'priorite-orange'
      case 'normale': return 'priorite-bleu'
      case 'basse': return 'priorite-vert'
      default: return ''
    }
  }

  const IconAcceuil = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.5 19.5h19M12 7.714V4.5m0 3.214H9.889c-2.915 0-5.278 2.399-5.278 5.357v3.215H19.39V13.07c0-2.958-2.363-5.357-5.278-5.357zM12 4.5H9.889M12 4.5h2.111"></path>
</svg>
const IconConsultation =<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
	<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M20.5 14.833c-10.095 2.705-7.748 10.47 1.59 18.718c1.461 1.34 1.91 1.965 1.91 3.74V45.5c10.257 0 19.086-7.246 21.087-17.306S41.704 8.06 32.228 4.136s-20.406-.61-26.104 7.918A21.5 21.5 0 0 0 7.903 38.25"></path>
	<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M27.5 14.833c10.095 2.705 7.748 10.471-1.59 18.718"></path>
	<circle cx={10.216} cy={41.5} r={4} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></circle>
</svg>

const IconTtraitement = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<g fill="none" stroke="currentColor" strokeWidth={1.5}>
		<path d="M8 7.839c0-2.092 1.896-4.16 3.226-5.353a1.91 1.91 0 0 1 2.548 0C15.104 3.68 17 5.746 17 7.84C17 9.89 15.296 12 12.5 12S8 9.89 8 7.839Z"></path>
		<path strokeLinecap="round" strokeLinejoin="round" d="M4 14h2.395c.294 0 .584.066.847.194l2.042.988c.263.127.553.193.848.193h1.042c1.008 0 1.826.791 1.826 1.767c0 .04-.027.074-.066.085l-2.541.703a1.95 1.95 0 0 1-1.368-.124L6.842 16.75"></path>
		<path strokeLinecap="round" strokeLinejoin="round" d="m13 16.5l4.593-1.411a1.985 1.985 0 0 1 2.204.753c.369.51.219 1.242-.319 1.552l-7.515 4.337a2 2 0 0 1-1.568.187L4 20.02"></path>
	</g>
</svg>

const IconSuivi = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048">
	<path fill="currentColor" d="M256 0h1536v2048H256zm1408 1920V128H384v1792zM1536 512v128h-512V512zm0 512v128h-512v-128zm0 512v128h-512v-128zM941 429L704 666L531 493l90-90l83 83l147-147zm0 512l-237 237l-173-173l90-90l83 83l147-147zm0 512l-237 237l-173-173l90-90l83 83l147-147z"></path>
</svg>

const IconSortie =<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12h7m0 0l-3 3m3-3l-3-3m3-3V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"></path>
</svg>

const IconTempsAttente= <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
<g fill="none" stroke="currentColor" strokeWidth={1.5}>
  <circle cx={12} cy={12} r={10}></circle>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9.5L13 13m3-5l-5 5"></path>
</g>
</svg>
const IconEnAttente = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
<path fill="currentColor" d="M16 14h1.5v2.82l2.44 1.41l-.75 1.3L16 17.69zm1-2a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m0-2a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-2.79 0-5.2-1.64-6.33-4H1v-3c0-2.66 5.33-4 8-4c.6 0 1.34.07 2.12.2A6.99 6.99 0 0 1 17 10m-7 7c0-.7.1-1.38.29-2c-.42-.07-.86-.1-1.29-.1c-2.97 0-6.1 1.46-6.1 2.1v1.1h7.19A7 7 0 0 1 10 17M9 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 1.9A2.1 2.1 0 0 0 6.9 8A2.1 2.1 0 0 0 9 10.1A2.1 2.1 0 0 0 11.1 8A2.1 2.1 0 0 0 9 5.9"></path>
</svg>



const IconEnCours = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
<g fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}>
  <path d="M24 4V8"></path>
  <path d="M34 6.6795L32 10.1436"></path>
  <path d="M41.3203 14L37.8562 16"></path>
  <path d="M44 24H40"></path>
  <path d="M41.3203 34L37.8562 32"></path>
  <path d="M34 41.3205L32 37.8564"></path>
  <path d="M24 44V40"></path>
  <path d="M14 41.3205L16 37.8564"></path>
  <path d="M6.67969 34L10.1438 32"></path>
  <path d="M4 24H8"></path>
  <path d="M6.67969 14L10.1438 16"></path>
  <path d="M14 6.6795L16 10.1436"></path>
</g>
</svg>

const IconAppele = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 28 28">
	<path fill="currentColor" d="M26 7.353a2.75 2.75 0 0 0-3.458-2.657L4.045 9.629a2.75 2.75 0 0 0-2.041 2.657v3.427a2.75 2.75 0 0 0 2.041 2.657L7 19.158v.342a4.5 4.5 0 0 0 8.56 1.942l6.982 1.862A2.75 2.75 0 0 0 26 20.647zm-3.072-1.208A1.25 1.25 0 0 1 24.5 7.353v13.294a1.25 1.25 0 0 1-1.572 1.207L4.432 16.921a1.25 1.25 0 0 1-.928-1.208v-3.427c0-.566.38-1.062.928-1.207zm-8.856 14.9A3 3 0 0 1 8.5 19.559z"></path>
</svg>

  

  const patientsTries = useMemo(() => {
    const prioriteOrder = { urgente: 0, haute: 1, normale: 2, basse: 3 }
    return [...fileAttente].sort((a, b) => {
      if (a.statut === 'en_cours' && b.statut !== 'en_cours') return -1
      if (a.statut !== 'en_cours' && b.statut === 'en_cours') return 1
      return (prioriteOrder[a.priorite] ?? 4) - (prioriteOrder[b.priorite] ?? 4)
    })
  }, [fileAttente])

  const getFileAttenteMoyenne = () => {
    if (fileAttente.length === 0) return 0
    const total = fileAttente.reduce((acc, patient) => acc + patient.tempsAttente, 0)
    return Math.round(total / fileAttente.length)
  }

  const getFileAttenteMax = () => {
    if (fileAttente.length === 0) return 0
    return Math.max(...fileAttente.map(p => p.tempsAttente))
  }

  const patientsEnAttente = fileAttente.filter(p => p.statut === 'en_attente')
  const patientsEnCours = fileAttente.filter(p => p.statut === 'en_cours' || p.statut === 'appele')

  return (
    <div className='suivi-flux-container'>
      <div className='suivi-header'>
        <h2>Suivi du Flux des Patients</h2>
        
      </div>

      <div className='suivi-stats'>
        <div className='stat-card'>
          <div className='stat-icon'>
           {IconTempsAttente}
          </div>
          <div className='stat-content'>
            <p className='stat-label'>Temps d'attente moyen</p>
            <p className='stat-value'>{getFileAttenteMoyenne()} min</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
              <path fill="currentColor" d="m17.62 27.89l.26 1.99c-.62.08-1.26.12-1.88.12c-7.72 0-14-6.28-14-14S8.28 2 16 2c.63 0 1.26.04 1.88.12l-.27 1.99C17.08 4.04 16.54 4 16 4C9.38 4 4 9.38 4 16s5.38 12 12 12c.54 0 1.08-.04 1.62-.11m6.93-.804l-1.222-1.584c-.83.642-1.738 1.17-2.7 1.572l.774 1.846c1.12-.47 2.18-1.087 3.149-1.834Zm4.39-5.737l-1.847-.764a12 12 0 0 1-1.56 2.704l1.588 1.217a14 14 0 0 0 1.82-3.157M30 16c0-.605-.04-1.215-.116-1.814l-1.985.257c.068.514.101 1.037.101 1.557c0 .525-.034 1.053-.1 1.568l1.982.258c.078-.6.118-1.215.118-1.826m-1.054-5.338a14 14 0 0 0-1.817-3.158l-1.59 1.215a12 12 0 0 1 1.56 2.707zM24.56 4.921a14 14 0 0 0-3.146-1.836L20.64 4.93c.963.405 1.87.934 2.698 1.574zm-2.558 15.667L17 15.586V7h-2v9.414l5.588 5.588z"></path>
            </svg>
          </div>
          <div className='stat-content'>
            <p className='stat-label'>Max temps d'attente</p>
            <p className='stat-value'>{getFileAttenteMax()} min</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>
              {IconEnAttente}
          </div>
          <div className='stat-content'>
            <p className='stat-label'>En attente</p>
            <p className='stat-value'>{patientsEnAttente.length}</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon'>
              {IconEnCours}
          </div>
          <div className='stat-content'>
            <p className='stat-label'>En cours</p>
            <p className='stat-value'>{patientsEnCours.length}</p>
          </div>
        </div>
      </div>

      <div className='suivi-content'>
        <div className='file-attente-section'>
          <h3>File d'Attente Actuelle</h3>
          <div className='file-attente-container'>
            {patientsTries.length > 0 ? (
              <div className='file-attente-list'>
                {patientsTries.map((patient, index) => (
                    <div
                      key={patient.id}
                      className={`file-item ${patient.statut === 'en_cours' ? 'en-cours' : ''} ${patientSelectionne?.id === patient.id ? 'active' : ''}`}
                      onClick={() => setPatientSelectionne(patient)}
                    >
                      <div className='file-position'>
                        <span className='position-number'>{index + 1}</span>
                      </div>
                      <div className='file-patient-info'>
                        <p className='file-nom'>{patient.nomPatient}</p>
                        <div className='file-meta'>
                          <span className='file-heure'>
                            Arrivée: {new Date(patient.heureArrivee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className='file-temps'>
                            {patient.tempsAttente} min
                          </span>
                        </div>
                      </div>
                      <div className={`file-priorite ${getPrioriteColor(patient.priorite)}`}>
                        <span className='priorite-label'>{patient.priorite}</span>
                      </div>
                      <div className={`file-status ${patient.statut === 'en_cours' ? 'en-cours' : patient.statut === 'en_attente' ? 'attente' : 'appele'}`}>
                        {patient.statut === 'en_attente' && IconEnAttente}
                        {patient.statut === 'appele' && IconAppele }
                        {patient.statut === 'en_cours' && IconEnCours}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className='empty-state'>
                <p>Aucun patient en attente</p>
              </div>
            )}
          </div>
        </div>

        {patientSelectionne && (
          <div className='patient-flux-details'>
            <div className='details-header'>
              <h3>{patientSelectionne.nomPatient}</h3>
              <button className='btn-secondary btn-small' onClick={() => setPatientSelectionne(null)}>×</button>
            </div>

            <div className='details-section'>
              <h4>Informations de L'attente</h4>
              <div className='details-grid'>
                <div className='detail-item'>
                  <label>Heure d'arrivée</label>
                  <p>{new Date(patientSelectionne.heureArrivee).toLocaleTimeString('fr-FR')}</p>
                </div>
                <div className='detail-item'>
                  <label>Temps d'attente</label>
                  <p>{patientSelectionne.tempsAttente} minutes</p>
                </div>
                <div className='detail-item'>
                  <label>Priorité</label>
                  <span className={`priorite-badge ${getPrioriteColor(patientSelectionne.priorite)}`}>
                    {patientSelectionne.priorite}
                  </span>
                </div>
                <div className='detail-item'>
                  <label>Statut</label>
                  <span className={`statut-badge ${patientSelectionne.statut === 'en_attente' ? 'statut-orange' : patientSelectionne.statut === 'appele' ? 'statut-bleu' : 'statut-vert'}`}>
                    {patientSelectionne.statut}
                  </span>
                </div>
              </div>
            </div>

            <div className='details-section'>
              <h4>Actions</h4>
              <div className='actions-buttons'>
                {patientSelectionne.statut === 'en_attente' && (
                  <>
                    <button className='btn-secondary' onClick={() => onAppelerPatient(patientSelectionne.id)}>Appeler le patient</button>
                    <button className='btn-secondary' onClick={() => onChangerPriorite(patientSelectionne.id, patientSelectionne.priorite === 'urgente' ? 'haute' : 'urgente')}>Changer la priorité</button>
                  </>
                )}
                {patientSelectionne.statut === 'appele' && (
                  <button className='btn-primary' onClick={() => onConfirmerConsultation(patientSelectionne.id)}>Confirmer l'entrée en consultation</button>
                )}
                {(patientSelectionne.statut === 'en_cours' || patientSelectionne.statut === 'appele') && (
                  <button className='btn-secondary' onClick={() => onTerminerPatient(patientSelectionne.id)}>Marquer comme terminé</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 
      <div className='flux-workflow-section'>
        <h3>Flux Patient</h3>
        <div className='workflow-container'>
          <div className='workflow-steps'>
            {etapes.map((etape, index) => (
              <div key={etape} className='workflow-step'>
                <div className='step-icon'>
                  {getEtapeIcon(etape)}
                </div>
                <div className='step-label'>{etape}</div>
                {index < etapes.length - 1 && (
                  <div className='step-arrow'>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='workflow-stats'>
          <div className='workflow-card'>
            <h4>Patients en Consultation</h4>
            <p className='workflow-count'>{patientsEnCours.length}</p>
          </div>
          <div className='workflow-card'>
            <h4>Temps Moyen par Étape</h4>
            <p className='workflow-count'>42 min</p>
          </div>
          <div className='workflow-card'>
            <h4>Patients Sortis Aujourd'hui</h4>
            <p className='workflow-count'>12</p>
          </div>
          <div className='workflow-card'>
            <h4>Taux d'Efficacité</h4>
            <p className='workflow-count'>94%</p>
          </div>
        </div>
      </div>
      */}
      

      <div className='performance-section'>
        <h3>Indicateurs de Performance</h3>
        <div className='performance-grid'>

          <div className='performance-card'>
            <div className='performance-icon'>
              {IconTempsAttente}
            </div>
            <div className='performance-content'>
              <h4>Attente Max</h4>
              <p className='performance-value'>{getFileAttenteMax()} min</p>
              <p className='performance-status'>{getFileAttenteMax() > 60 ? '⚠ Élevée' : '✓ Acceptable'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
