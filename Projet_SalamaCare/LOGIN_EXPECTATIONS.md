# Login SalamaCare – Ce qu’il faut attendre

## Objectif

Le front ne doit plus demander à l’utilisateur de choisir son profil avant la connexion.

Le flux attendu est le suivant :

1. L’utilisateur saisit son email et son mot de passe sur une seule page de connexion.
2. Le front envoie ces informations au backend Django.
3. Django retourne un token JWT (ou un access token).
4. Le front lit le rôle contenu dans le token, puis redirige automatiquement vers la bonne page.

---

## Flux attendu côté frontend

### Page de connexion

- Une seule page : `/login`
- Aucun bouton “Responsable” / “Patient” avant connexion
- Le formulaire contient seulement :
  - email
  - mot de passe

### Après soumission

Le front doit :

- appeler le backend Django avec les identifiants
- récupérer le token
- décoder le rôle depuis le token JWT ou depuis la réponse API
- sauvegarder dans le localStorage :
  - `userToken`
  - `userEmail`
  - `userType`
  - `userProfile`

### Redirection automatique

- si le rôle est `patient` → `/patient-dashboard`
- si le rôle est `responsable` → `/dashboard`
- si le rôle n’est pas reconnu → renvoyer vers `/login`

---

## Réponse attendue du backend Django

Le backend doit renvoyer une réponse compatible avec ce format :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "role": "patient"
  }
}
```

Ou, si le rôle est directement dans le JWT :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Rôle attendu dans le token

Le JWT doit contenir un claim de rôle, par exemple :

```json
{
  "role": "patient"
}
```

ou

```json
{
  "user_type": "responsable"
}
```

---

## Endpoint Django attendu

Le frontend peut tenter les endpoints suivants :

- `/api/login`
- `/login`
- `/api/token`

L’important est que chaque endpoint accepte :

```json
{
  "email": "user@example.com",
  "password": "motdepasse"
}
```

---

## Contraintes importantes

- Ne plus utiliser un choix manuel de profil côté React.
- Ne plus générer un token mock local dans le frontend.
- Ne plus vérifier le profil via une liste locale de comptes.
- Le token Django doit devenir la source de vérité.
- La route protégée dépendra du rôle présent dans le token.

---

## Résultat attendu final

L’application doit fonctionner ainsi :

- l’utilisateur clique sur “Se connecter”
- il entre email + mot de passe
- le backend valide les identifiants
- le backend renvoie le token
- le frontend décodé le token,
- puis redirige automatiquement vers la bonne page selon le rôle.
