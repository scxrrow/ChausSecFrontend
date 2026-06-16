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
      case 'completed':
        return 'completed'
      case 'failed':
        return 'failed'
      default:
        return 'completed'
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Historique des scans</h1>
        <p>Liste des scans Nmap effectués</p>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>{error}</p>
      ) : scans.length === 0 ? (
        <p>Aucun scan trouvé</p>
      ) : (
        <table className="results-table">
          <thead>
            <tr>
              <th>Cible</th>
              <th>Statut</th>
              <th>Ports ouverts</th>
              <th>Début</th>
              <th>Fin</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.id}>
                <td>{scan.target}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(scan.status)}`}>
                    {scan.status}
                  </span>
                </td>
                <td>{scan.portCount}</td>
                <td>{new Date(scan.startTime).toLocaleString()}</td>
                <td>{scan.endTime ? new Date(scan.endTime).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
