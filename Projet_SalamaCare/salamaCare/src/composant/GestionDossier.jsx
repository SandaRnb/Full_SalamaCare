import { useState, useEffect } from "react";
import axios from "axios";
import "./CSS_UI/gestion-dossier.css";

const API = "http://127.0.0.1:8000/api";

export default function GestionDossier({ rendezVous = [], medecins = [], onAjouterDossier = () => {}, onModifierDossier = () => {}, searchQuery = '' }) {
  const [listeDossiers, setListeDossiers] = useState([]);
  const [dossierSelectionne, setDossierSelectionne] = useState(null);
  const [afficherModal, setAfficherModal] = useState(false);
  const [typeModal, setTypeModal] = useState("nouveau");
  const [formData, setFormData] = useState({
    nomPatient: "",
    dateNaissance: "",
    email: "",
    telephone: "",
    adresse: "",
    groupeSanguin: "",
    antecedents: "",
    allergies: "",
    password: ""
  });

  const token = () => localStorage.getItem("access_token");

  useEffect(() => {
    axios.get(`${API}/dossier-medical/liste/`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(res => {
        const data = res.data.results || res.data;
        setListeDossiers(Array.isArray(data) ? data : []);
      })
      .catch(err => console.log("Erreur dossiers", err.response?.data));
  }, []);

  const resetForm = () => {
    setFormData({
      nomPatient: "",
      dateNaissance: "",
      email: "",
      telephone: "",
      adresse: "",
      groupeSanguin: "",
      antecedents: "",
      allergies: "",
      password: ""
    });
  };

  const ouvrirCreation = () => {
    setTypeModal("nouveau");
    resetForm();
    setAfficherModal(true);
  };

  const formatDate = (d) => { if (!d) return "-"; return new Date(d).toLocaleDateString("fr-FR"); };
  const nomPatient = (d) => d.username || d.nomPatient || d.nom || "Sans nom";

  const handleSubmitDossier = async (e) => {
    e.preventDefault();
    const body = {
      username: formData.nomPatient,
      email: formData.email,
      password: formData.password,
      password2: formData.password,
      date_naissance: formData.dateNaissance,
      telephone: formData.telephone,
      adresse: formData.adresse,
      groupe_sanguin: formData.groupeSanguin,
      antecedents_medicaux: formData.antecedents,
      allergies: formData.allergies
    };
    try {
      const res = await axios.post(`${API}/dossier-medical/create/`, body, { headers: { Authorization: `Bearer ${token()}` } });
      const dossier = res.data.dossier || res.data;
      setListeDossiers(prev => [dossier, ...prev]);
      onAjouterDossier(dossier);
      setDossierSelectionne(dossier);
      setAfficherModal(false);
    } catch (err) {
      console.log(err.response?.data);
      alert("Erreur création dossier");
    }
  };

  const filteredDossiers = searchQuery ? listeDossiers.filter(d => nomPatient(d).toLowerCase().includes(searchQuery.toLowerCase())) : listeDossiers;

  const getSelectedRendezVous = () => {
    if (!dossierSelectionne) return [];
    return rendezVous.filter(r => String(r.patientId) === String(dossierSelectionne.patient_id || dossierSelectionne.id));
  };

  return (
    <div className="gestion-dossier-container">
      <div className="gestion-dossier-header">
        <h2>Gestion des Dossiers Patients</h2>
        <button className="btn-primary" onClick={ouvrirCreation}>
          <iconify-icon icon="material-symbols:post-add" />
          Nouveau Dossier
        </button>
      </div>

      <div className="dossier-content">
        <div className="dossier-list">
          <h3>Liste des Dossiers</h3>
          {filteredDossiers.length ? (
            <ul className="dossier-ul">
              {filteredDossiers.map(d => (
                <li key={d.id} className={`dossier-item ${dossierSelectionne?.id === d.id ? 'active' : ''}`} onClick={() => setDossierSelectionne(d)}>
                  <div className="dossier-item-header">
                    <span className="dossier-nom">{nomPatient(d)}</span>
                    <span className="statut-badge">actif</span>
                  </div>
                  <p className="dossier-date">{formatDate(d.created_at)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state"><p>Aucun dossier patient</p></div>
          )}
        </div>

        {dossierSelectionne && (
          <div className="dossier-details">
            <div className="details-header"><h3>{nomPatient(dossierSelectionne)}</h3></div>
            <div className="details-section">
              <h4>Informations Patient</h4>
              <div className="info-grid">
                <div className="info-item"><label>Email</label><p>{dossierSelectionne.email || "-"}</p></div>
                <div className="info-item"><label>Téléphone</label><p>{dossierSelectionne.telephone || "-"}</p></div>
                <div className="info-item"><label>Date naissance</label><p>{formatDate(dossierSelectionne.date_naissance)}</p></div>
                <div className="info-item"><label>Adresse</label><p>{dossierSelectionne.adresse || "-"}</p></div>
                <div className="info-item"><label>Groupe sanguin</label><p>{dossierSelectionne.groupe_sanguin || "-"}</p></div>
                <div className="info-item"><label>Antécédents</label><p>{dossierSelectionne.antecedents_medicaux || "Aucun"}</p></div>
                <div className="info-item"><label>Allergies</label><p>{dossierSelectionne.allergies || "Aucune"}</p></div>
              </div>
            </div>

            <div className="details-section">
              <h4>Rendez-vous associés</h4>
              {getSelectedRendezVous().length ? (
                getSelectedRendezVous().map(rdv => (
                  <div key={rdv.id} className="document-item">
                    <div className="document-info">
                      <p className="document-nom">{new Date(rdv.dateHeure).toLocaleString("fr-FR")}</p>
                      <p className="document-type">{rdv.motif}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state small"><p>Aucun rendez-vous</p></div>
              )}
            </div>
          </div>
        )}
      </div>

      {afficherModal && (
        <div className="modal-overlay" onClick={() => setAfficherModal(false)}>
          <div className="modal-content gestion-dossier-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Créer un nouveau dossier</h3>
              <button className="btn-close" onClick={() => setAfficherModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form id="form-dossier" onSubmit={handleSubmitDossier}>
                <div className="form-group"><label>Nom patient</label><input required type="text" value={formData.nomPatient} onChange={e => setFormData({ ...formData, nomPatient: e.target.value })} /></div>
                <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                <div className="form-group"><label>Mot de passe</label><input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} /></div>
                <div className="form-group"><label>Date naissance</label><input type="date" value={formData.dateNaissance} onChange={e => setFormData({ ...formData, dateNaissance: e.target.value })} /></div>
                <div className="form-group"><label>Téléphone</label><input type="text" value={formData.telephone} onChange={e => setFormData({ ...formData, telephone: e.target.value })} /></div>
                <div className="form-group"><label>Adresse</label><input type="text" value={formData.adresse} onChange={e => setFormData({ ...formData, adresse: e.target.value })} /></div>
                <div className="form-group"><label>Groupe sanguin</label><input type="text" value={formData.groupeSanguin} onChange={e => setFormData({ ...formData, groupeSanguin: e.target.value })} /></div>
                <div className="form-group"><label>Antécédents</label><textarea value={formData.antecedents} onChange={e => setFormData({ ...formData, antecedents: e.target.value })} /></div>
                <div className="form-group"><label>Allergies</label><input type="text" value={formData.allergies} onChange={e => setFormData({ ...formData, allergies: e.target.value })} /></div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setAfficherModal(false)}>Annuler</button>
              <button className="btn-primary" type="submit" form="form-dossier">Créer le dossier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}