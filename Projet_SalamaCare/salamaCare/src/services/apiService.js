// services/apiService.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export async function loginWithBackend({ email, password }) {
    const response = await fetch(`${BASE_URL}/api/users/login/`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(JSON.stringify(error))
    }

    return await response.json()
    // retourne :
    // {
    //   access:  "eyJ...",
    //   refresh: "eyJ...",
    //   user: {
    //     id:     42,
    //     email:  "martin@gmail.com",
    //     role:   "medecin",
    //     profil: { profil_id, specialite, telephone }
    //   }
    // }
}

export async function fetchMonProfil(token) {
    const response = await fetch(`${BASE_URL}/api/users/moi/`, {
        method:  'GET',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Profil introuvable')
    return await response.json()
}