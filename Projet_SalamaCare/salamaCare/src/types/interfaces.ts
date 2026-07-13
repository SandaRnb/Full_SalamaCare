/**
 * Interfaces pour les fonctionnalités du dashboard responsable
 */

// Interface Patient
export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  genre: string;
  email: string;
  telephone: string;
  adresse: string;
  dateInscription: string;
  photoIdentite: string;
  condition: string;
}

// Interface Médecin
export interface Medecin {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  email: string;
  telephone: string;
  disponibilite: boolean;
  horaires?: string[];
  photoIdentite: string;
}

// Interface pour Dossier Patient
export interface DossierPatient {
  id: string;
  patientId: string;
  nomPatient: string;
  dateCreation: string;
  dateModification: string;
  statut: 'actif' | 'archivé' | 'en_attente';
  documents: Document[];
  medecin: Medecin | null;
  historique: HistoriqueDossier[];
}

// Interface Document
export interface Document {
  id: string;
  nom: string;
  type: string; // 'ordonnance', 'bilan', 'diagnostic', etc.
  dateUpload: string;
  taille: number;
  url: string;
  description?: string;
}

// Interface Historique du Dossier
export interface HistoriqueDossier {
  id: string;
  action: string;
  dateAction: string;
  utilisateur: string;
  details: string;
}

// Interface Rendez-vous
export interface RendezVous {
  id: string;
  patientId: string;
  medecinId: string;
  dateHeure: string;
  duree: number; // en minutes
  statut: 'planifié' | 'confirmé' | 'en_cours' | 'terminé' | 'annulé';
  motif: string;
  lieu: string;
  notes?: string;
  rappelEnvoyé: boolean;
}

// Interface Rappel
export interface Rappel {
  id: string;
  rendezVousId: string;
  patientId: string;
  typeRappel: 'email' | 'sms' | 'notification';
  dateEnvoi: string;
  statut: 'envoyé' | 'en_attente' | 'échoué';
  message: string;
}

// Interface Attribution Médecin
export interface Attribution {
  id: string;
  dossierPatientId: string;
  medecinId: string;
  dateAttribution: string;
  dateDesattribution?: string;
  niveau: 'principal' | 'secondaire';
  raison: string;
  statut: 'active' | 'terminée';
}

// Interface Suivi Patient
export interface SuiviPatient {
  id: string;
  patientId: string;
  medecinId: string;
  etape: 'accueil' | 'consultation' | 'traitement' | 'suivi' | 'sortie';
  dateEtape: string;
  duree: number; // en minutes
  notes?: string;
}

// Interface File d'Attente
export interface FileAttente {
  id: string;
  patientId: string;
  nomPatient: string;
  heureArrivee: string;
  tempsAttente: number; // en minutes
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  statut: 'en_attente' | 'appele' | 'en_cours';
}

// Interface Statistiques
export interface Statistiques {
  totalPatients: number;
  totalMedecins: number;
  patientsActifs: number;
  medecinsDisponibles: number;
  rendezVousAujourdhui: number;
  tempsAttenteMoyen: number;
  tauxSatisfaction?: number;
}

// Interface Répartition Données
export interface Repartition {
  label: string;
  valeur: number;
  pourcentage: number;
}

// Interface Graphique
export interface DonneesGraphique {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

// Interface Action Historique
export interface ActionHistorique {
  id: string;
  type: 'création' | 'modification' | 'suppression' | 'attribution';
  description: string;
  dateAction: string;
  utilisateur: string;
  entite: string; // 'dossier', 'rendez-vous', etc.
}
