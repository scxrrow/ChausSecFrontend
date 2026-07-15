import { useEffect, useState } from 'react'
import { getRecentAlerts } from '../api/chaussec'
import type { SuricataAlert } from '../types'

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

  return (
    <div className="page">
      <div className="page-header">
        <h1>Alertes Suricata</h1>
        <p>Dernières alertes de sécurité détectées</p>
      </div>

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
                <span className={`alert-severity ${alert.alert.severity.toLowerCase()}`}>
                  {alert.alert.severity}
                </span>
                <span style={{ fontWeight: 600 }}>{alert.alert.signature}</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                {alert.alert.category}
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
