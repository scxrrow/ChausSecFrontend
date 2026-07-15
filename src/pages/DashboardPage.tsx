import { useEffect, useState } from 'react'
import { getRecentAlerts } from '../api/chaussec'
import { GrafanaDashboard } from '../components/GrafanaDashboard'
import type { SuricataAlert } from '../types'

// Get from environment or use defaults
const GRAFANA_URL = import.meta.env.VITE_GRAFANA_URL || '/grafana'
const GRAFANA_DASHBOARD_UID = import.meta.env.VITE_GRAFANA_DASHBOARD_UID || 'chaussec-soc'

export function DashboardPage() {
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
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble de la sécurité</p>
      </div>

      <div className="dashboard-grid">
        {/* Grafana Dashboard - Full width */}
        <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
          <h2>Dashboard Grafana</h2>
          <GrafanaDashboard 
            dashboardUid={GRAFANA_DASHBOARD_UID} 
            dashboardUrl={GRAFANA_URL}
            height="700px"
          />
        </div>

        {/* Recent Alerts */}
        <div className="dashboard-card">
          <h2>Alertes récentes</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : error ? (
            <p style={{ color: '#ef4444' }}>{error}</p>
          ) : alerts.length === 0 ? (
            <p>Aucune alerte récente</p>
          ) : (
            <div>
              {alerts.slice(0, 5).map((alert, index) => (
                <div key={index} className="alert-item">
                  <span className={`alert-severity ${alert.alert.severity.toLowerCase()}`}>
                    {alert.alert.severity}
                  </span>
                  <span style={{ marginLeft: '12px' }}>{alert.alert.signature}</span>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}>
                    {alert.src_ip}:{alert.src_port} → {alert.dest_ip}:{alert.dest_port}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
