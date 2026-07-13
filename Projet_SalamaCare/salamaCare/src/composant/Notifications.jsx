import './CSS_UI/responsable.css'

const defaultAvatar = 'https://via.placeholder.com/44?text=SC'

export function ListeMessages({ items = [] }) {
    return (
        <div className="liste-notifications">
            {items.length > 0 ? (
                items.map((message) => (
                    <div key={message.id} className="notification-item">
                        <img src={defaultAvatar} alt="Avatar" />
                        <div>
                            <p>{message.contenus}</p>
                            <span className="notification-date">{new Date(message.date).toLocaleString('fr-FR')}</span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-state small">
                    <p>Aucun message</p>
                </div>
            )}
        </div>
    )
}

export function ListeNotifications({ items = [] }) {
    return (
        <div className="liste-notifications">
            {items.length > 0 ? (
                items.map((notification) => (
                    <div key={notification.id} className="notification-item">
                        <img src={defaultAvatar} alt="Avatar" />
                        <div>
                            <p>{notification.contenus}</p>
                            <span className="notification-date">{new Date(notification.date).toLocaleString('fr-FR')}</span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-state small">
                    <p>Aucune notification</p>
                </div>
            )}
        </div>
    )
}







