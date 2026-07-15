import { useState, type FormEvent } from 'react'
import { startNmapScan, getScanHistory } from '../api/chaussec'
import type { NmapScanResult, ScanHistoryItem } from '../types'

export function NmapPage() {
  const [target, setTarget] = useState('')
  const [result, setResult] = useState<NmapScanResult | null>(null)
  const [scans, setScans] = useState<ScanHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleScan = async (e: FormEvent) => {
    e.preventDefault()
    if (!target.trim()) return
    setLoading(true)
    setError('')
    try {
      const data = await startNmapScan(target.trim())
      setResult(data)
      await fetchHistory()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du scan')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const data = await getScanHistory()
      setScans(data)
    } catch {
      // Silently fail for history
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Scan Nmap</h1>
        <p>Effectuez des scans de ports sur des cibles</p>
      </div>

      <form className="scan-form" onSubmit={handleScan}>
        <input
          type="text"
          className="scan-input"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Entrez une IP ou un nom d'hôte (ex: 192.168.1.1)"
          disabled={loading}
        />
        <button type="submit" className="scan-btn" disabled={loading || !target.trim()}>
          {loading ? 'Scanning...' : 'Scanner'}
        </button>
      </form>

      {error && <div className="error-msg" style={{ marginBottom: 20 }}>{error}</div>}

      {result && (
        <div className="dashboard-card" style={{ marginBottom: '24px' }}>
          <h2>
            Résultat du scan
            <span className={`status-badge ${result.status.toLowerCase() === 'success' ? 'success' : 'failed'}`}>
              {result.status}
            </span>
          </h2>
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', marginBottom: '18px', fontSize: '14px' }}>
            <div>
              <div className="stat-card-label" style={{ marginBottom: 4 }}>Cible</div>
              <div className="mono">{result.target}</div>
            </div>
            <div>
              <div className="stat-card-label" style={{ marginBottom: 4 }}>Système</div>
              <div>{result.os || 'Inconnu'}</div>
            </div>
            <div>
              <div className="stat-card-label" style={{ marginBottom: 4 }}>Durée</div>
              <div className="mono">
                {((new Date(result.timestamps.end).getTime() - new Date(result.timestamps.start).getTime()) / 1000).toFixed(2)} s
              </div>
            </div>
          </div>

          <h3 style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Ports détectés
          </h3>
          {result.ports.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>Aucun port ouvert trouvé sur cette cible</div>
          ) : (
            <table className="results-table">
              <thead>
                <tr>
                  <th>Port</th>
                  <th>État</th>
                  <th>Service</th>
                </tr>
              </thead>
              <tbody>
                {result.ports.map((port) => (
                  <tr key={port.port}>
                    <td className="mono">{port.port}</td>
                    <td>
                      <span className={`port-chip ${port.state}`}>
                        <span className="dot" />
                        {port.state}
                      </span>
                    </td>
                    <td>{port.service || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="dashboard-card">
        <h2>Scans récents</h2>
        {scans.length === 0 ? (
          <div className="empty-state">Aucun scan précédent</div>
        ) : (
          <table className="results-table">
            <thead>
              <tr>
                <th>Cible</th>
                <th>Statut</th>
                <th>Ports</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[...scans]
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .slice(0, 10)
                .map((scan) => (
                  <tr key={scan.id}>
                    <td className="mono">{scan.target}</td>
                    <td>
                      <span className={`status-badge ${scan.status.toLowerCase() === 'success' ? 'success' : 'failed'}`}>
                        {scan.status}
                      </span>
                    </td>
                    <td>{scan.portCount}</td>
                    <td>{new Date(scan.startTime).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
