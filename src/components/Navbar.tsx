import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
  const { logout } = useAuth()
  const { pathname } = useLocation()

  const active = (path: string) => pathname === path ? 'active' : ''

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⬡</span>
        <span className="brand-text">ChausSec SOC</span>
      </div>
      <ul className="navbar-links">
        <li><Link to="/" className={active('/')}>Dashboard</Link></li>
        <li><Link to="/nmap" className={active('/nmap')}>Scanner Nmap</Link></li>
        <li><Link to="/history" className={active('/history')}>Historique</Link></li>
        <li><Link to="/alerts" className={active('/alerts')}>Alertes IDS</Link></li>
      </ul>
      <button className="logout-btn" onClick={logout}>Déconnexion</button>
    </nav>
  )
}
