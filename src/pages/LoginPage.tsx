import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyAuth } from '../api/chaussec'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const ok = await verifyAuth(username, password)
      if (ok) {
        login()
        navigate('/')
      } else {
        setError('Identifiants invalides')
      }
    } catch {
      setError('Impossible de contacter le serveur API (port 5050)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">⬡</span>
          <h1>ChausSec SOC</h1>
          <p>Security Operations Center</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Utilisateur</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="superadmin"
              required
              autoFocus
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
