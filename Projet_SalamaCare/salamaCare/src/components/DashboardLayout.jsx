import { SideBar } from '../composant/SideBar'
import NavBarResponsable from '../composant/NavBarResponsable'

export function DashboardLayout({ activeSection, onSelectSection, onSignOut, searchValue, onSearchChange, notifications, messages, children, toasts }) {
  return (
    <div className='responsable-dashboard'>
      <SideBar
        activeSection={activeSection}
        onSelectSection={onSelectSection}
        onSignOut={onSignOut}
      />

      <div className='main-content'>
        <NavBarResponsable
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          notifications={notifications}
          messages={messages}
        />
        <div className='section-content'>
          {children}
        </div>

        <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 1200 }}>
          {toasts.map((t) => (
            <div key={t.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.12)', padding: 12, marginBottom: 8, borderRadius: 6, minWidth: 280, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <div style={{ marginBottom: 8 }}>{t.message}</div>
              {t.actions && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  {t.actions.map((a, idx) => (
                    <button key={idx} onClick={a.onClick} style={{ padding: '6px 10px', borderRadius: 4, border: 'none', cursor: 'pointer', background: idx === 0 ? '#0b74de' : '#e0e0e0', color: idx === 0 ? '#fff' : '#000' }}>{a.label}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
