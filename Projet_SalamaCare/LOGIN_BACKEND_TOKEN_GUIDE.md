# Guide de connexion Login → Backend → redirection sans logique JWT côté front

Ce document indique comment brancher le login du front sur Django sans mettre de logique token dans le navigateur.

L’idée est simple :
- le front envoie seulement email/password via fetch
- Django répond avec une réponse JSON de succès ou avec une session/cookie backend
- le front n’essaye pas de décoder un JWT
- la redirection se fait selon la réponse backend, par exemple le champ role ou la route de redirection

## 1. Point d’entrée du formulaire de connexion

Fichier à consulter :
- salamaCare/src/composant/login.jsx

Ce composant fait la soumission du formulaire et gère la réponse du backend.

Ce qu’il faut faire si tu veux éviter toute logique token côté front :
- appelle la fonction loginWithBackend({ email, password })
- attends une réponse Django de type JSON propre
- utilise directement response.role, response.user?.role, ou response.redirectUrl
- redirige selon cette réponse

En pratique, le composant ne doit pas faire :
- décoder un JWT
- lire un token dans localStorage
- extraire le rôle depuis le token

Il doit seulement faire :
- fetch vers Django
- vérifier response.ok
- naviguer selon response.role ou response.redirectUrl

---

## 2. Service HTTP de connexion au backend

Fichier à consulter :
- salamaCare/src/services/apiService.js

C’est ici que la requête HTTP vers le backend est construite.

Important :
- API_BASE_URL vient de la variable d’environnement VITE_API_BASE_URL
- la liste des endpoints essayés est :
  - /api/login
  - /login
  - /api/token

Fonction concernée :
- loginWithBackend(credentials)

Si votre backend expose une route différente, il faut changer la liste LOGIN_PATH_CANDIDATES.

Exemple logique actuelle :
- si le backend répond avec JSON contenant token / access / access_token / refresh, alors le service le renvoie au composant login.jsx

---

## 3. Variables d’environnement

Fichier à vérifier :
- salamaCare/.env.example

La base URL du backend doit être définie dans :
- VITE_API_BASE_URL

Exemple attendu :
- http://localhost:8000

Si cette valeur est vide ou mauvaise, la connexion ne pourra pas fonctionner.

Important : la variable d’environnement n’a pas besoin d’encoder le token. Elle sert seulement à définir l’URL de l’API Django.

---

## 4. Stockage côté navigateur

Si tu veux une architecture propre sans token côté front, il ne faut pas stocker le token dans le localStorage.

À la place :
- soit Django gère la session dans un cookie HttpOnly
- soit Django renvoie seulement un JSON simple contenant role, user et redirectUrl

Dans ce cas, le front stocke uniquement :
- userEmail
- userType
- userProfile

Et seulement si besoin pour l’UI, pas pour l’authentification.

---

## 5. Détermination du rôle sans JWT côté front

Fichier à consulter :
- salamaCare/src/utils/authStorage.js

Si tu ne veux pas de logique token sur le front, cette fonction ne doit plus être utilisée pour le login.

La bonne méthode est :
- le backend renvoie directement le rôle dans la réponse JSON
- le front lit response.role ou response.user?.role
- la redirection se fait selon ce rôle

Exemple de réponse attendue côté Django :

{
  "success": true,
  "role": "responsable",
  "redirectUrl": "/dashboard"
}

Ou bien :

{
  "success": true,
  "user": {
    "role": "medecin"
  }
}

---

## 6. Protection des routes

Fichier à consulter :
- salamaCare/src/composant/PrivateRoute.jsx

Cette route vérifie si un token existe avant d’autoriser l’accès.

Point important :
- si le token n’est pas présent ou invalide, la redirection va vers /login

Si vous voulez une vérification plus stricte du JWT, c’est ici qu’il faut ajouter une logique complémentaire.

---

## 7. Ce qu’il faut changer selon le backend

### Cas 1 : backend répond avec un JSON simple contenant role
Changer dans :
- salamaCare/src/composant/login.jsx

La logique de redirection devient :
- response.role → /dashboard
- response.user.role → /dashboard
- response.redirectUrl → route directement fournie par Django

### Cas 2 : backend utilise une autre URL de login
Changer dans :
- salamaCare/src/services/apiService.js

Modifier la liste LOGIN_PATH_CANDIDATES.

### Cas 3 : backend gère la session côté serveur
Dans ce cas, le front ne gère plus le token.

Il suffit de :
- envoyer le fetch
- vérifier le statut HTTP
- rediriger selon la réponse JSON de Django

### Cas 4 : backend renvoie une URL de redirection déjà prête
Le front n’a alors qu’à faire :
- navigate(response.redirectUrl)

Aucun décodage JWT n’est nécessaire.

---

## 8. Format de réponse backend attendu

Pour une architecture sans logique token côté front, le backend doit renvoyer au minimum quelque chose de ce type :

{
  "success": true,
  "role": "responsable",
  "redirectUrl": "/dashboard"
}

Ou encore :

{
  "success": true,
  "user": {
    "role": "medecin"
  },
  "redirectUrl": "/dashboard"
}

Dans ce modèle, le front ne manipule pas le token. Il utilise seulement la réponse de Django pour décider où aller.

---

## 9. Résumé rapide du point de changement

Si vous devez brancher le login au backend pour le token, les fichiers à modifier sont principalement :
1. salamaCare/src/composant/login.jsx
2. salamaCare/src/services/apiService.js
3. salamaCare/src/utils/authStorage.js
4. salamaCare/.env.example

---

## 10. Recommandation finale

Si tu ne veux pas de logique token côté front, la bonne architecture est :

1. le front envoie email/password via fetch
2. Django vérifie les identifiants
3. Django renvoie un message de succès + role + redirectUrl, ou bien installe une session/cookie côté serveur
4. le front redirige uniquement selon la réponse Django

Dans ce cas, il faut retirer :
- la lecture du token JWT dans le composant login
- le stockage du token dans localStorage
- le décodage du JWT dans authStorage.js

Le frontend devient seulement un simple client de dialogue avec Django.
