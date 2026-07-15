import './CSS_UI/responsable.css'
import { useState, useEffect } from 'react'
import { ListeNotifications } from './Notifications'

export default function NavBarResponsable({ searchValue, onSearchChange, notifications = [] }) {
    const [afficherNotifications, setAfficherNotifications] = useState(false)
    const [afficherMessage, setAfficherMessage] = useState(false)
    const [userName, setUserName] = useState('Responsable') // Valeur par défaut alternative

    const notificationCount = notifications.length

    // 1. Récupération dynamique du nom de l'utilisateur connecté
    useEffect(() => {
        try {
            const userSession = localStorage.getItem('user')
            if (userSession) {
                const userObj = JSON.parse(userSession)
                // On cherche d'abord un nom, sinon un prénom, sinon la partie avant le @ de l'email
                const nameToDisplay = userObj.name || userObj.username || userObj.email?.split('@')[0] || 'Responsable'
                setUserName(nameToDisplay)
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du nom utilisateur :", error)
        }
    }, [])

    // 2. Fonction utilitaire pour appliquer le Capitalize (ex: "tojo" -> "Tojo")
    const capitalize = (str) => {
        if (!str) return ''
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    return (
        <nav className="navbar-responsable bg-base-100">
            <div className='notifications'>
                <div className='indice-notif cloche-notification' onClick={() => {
                    setAfficherNotifications((prev) => !prev)
                    if (afficherMessage) setAfficherMessage(false)
                }}>
                    <span className={`dot-notification ${notificationCount > 0 ? 'dot-active' : 'dot-non-active'}`}>
                        {notificationCount}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 36 36">
                        <path fill="currentColor" d="M32.51 27.83A14.4 14.4 0 0 1 30 24.9a12.6 12.6 0 0 1-1.35-4.81v-4.94A10.81 10.81 0 0 0 19.21 4.4V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.33 10.73v4.94a12.6 12.6 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93a1 1 0 0 0-.34.75v1.36a1 1 0 0 0 1 1h27.8a1 1 0 0 0 1-1v-1.36a1 1 0 0 0-.34-.75M5.13 28.94a16.2 16.2 0 0 0 2.44-3a14.2 14.2 0 0 0 1.65-5.85v-4.94a8.74 8.74 0 1 1 17.47 0v4.94a14.2 14.2 0 0 0 1.65 5.85a16.2 16.2 0 0 0 2.44 3Z" className="clr-i-outline clr-i-outline-path-1"></path>
                        <path fill="currentColor" d="M18 34.28A2.67 2.67 0 0 0 20.58 32h-5.26A2.67 2.67 0 0 0 18 34.28" className="clr-i-outline clr-i-outline-path-2"></path>
                        <path fill="none" d="M0 0h36v36H0z"></path>
                    </svg>
                    {afficherNotifications && <ListeNotifications items={notifications} />}
                </div>
            </div>
            
            <div className="navbar-search-section">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24"
                    className="search-icon"
                >
                    <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="input navbar-responsable-input"
                    aria-label="Barre de recherche"
                    value={searchValue ?? ''}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                />
            </div>

            {/* Profile Section */}
            <div className="navbar-profile-section">
                {/* On applique le capitalize ici sur le nom dynamique */}
                <span className="profile-name">{capitalize(userName)}</span>
                <img 
                    src="https://th.bing.com/th/id/OIP.U0lavRZhl9Y5-e_-UiptAwHaHa?w=172&h=180&c=7&r=0&o=7&pid=1.7&rm=3" 
                    alt="Photo de profil" 
                    className="profile-image" 
                />
            </div>
        </nav>
    )
}