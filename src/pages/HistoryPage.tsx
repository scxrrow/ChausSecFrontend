import { useEffect, useState } from 'react'
import { getScanHistory } from '../api/chaussec'
import type { ScanHistoryItem } from '../types'

export function HistoryPage() {
  const [scans, setScans] = useState<ScanHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getScanHistory()
        setScans(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return 'running'
      case 'success':
      case 'completed':
        return 'success'
      case 'failed':
        return 'failed'
      default:
        return 'completed'
    }
  }

  const formatDuration = (start?: string, end?: string) => {
    if (!start || !end) return '—'
    const ms = new Date(end).getTime() - new Date(start).getTime()
    if (!Number.isFinite(ms) || ms < 0) return '—'
    return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`
  }

  const sortedScans = [...scans].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>Historique des scans</h1>
        <p>Liste des scans Nmap effectués sur les dernières 24 heures</p>
      </div>

      {loading ? (
        <p className="loading-state">Chargement...</p>
      ) : error ? (
        <p className="error-msg" style={{ maxWidth: 480 }}>{error}</p>
      ) : scans.length === 0 ? (
        <div className="empty-state">Aucun scan trouvé pour le moment</div>
      ) : (
        <table className="results-table">
          <thead>
            <tr>
              <th>Cible</th>
              <th>Statut</th>
              <th>Ports ouverts</th>
              <th>Durée</th>
              <th>Début</th>
            </tr>
          </thead>
          <tbody>
            {sortedScans.map((scan) => (
              <tr key={scan.id}>
                <td className="mono">{scan.target || '—'}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(scan.status)}`}>
                    {scan.status}
                  </span>
                </td>
                <td>
                  {scan.portCount > 0 ? (
                    <span className="port-chip open">
                      <span className="dot" />
                      {scan.portCount} ouvert{scan.portCount > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="muted">Aucun</span>
                  )}
                </td>
                <td className="mono">{formatDuration(scan.startTime, scan.endTime)}</td>
                <td>{scan.startTime ? new Date(scan.startTime).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
