# Structure simplifiée des apps du projet

## 1. Vue globale

Le projet est divisé en plusieurs applications Django, chacune a une responsabilité précise :

- `users` : gestion des comptes et profils
- `patients` : informations médicales du patient
- `medecins` : informations et disponibilités du médecin
- `rendezvous` : gestion des rendez-vous
- `consultations` : contenu de la consultation
- `notifications` : alertes et messages
- `config` : configuration globale du projet

---

## 2. Description des apps

### users
Responsable des utilisateurs du système.

Contient :
- utilisateur principal
- profils médecin
- profils patient
- profils responsable

### patients
Responsable des données du patient.

Contient :
- dossier médical
- allergies
- antécédents
- groupe sanguin

### medecins
Responsable des informations liées au médecin.

Contient :
- disponibilité
- planning
- agenda du médecin

### rendezvous
Responsable de la réservation des rendez-vous.

Contient :
- patient
- médecin
- date
- heure
- motif
- statut

### consultations
Responsable du suivi médical après le rendez-vous.

Contient :
- diagnostic
- ordonnance
- notes
- date de consultation

### notifications
Responsable des messages envoyés à l’utilisateur.

Contient :
- destinataire
- rendez-vous concerné
- message
- type de notification
- statut lu/non lu

---

## 3. Relation entre les apps

```text
users
  ├── patients
  ├── medecins
  └── responsables

patients ──> rendezvous
medecins ──> rendezvous
rendezvous ──> consultations
rendezvous ──> notifications
```

---

## 4. Résumé rapide

- `users` = identité des utilisateurs
- `patients` = données médicales du patient
- `medecins` = disponibilité et planning du médecin
- `rendezvous` = prise de rendez-vous
- `consultations` = suivi médical
- `notifications` = rappels et alertes
