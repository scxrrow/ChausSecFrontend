import { useState, useEffect, useCallback } from 'react'
import { getRecentAlerts } from '../api/chaussec'
import type { SuricataAlert } from '../types'

const GRAFANA = import.meta.env.VITE_GRAFANA_URL || 'http://localhost:3000'
const GRAYLOG = 'http://localhost:9000'

function severityClass(s?: number) {
  if (!s) return ''
  if (s === 1) return 'sev-critical'
  if (s === 2) return 'sev-high'
  if (s === 3) return 'sev-medium'
  return 'sev-low'
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('fr-FR')
}

export function AlertsPage() {
  const [alerts, setAlerts] = useState<SuricataAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getRecentAlerts()
      setAlerts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de requêter OpenSearch')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetchAlerts() }, [fetchAlerts])

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Alertes IDS — Suricata (1h)</h2>
        <div className="header-actions">
          <a href={GRAYLOG} target="_blank" rel="noreferrer" className="ext-link">
            Ouvrir Graylog →
          </a>
          <a
            href={`${GRAFANA}/d/chaussec-soc/dashboard?panelId=2&from=now-1h&to=now`}
            target="_blank"
            rel="noreferrer"
            className="ext-link"
          >
            Panel Grafana →
          </a>
          <button onClick={() => void fetchAlerts()} className="refresh-btn" disabled={loading}>
            {loading ? 'Chargement…' : '↻ Actualiser'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-msg">
          {error}
          <br />
          <small>Vérifiez que Graylog/OpenSearch est démarré et que des événements Suricata ont été reçus.</small>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="alerts-summary">
            <div className="summary-item">
              <span className="summary-count">{alerts.length}</span>
              <span className="summary-label">alertes (1h)</span>
            </div>
            <div className="summary-item">
              <span className="summary-count sev-critical">
                {alerts.filter((a) => a.alert?.severity === 1).length}
              </span>
              <span className="summary-label">critiques</span>
            </div>
            <div className="summary-item">
              <span className="summary-count sev-high">
                {alerts.filter((a) => a.alert?.severity === 2).length}
              </span>
              <span className="summary-label">hautes</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Heure</th>
                  <th>Sévérité</th>
                  <th>Signature</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Proto</th>
                </tr>
              </thead>
              <tbody>
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-row">Aucune alerte détectée dans la dernière heure</td>
                  </tr>
                ) : (
                  alerts.map((a, i) => (
                    <tr key={i}>
                      <td className="mono">{formatDate(a.timestamp)}</td>
                      <td>
                        {a.alert?.severity ? (
                          <span className={`status-badge ${severityClass(a.alert.severity)}`}>
                            {['', 'CRITIQUE', 'HAUTE', 'MOYENNE', 'FAIBLE'][a.alert.severity] ?? a.alert.severity}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="signature">{a.alert?.signature ?? '—'}</td>
                      <td className="mono">{a.src_ip}{a.src_port ? `:${a.src_port}` : ''}</td>
                      <td className="mono">{a.dest_ip}{a.dest_port ? `:${a.dest_port}` : ''}</td>
                      <td className="mono">{a.proto ?? '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
