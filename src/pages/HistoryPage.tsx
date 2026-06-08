import { useState, useEffect, useCallback } from 'react'
import { getScanHistory } from '../api/chaussec'
import type { ScanHistoryItem } from '../types'

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('fr-FR')
}

export function HistoryPage() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getScanHistory()
      setHistory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetchHistory() }, [fetchHistory])

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Historique des scans (10h)</h2>
        <button onClick={() => void fetchHistory()} className="refresh-btn" disabled={loading}>
          {loading ? 'Chargement…' : '↻ Actualiser'}
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Heure du scan</th>
                <th>Cible IP</th>
                <th>Statut</th>
                <th>Ports ouverts</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-row">Aucun scan dans les 10 dernières heures</td>
                </tr>
              ) : (
                history.map((item, i) => (
                  <tr key={i}>
                    <td className="mono">{formatDate(item.scanTime)}</td>
                    <td className="mono">{item.targetIp || '—'}</td>
                    <td>
                      <span className={`status-badge ${item.status === 'success' ? 'success' : 'error'}`}>
                        {item.status || '—'}
                      </span>
                    </td>
                    <td className="mono center">{item.openPortsCount ?? '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
