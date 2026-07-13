import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo_salamacare.png'
import './CSS_UI/login.css'
import { loginWithBackend } from '../services/apiService'
import { getDashboardPathByRole, getRoleFromToken, saveSession } from '../utils/authStorage'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // composant/login.jsx
const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
        const response = await loginWithBackend({ email, password })
        //    response = {
        //      access, refresh,
        //      user: { id, email, role, profil }
        //    }

        saveSession(response)
        //    localStorage :
        //      access_token  = response.access
        //      refresh_token = response.refresh
        //      user          = response.user

        const role = response?.user?.role    // ← depuis Django directement ✅
        navigate(getDashboardPathByRole(role), { replace: true })

    } catch (error) {
        setError('Email ou mot de passe incorrect')
    } finally {
        setIsLoading(false)
    }
}

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="SalamaCare" className="login-logo" />
          <h1>SalamaCare</h1>
          <p className="login-subtitle">Connexion</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@salamacare.test"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
