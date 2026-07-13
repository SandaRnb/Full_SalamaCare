import medecin from '../assets/images/medecin.jpg'

export const initialMedecins = [
  {
    id: 'm1',
    nom: 'Diaz',
    prenom: 'Sofia',
    specialite: 'Généraliste',
    email: 'sofia.diaz@salamacare.test',
    telephone: '0601020304',
    disponibilite: true,
    horaires: ['08:00-12:00', '14:00-18:00'],
    photoIdentite: medecin
  },
  {
    id: 'm2',
    nom: 'Ben Aissa',
    prenom: 'Nabil',
    specialite: 'Cardiologue',
    email: 'nabil.ben@salamacare.test',
    telephone: '0605060708',
    disponibilite: false,
    horaires: ['09:00-13:00'],
    photoIdentite: medecin
  },
  {
    id: 'm3',
    nom: 'Khaled',
    prenom: 'Meriem',
    specialite: 'Dermatologue',
    email: 'meriem.khaled@salamacare.test',
    telephone: '0678901234',
    disponibilite: true,
    horaires: ['09:00-13:00', '15:00-18:00'],
    photoIdentite: medecin
  },
  {
    id: 'm4',
    nom: 'Farah',
    prenom: 'Youssef',
    specialite: 'Pédiatre',
    email: 'youssef.farah@salamacare.test',
    telephone: '0611223344',
    disponibilite: true,
    horaires: ['08:30-12:30'],
    photoIdentite: medecin
  },
  {
    id: 'm5',
    nom: 'Trabelsi',
    prenom: 'Leila',
    specialite: 'Gynécologue',
    email: 'leila.trabelsi@salamacare.test',
    telephone: '0655667788',
    disponibilite: true,
    horaires: ['10:00-14:00', '16:00-19:00'],
    photoIdentite: medecin
  },
  {
    id: 'm6',
    nom: 'Mansour',
    prenom: 'Amine',
    specialite: 'Généraliste',
    email: 'amine.mansour@salamacare.test',
    telephone: '0644556677',
    disponibilite: true,
    horaires: ['08:00-12:00', '13:00-17:00'],
    photoIdentite: medecin
  },
  {
    id: 'm7',
    nom: 'Bennani',
    prenom: 'Salma',
    specialite: 'Généraliste',
    email: 'salma.bennani@salamacare.test',
    telephone: '0633445566',
    disponibilite: true,
    horaires: ['09:00-13:00', '14:00-18:00'],
    photoIdentite: medecin
  },
  {
    id: 'm8',
    nom: 'Haddad',
    prenom: 'Rami',
    specialite: 'Cardiologue',
    email: 'rami.haddad@salamacare.test',
    telephone: '0622113344',
    disponibilite: true,
    horaires: ['09:30-12:30', '15:00-18:00'],
    photoIdentite: medecin
  },
  {
    id: 'm9',
    nom: 'Sassi',
    prenom: 'Imen',
    specialite: 'Cardiologue',
    email: 'imen.sassi@salamacare.test',
    telephone: '0677889900',
    disponibilite: true,
    horaires: ['10:00-14:00'],
    photoIdentite: medecin
  },
  {
    id: 'm10',
    nom: 'Belhaj',
    prenom: 'Hichem',
    specialite: 'Dermatologue',
    email: 'hichem.belhaj@salamacare.test',
    telephone: '0600112233',
    disponibilite: true,
    horaires: ['08:30-12:30', '14:00-17:30'],
    photoIdentite: medecin
  },
  {
    id: 'm11',
    nom: 'Jaziri',
    prenom: 'Nadia',
    specialite: 'Dermatologue',
    email: 'nadia.jaziri@salamacare.test',
    telephone: '0699001122',
    disponibilite: true,
    horaires: ['11:00-15:00'],
    photoIdentite: medecin
  },
  {
    id: 'm12',
    nom: 'Gharbi',
    prenom: 'Samir',
    specialite: 'Pédiatre',
    email: 'samir.gharbi@salamacare.test',
    telephone: '0612389456',
    disponibilite: true,
    horaires: ['08:00-12:00', '15:00-18:00'],
    photoIdentite: medecin
  },
  {
    id: 'm13',
    nom: 'Marzouki',
    prenom: 'Faten',
    specialite: 'Pédiatre',
    email: 'faten.marzouki@salamacare.test',
    telephone: '0666778899',
    disponibilite: true,
    horaires: ['09:00-13:00'],
    photoIdentite: medecin
  },
  {
    id: 'm14',
    nom: 'Kouki',
    prenom: 'Sabrine',
    specialite: 'Gynécologue',
    email: 'sabrine.kouki@salamacare.test',
    telephone: '0654321987',
    disponibilite: true,
    horaires: ['10:00-14:00'],
    photoIdentite: medecin
  },
  {
    id: 'm15',
    nom: 'Bouazizi',
    prenom: 'Othman',
    specialite: 'Gynécologue',
    email: 'othman.bouazizi@salamacare.test',
    telephone: '0611226677',
    disponibilite: true,
    horaires: ['11:00-15:00', '16:00-19:00'],
    photoIdentite: medecin
  }
]

export const initialDossiers = [
  {
    id: 'd1',
    patientId: 'p1',
    nomPatient: 'Yasmine Haddad',
    dateNaissance: '1990-05-14',
    email: 'yasmine.haddad@example.com',
    password: 'Yasmine2026!',
    telephone: '0602030405',
    adresse: 'Rue des Oliviers, Tunis',
    groupeSanguin: 'O+',
    antecedents: 'Hypertension, migraines',
    allergies: ['Pénicilline'],
    dateCreation: '2026-06-20',
    dateModification: '2026-07-01',
    statut: 'actif',
    documents: [
      {
        id: 'doc1',
        nom: 'Ordonnance initiale',
        type: 'Ordonnance',
        dateUpload: '2026-06-21',
        taille: 148000,
        url: '#',
        description: 'Ordonnance de suivi médical'
      }
    ],
    medecin: initialMedecins[0],
    historique: [
      {
        id: 'h1',
        action: 'Création du dossier',
        dateAction: '2026-06-20T09:15:00',
        utilisateur: 'Admin',
        details: 'Dossier créé pour le patient Yasmine Haddad'
      }
    ]
  },
  {
    id: 'd2',
    patientId: 'p2',
    nomPatient: 'Karim Toumi',
    dateNaissance: '1985-11-02',
    email: 'karim.toumi@example.com',
    password: 'Karim2026!',
    telephone: '0607080910',
    adresse: 'Avenue Habib Bourguiba, Sousse',
    groupeSanguin: 'A-',
    antecedents: 'Asthme',
    allergies: ['Latex'],
    dateCreation: '2026-06-25',
    dateModification: '2026-06-30',
    statut: 'en_attente',
    documents: [],
    medecin: null,
    historique: []
  },
  {
    id: 'd3',
    patientId: 'p3',
    nomPatient: 'Lina Khouaja',
    dateNaissance: '1998-09-12',
    email: 'lina.khouaja@example.com',
    password: 'Lina2026!',
    telephone: '0699887766',
    adresse: 'Cité des Roses, Sfax',
    groupeSanguin: 'B+',
    antecedents: 'Allergie saisonnière',
    allergies: ['Pollen'],
    dateCreation: '2026-06-26',
    dateModification: '2026-06-28',
    statut: 'actif',
    documents: [],
    medecin: initialMedecins[2],
    historique: []
  },
  {
    id: 'd4',
    patientId: 'p4',
    nomPatient: 'Omar Fathi',
    dateNaissance: '2012-03-20',
    email: 'omar.fathi@example.com',
    password: 'Omar2026!',
    telephone: '0622334455',
    adresse: 'Rue de la Liberté, Monastir',
    groupeSanguin: 'O-',
    antecedents: 'Rhume fréquent',
    allergies: [],
    dateCreation: '2026-06-27',
    dateModification: '2026-06-29',
    statut: 'actif',
    documents: [],
    medecin: initialMedecins[3],
    historique: []
  },
  {
    id: 'd5',
    patientId: 'p5',
    nomPatient: 'Maya Zayani',
    dateNaissance: '1994-12-01',
    email: 'maya.zayani@example.com',
    password: 'Maya2026!',
    telephone: '0688776655',
    adresse: 'Boulevard Mohamed V, Tunis',
    groupeSanguin: 'AB+',
    antecedents: 'Migraine chronique',
    allergies: ['Arachides'],
    dateCreation: '2026-06-28',
    dateModification: '2026-07-02',
    statut: 'actif',
    documents: [],
    medecin: initialMedecins[4],
    historique: []
  }
]

export const initialRendezVous = [
  {
    id: 'r1',
    patientId: 'p1',
    medecinId: 'm1',
    dateHeure: '2026-07-03T14:30:00',
    duree: 30,
    statut: 'planifié',
    motif: 'Suivi hypertension',
    lieu: 'Cabinet A',
    notes: 'Mesure de tension et bilan sanguin',
    rappelEnvoyé: false
  },
  {
    id: 'r2',
    patientId: 'p2',
    medecinId: 'm2',
    dateHeure: '2026-07-03T10:00:00',
    duree: 45,
    statut: 'confirmé',
    motif: 'Douleur thoracique',
    lieu: 'Cabinet B',
    notes: '',
    rappelEnvoyé: true
  }
]

export const initialAttributions = [
  {
    id: 'a1',
    dossierPatientId: 'd1',
    medecinId: 'm1',
    dateAttribution: '2026-06-20',
    niveau: 'principal',
    raison: 'Suivi général',
    statut: 'active'
  },
  {
    id: 'a2',
    dossierPatientId: 'd2',
    medecinId: 'm2',
    dateAttribution: '2026-06-25',
    niveau: 'principal',
    raison: 'Spécialité cardiologie',
    statut: 'terminée',
    dateDesattribution: '2026-06-30'
  }
]

export const initialFileAttente = [
  {
    id: 'f1',
    patientId: 'p3',
    medecinId: 'm1',
    nomPatient: 'Lina Khouaja',
    heureArrivee: '2026-07-03T08:50:00',
    tempsAttente: 18,
    priorite: 'normale',
    statut: 'en_attente'
  },
  {
    id: 'f2',
    patientId: 'p4',
    medecinId: 'm1',
    nomPatient: 'Omar Fathi',
    heureArrivee: '2026-07-03T09:05:00',
    tempsAttente: 5,
    priorite: 'haute',
    statut: 'en_cours'
  },
  {
    id: 'f3',
    patientId: 'p5',
    medecinId: 'm2',
    nomPatient: 'Maya Zayani',
    heureArrivee: '2026-07-03T09:20:00',
    tempsAttente: 2,
    priorite: 'urgente',
    statut: 'en_attente'
  }
]

export const initialNotifications = [
  {
    id: 'n1',
    contenus: 'demande de rendez-vous pour le patient Yasmine Haddad',
    date: '2026-07-03T09:00:00',
    statut: 'non_lu',
    id_envoyeur: 'p1',
    nom_envoyeur: 'Yasmine Haddad'
  },
  {
    id: 'n2',
    contenus: 'demande de modification de dossier',
    date: '2026-07-03T10:00:00',
    statut: 'non_lu',
    id_envoyeur: 'p2',
    nom_envoyeur: 'Karim Toumi'
  }
]

export const initialMessages = [
  {
    id: 'm1',
    contenus: 'Bonjour, je souhaite prendre rendez-vous avec une médecin généraliste',
    date: '2026-07-03T09:00:00',
    statut: 'non_lu',
    id_envoyeur: 'p1',
    nom_envoyeur: 'Yasmine Haddad'
  },
  {
    id: 'm2',
    contenus: 'Bonsoir, mon enfant a de la fièvre depuis deux jours, que dois-je faire?',
    date: '2026-07-03T09:00:00',
    statut: 'non_lu',
    id_envoyeur: 'p1',
    nom_envoyeur: 'Yasmine Haddad'
  },
  {
    id: 'm3',
    contenus: 'Je souhaite obtenir des informations sur les analyses médicales disponibles.',
    date: '2026-07-03T09:00:00',
    statut: 'non_lu',
    id_envoyeur: 'p1',
    nom_envoyeur: 'Yasmine Haddad'
  }
]
