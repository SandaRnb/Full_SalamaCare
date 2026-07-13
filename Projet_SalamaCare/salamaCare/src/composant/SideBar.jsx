import './CSS_UI/responsable.css'
import logo  from '../assets/images/logo_salamacare.png'

const IconStats = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
<path fill="currentColor" fillRule="evenodd" d="M8 14v-4h1v4h5V5h1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2h1v2zm4.853-10.146l-2.999 3a1.5 1.5 0 0 1-2.538 1.568l-2.714.904L4 9.527a1.5 1.5 0 1 1-.316-.948L7 7.473a1.5 1.5 0 0 1 2.146-1.327l3-3a1.5 1.5 0 1 1 .707.707"></path>
</svg>

const RendezVousIcon =<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
<path fill="none" stroke="currentColor" d="M3.5 0v5m8-5v5M3 7.5h3m6 0H9m-6 3h3m3 0h3m-10.5-8h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z"></path>
</svg>

const DoctorIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
<g fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 22v-3c0-2.828 0-4.243-.879-5.121C18.243 13 16.828 13 14 13l-2 2l-2-2c-2.828 0-4.243 0-5.121.879C4 14.757 4 16.172 4 19v3m12-9v5.5"></path>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 13v4m0 0a2 2 0 0 1 2 2v1m-2-3a2 2 0 0 0-2 2v1m9-13.5v-1a3.5 3.5 0 1 0-7 0v1a3.5 3.5 0 1 0 7 0"></path>
    <path d="M16.75 19.25a.75.75 0 1 1-1.5 0a.75.75 0 0 1 1.5 0Z"></path>
</g>
</svg>

const PatientIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
    <path d="M20 22v-3c0-2.828 0-4.243-.879-5.121c-.878-.88-2.293-.88-5.121-.88h-4c-2.828 0-4.243 0-5.121.88C4 14.757 4 16.172 4 18.999c0 .933 0 1.399.152 1.766a2 2 0 0 0 1.083 1.083C5.602 22 6.068 22 7 22m2.5-9l3 9M7 13.5V22"></path>
    <path d="M12 19h2.5a1.5 1.5 0 0 1 0 3h-2m3-15.5v-1a3.5 3.5 0 1 0-7 0v1a3.5 3.5 0 1 0 7 0"></path>
</g>
</svg>

const Dossier = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 8 8">
<path fill="currentColor" d="M4 5v1h4V5M4 1v1h4V1M1 1v1h1V1M1 5v1h1V5M0 7V4h3v3M0 3V0h3v3"></path>
</svg>

const menuItems = [
        { id: 'stats', label: 'Statistique générale', icon: IconStats},
        { id: 'dossier', label: 'Gestion de dossier', icon: Dossier },
        { id: 'rdv', label: 'Gestion de rendez-vous', icon: RendezVousIcon },
        { id: 'attribution', label: 'Attribution au médecin', icon: DoctorIcon },
        { id: 'medecins', label: 'Gestion des médecins', icon: DoctorIcon },
        { id: 'suivi', label: 'Suivi du flux des patients', icon: PatientIcon }
]

export  function SideBar({ activeSection, onSelectSection, onSignOut }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <img src={logo} alt="Logo SalamaCare" className="sidebar-logo" />
                <div className="sidebar-user-description">
                    <h1>SalamaCare</h1>
                    <p>Responsable</p>
                </div>
            </div>
            <nav className="sidebar-nav">
                <ul className="sidebar-ul">
                    {menuItems.map(item => (
                        <li key={item.id} className="sidebarlist-item-container">
                            <button
                                type="button"
                                className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                                onClick={() => onSelectSection(item.id)}
                            >
                                <span className="sidebar-icon">{item.icon}</span>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-signout" type="button" onClick={onSignOut}>Déconnexion</button>
            </div>
        </aside>
    )
}