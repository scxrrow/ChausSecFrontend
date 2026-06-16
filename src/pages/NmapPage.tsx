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

      {error && <div className="error-msg">{error}</div>}

      {result && (
        <div className="dashboard-card" style={{ marginTop: '24px' }}>
          <h2>Résultat du scan</h2>
          <p><strong>Cible:</strong> {result.target}</p>
          <p><strong>Statut:</strong> {result.status}</p>
          <p><strong>OS:</strong> {result.os || 'Inconnu'}</p>
          
          <h3 style={{ marginTop: '16px' }}>Ports ouverts:</h3>
          {result.ports.length === 0 ? (
            <p>Aucun port ouvert trouvé</p>
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
                    <td>{port.port}</td>
                    <td>{port.state}</td>
                    <td>{port.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="dashboard-card" style={{ marginTop: '24px' }}>
        <h2>Historique des scans</h2>
        {scans.length === 0 ? (
          <p>Aucun scan précédent</p>
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
              {scans.slice(0, 10).map((scan) => (
                <tr key={scan.id}>
                  <td>{scan.target}</td>
                  <td>{scan.status}</td>
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
