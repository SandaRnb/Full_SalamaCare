export const PATIENTS = [
  {
    id: 'P003',
    nom: 'Andriantsalama Haja',
    initiales: 'AH',
    age: 35,
    sexe: 'M',
    dateNaissance: '19/11/1989',
    tel: '+261 33 56 789 01',
    adresse: 'Ambohipo, Antananarivo',
    groupeSanguin: 'B-',
    taille: 178,
    poids: 72,
    imc: 22.7,
    antecedents: ['Asthme modéré'],
    allergies: ['Aspirine'],
    antecedentsFamiliaux: 'Mère : asthme',
    rdvHeure: '14h00',
    rdvMotif: 'Gêne respiratoire + toux persistante',
    statut: 'en-attente',
  },
];

export const HISTORIQUE = {
  // P001: [
  //   { date: '12/06/2026', motif: 'Consultation de suivi — HTA + Diabète', medecin: 'Dr. Rakoto', note: 'Renouvellement ordonnance' },
  //   { date: '15/04/2026', motif: 'Contrôle glycémie — résultats satisfaisants', medecin: 'Dr. Rakoto', note: 'HbA1c: 7.1%' },
  //   { date: '20/02/2026', motif: 'Orientation vers cardiologue', medecin: 'Dr. Rakoto', note: 'Résultats reçus: RAS' },
  // ],
  // P002: [
  //   { date: '01/06/2026', motif: 'Suivi post-IDM 6 mois', medecin: 'Dr. Rakoto', note: 'ECG normal' },
  //   { date: '10/03/2026', motif: 'Contrôle lipidique', medecin: 'Dr. Rakoto', note: 'LDL à 1.4 g/L' },
  // ],
  // P003: [
  //   { date: '05/05/2026', motif: 'Bilan asthme — plan de traitement', medecin: 'Dr. Rakoto', note: 'Peak flow 420 L/min' },
  // ],
};

export const SPECIALISTES = [
  { id: 'S01', specialite: 'Cardiologie',     icone: 'heart',    couleur: '#A32D2D', description: 'Cœur & vaisseaux' },
  { id: 'S02', specialite: 'Neurologie',      icone: 'brain',    couleur: '#534AB7', description: 'Système nerveux' },
  { id: 'S03', specialite: 'Endocrinologie',  icone: 'activity', couleur: '#0F6E56', description: 'Hormones & métabolisme' },
  { id: 'S04', specialite: 'Pneumologie',     icone: 'lungs',    couleur: '#185FA5', description: 'Voies respiratoires' },
  { id: 'S05', specialite: 'Ophtalmologie',   icone: 'eye',      couleur: '#854F0B', description: "Fond d'œil & vision" },
  { id: 'S06', specialite: 'Néphrologie',     icone: 'droplet',  couleur: '#0C444C', description: 'Fonction rénale' },
];

const m = new Date();
const datef = m.toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
const dateh = m.toLocaleString('fr-FR');

export const STATS_JOUR = {
  date: datef,
  // consultationsAujourdhui: 3,
  // bilansEnAttente: 2,
  // orientationsUrgentes: 1,
  // semaine: 12,
};