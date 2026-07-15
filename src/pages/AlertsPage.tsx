import { useEffect, useState } from 'react'
import { getRecentAlerts } from '../api/chaussec'
import type { SuricataAlert } from '../types'
import { severityLabel } from '../utils'

export function AlertsPage() {
  const [alerts, setAlerts] = useState<SuricataAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getRecentAlerts()
        setAlerts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  const counts = alerts.reduce(
    (acc, a) => {
      acc[severityLabel(a.alert_severity)]++
      return acc
    },
    { critical: 0, high: 0, medium: 0, low: 0 } as Record<string, number>
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>Alertes Suricata</h1>
        <p>Dernières alertes de sécurité détectées (1 heure)</p>
      </div>

      {!loading && alerts.length > 0 && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Total</span>
              <span className="stat-card-icon accent">🛰</span>
            </div>
            <span className="stat-card-value">{alerts.length}</span>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Haute</span>
              <span className="stat-card-icon danger">⚠</span>
            </div>
            <span className="stat-card-value">{counts.critical + counts.high}</span>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Moyenne</span>
              <span className="stat-card-icon warning">◐</span>
            </div>
            <span className="stat-card-value">{counts.medium}</span>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Basse</span>
              <span className="stat-card-icon success">●</span>
            </div>
            <span className="stat-card-value">{counts.low}</span>
          </div>
        </div>
      )}

      {loading ? (
        <p className="loading-state">Chargement...</p>
      ) : error ? (
        <p className="error-msg" style={{ maxWidth: 480 }}>{error}</p>
      ) : alerts.length === 0 ? (
        <div className="empty-state">Aucune alerte trouvée</div>
      ) : (
        <div>
          {alerts.map((alert, index) => (
            <div key={index} className="alert-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`alert-severity ${severityLabel(alert.alert_severity)}`}>
                  {severityLabel(alert.alert_severity)}
                </span>
                <span style={{ fontWeight: 600 }}>{alert.alert_signature}</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                {alert.alert_category}
              </div>
              <div className="alert-meta">
                {new Date(alert.timestamp).toLocaleString()} · {alert.proto} · {alert.src_ip}:{alert.src_port} → {alert.dest_ip}:{alert.dest_port}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
