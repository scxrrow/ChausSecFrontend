import { useEffect, useState } from 'react'
import { getRecentAlerts, getScanHistory } from '../api/chaussec'
import { GrafanaDashboard } from '../components/GrafanaDashboard'
import type { ScanHistoryItem, SuricataAlert } from '../types'
import { severityLabel } from '../utils'

// Get from environment or use defaults
const GRAFANA_URL = import.meta.env.VITE_GRAFANA_URL || '/grafana'
const GRAFANA_DASHBOARD_UID = import.meta.env.VITE_GRAFANA_DASHBOARD_UID || 'chaussec-soc'

export function DashboardPage() {
  const [alerts, setAlerts] = useState<SuricataAlert[]>([])
  const [scans, setScans] = useState<ScanHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsData, scansData] = await Promise.allSettled([
          getRecentAlerts(),
          getScanHistory(),
        ])
        if (alertsData.status === 'fulfilled') setAlerts(alertsData.value)
        else setError(alertsData.reason instanceof Error ? alertsData.reason.message : 'Erreur lors du chargement des alertes')
        if (scansData.status === 'fulfilled') setScans(scansData.value)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const highSeverityCount = alerts.filter((a) =>
    ['high', 'critical'].includes(severityLabel(a.alert_severity))
  ).length
  const openPortsTotal = scans.reduce((sum, s) => sum + (s.portCount || 0), 0)
  const failedScans = scans.filter((s) => s.status?.toLowerCase() === 'failed').length

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble de la sécurité du réseau</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Alertes (1h)</span>
            <span className="stat-card-icon accent">🛰</span>
          </div>
          <span className="stat-card-value">{loading ? '—' : alerts.length}</span>
          <span className="stat-card-sub">détectées par Suricata</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Sévérité haute</span>
            <span className="stat-card-icon danger">⚠</span>
          </div>
          <span className="stat-card-value">{loading ? '—' : highSeverityCount}</span>
          <span className="stat-card-sub">à examiner en priorité</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Scans (24h)</span>
            <span className="stat-card-icon accent">🔍</span>
          </div>
          <span className="stat-card-value">{loading ? '—' : scans.length}</span>
          <span className="stat-card-sub">{failedScans > 0 ? `${failedScans} échoué(s)` : 'tous réussis'}</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Ports ouverts</span>
            <span className="stat-card-icon success">🔓</span>
          </div>
          <span className="stat-card-value">{loading ? '—' : openPortsTotal}</span>
          <span className="stat-card-sub">cumulés sur les scans récents</span>
        </div>
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
        <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
          <h2>Alertes récentes</h2>
          {loading ? (
            <p className="loading-state">Chargement...</p>
          ) : error ? (
            <p className="error-msg" style={{ maxWidth: 480 }}>{error}</p>
          ) : alerts.length === 0 ? (
            <div className="empty-state">Aucune alerte récente</div>
          ) : (
            <div>
              {alerts.slice(0, 5).map((alert, index) => (
                <div key={index} className="alert-item">
                  <span className={`alert-severity ${severityLabel(alert.alert_severity)}`}>
                    {severityLabel(alert.alert_severity)}
                  </span>
                  <span style={{ marginLeft: '12px', fontWeight: 600 }}>{alert.alert_signature}</span>
                  <div className="alert-meta">
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
