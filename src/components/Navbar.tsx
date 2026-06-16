import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
  const { authenticated, logout } = useAuth()
  const location = useLocation()

  if (location.pathname === '/login') return null

  return (
    <nav className="navbar">
      <div className="navbar-title">ChausSec SOC</div>
      {authenticated && (
        <>
          <div className="navbar-links">
            <Link
              to="/"
              className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to="/alerts"
              className={`navbar-link ${location.pathname === '/alerts' ? 'active' : ''}`}
            >
              Alertes
            </Link>
            <Link
              to="/history"
              className={`navbar-link ${location.pathname === '/history' ? 'active' : ''}`}
            >
              Historique
            </Link>
            <Link
              to="/nmap"
              className={`navbar-link ${location.pathname === '/nmap' ? 'active' : ''}`}
            >
              Nmap
            </Link>
          </div>
          <div className="navbar-actions">
            <button className="navbar-btn" onClick={logout}>
              DÃ©connexion
            </button>
          </div>
        </>
      )}
    </nav>
  )
}
