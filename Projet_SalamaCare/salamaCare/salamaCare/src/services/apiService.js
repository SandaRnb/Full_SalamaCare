// services/apiService.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export async function loginWithBackend({ email, password }) {
    const response = await fetch(`${BASE_URL}/api/users/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
        throw new Error('Identifiants incorrects')
    }

    return await response.json()
}