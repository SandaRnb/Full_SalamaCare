import { useState, useEffect } from "react";
import "./App.css";
import "./composant/CSS_UI/responsable.css";
import "./composant/CSS_UI/gestion-dossier.css";
import "./composant/CSS_UI/gestion-rdv.css";
import "./composant/CSS_UI/attribution-medecin.css";
import "./composant/CSS_UI/suivi-flux.css";
import GestionDossier from "./composant/GestionDossier";
import GestionRdv from "./composant/GestionRdv";
import AttributionMedecin from "./composant/AttributionMedecin";
import SuiviFlux from "./composant/SuiviFlux";
import GestionMedecins from "./composant/GestionMedecins";
import { StatistiqueGeneral } from "./composant/Statistique";
import { DashboardLayout } from "./components/DashboardLayout";
import {
  initialAttributions,
  initialFileAttente,
  initialMedecins,
  initialNotifications
} from "./data/mockData";
import {
  getStoredAppointments,
  saveStoredAppointments,
  getStoredConsultations,
  saveStoredConsultations,
  syncStoredPatientsFromDossiers
} from "./utils/authStorage";
import {
  fetchAppointmentsFromBackend,
  fetchDoctorsFromBackend,
  fetchPatientsFromBackend
} from "./services/backendAdapter";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("stats");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [rendezVous, setRendezVous] = useState(getStoredAppointments());
  const [consultations, setConsultations] = useState(getStoredConsultations());
  const [attributions, setAttributions] = useState([]);
  const [fileAttente, setFileAttente] = useState([]);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsData, doctorsData, appointmentsData] = await Promise.all([
          fetchPatientsFromBackend(),
          fetchDoctorsFromBackend(),
          fetchAppointmentsFromBackend()
        ]);
        console.log("PATIENTS BACKEND", patientsData);
        console.log("MEDECINS BACKEND", doctorsData);
        console.log("RDV BACKEND", appointmentsData);

        if (Array.isArray(patientsData)) {
          const patientsNormalises = patientsData.map(p => ({
            ...p,
            patientId: p.patientId || p.patient_id || p.id,
            nomPatient: p.nomPatient || p.username || p.nom || p.email || "Patient"
          }));
          setDossiers(patientsNormalises);
        }

        if (Array.isArray(doctorsData)) {
          const medecinsNormalises = doctorsData.map(m => ({
            id: m.id,
            username: m.username,
            nom: m.nom || m.username,
            prenom: m.prenom || "",
            email: m.email,
            telephone: m.telephone,
            specialite: m.specialite,
            disponibilite: true
          }));
          console.log("MEDECINS NORMALISES", medecinsNormalises);
          setMedecins(medecinsNormalises);
        }

        if (Array.isArray(appointmentsData)) {
          setRendezVous(appointmentsData);
          saveStoredAppointments(appointmentsData);
        }
      } catch (error) {
        console.error("Erreur chargement dashboard", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => { syncStoredPatientsFromDossiers(dossiers); }, [dossiers]);
  useEffect(() => { saveStoredAppointments(rendezVous); }, [rendezVous]);
  useEffect(() => { saveStoredConsultations(consultations); }, [consultations]);

  const availableMedecins = medecins;

  const ajouterDossier = (dossier) => {
    const nouveau = {
      ...dossier,
      patientId: dossier.patientId || dossier.patient_id || dossier.id,
      nomPatient: dossier.nomPatient || dossier.username || "Patient"
    };
    setDossiers(prev => [nouveau, ...prev]);
  };

  const ajouterRdv = (rdv) => {
    const nouveauRdv = {
      ...rdv,
      id: rdv.id || `rdv_${Date.now()}`,
      statut: rdv.statut || "planifié"
    };
    setRendezVous(prev => [...prev, nouveauRdv]);
    saveStoredAppointments([...rendezVous, nouveauRdv]);
  };

  const renderSectionComponent = () => {
    switch (activeSection) {
      case "stats":
        return <StatistiqueGeneral medecins={medecins} dossiers={dossiers} rendezVous={rendezVous} />;
      case "dossier":
        return <GestionDossier dossiers={dossiers} rendezVous={rendezVous} medecins={medecins} searchQuery={searchQuery} onAjouterDossier={ajouterDossier} />;
      case "rdv":
        return <GestionRdv
          rendezVous={rendezVous}
          medecins={availableMedecins}
          dossiers={dossiers}
          onAjouterRendezVous={ajouterRdv}
          onAnnulerRdv={(id) => { setRendezVous(prev => prev.map(r => r.id === id ? { ...r, statut: "annulé" } : r)); }}
          onModifierRdv={(rdv) => { setRendezVous(prev => prev.map(r => r.id === rdv.id ? rdv : r)); }}
          onReporterRdv={(id, date) => { setRendezVous(prev => prev.map(r => r.id === id ? { ...r, dateHeure: date, statut: "reporté" } : r)); }}
        />;
      case "attribution":
        return <AttributionMedecin attributions={attributions} dossiers={dossiers} medecins={medecins} availableMedecins={availableMedecins} />;
      case "suivi":
        return <SuiviFlux fileAttente={fileAttente} />;
      case "medecins":
        return <GestionMedecins medecins={medecins} />;
      default:
        return null;
    }
  };

  console.log("DOSSIERS", dossiers);
  console.log("MEDECINS", medecins);
  console.log("RDV", rendezVous);

  return (
    <DashboardLayout
      activeSection={activeSection}
      onSelectSection={setActiveSection}
      onSignOut={() => { localStorage.clear(); window.location.href = "/login"; }}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      notifications={notifications}
      toasts={toasts}
    >
      {renderSectionComponent()}
    </DashboardLayout>
  );
}

export default Dashboard;