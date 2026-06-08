import { useState, type FormEvent } from 'react'
import { startNmapScan } from '../api/chaussec'
import type { NmapScanResult } from '../types'

export function NmapPage() {
  const [target, setTarget] = useState('')
  const [result, setResult] = useState<NmapScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleScan = async (e: FormEvent) => {
    e.preventDefault()
    if (!target.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await startNmapScan(target.trim())
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du scan')
    } finally {
      setLoading(false)
    }
  }

  const successClass = result?.status === 'success' ? 'success' : 'error'

  return (
    <div className="page">
      <h2 className="page-title">Scanner Nmap</h2>

      <div className="scan-card">
        <form onSubmit={handleScan} className="scan-form">
          <div className="scan-input-row">
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Cible : 192.168.1.1 ou hostname.local"
              className="scan-input"
              required
              disabled={loading}
            />
            <button type="submit" className="scan-btn" disabled={loading}>
              {loading ? <><span className="spinner" /> Scan en cours...</> : 'Lancer le scan'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="scan-progress">
            <div className="progress-bar" />
            <p>nmap en cours sur <strong>{target}</strong>…</p>
          </div>
        )}

        {error && <div className="error-msg" style={{ marginTop: 16 }}>{error}</div>}

        {result && (
          <div className="scan-result">
            <div className="result-header">
              <span className={`status-badge ${successClass}`}>{result.status}</span>
              <span className="result-target">{result.target}</span>
            </div>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Ports ouverts</span>
                <span className="result-value">
                  {result.openPorts && result.openPorts.length > 0
                    ? result.openPorts.join(', ')
                    : 'Aucun port détecté'}
                </span>
              </div>
            </div>
            {result.rawOutput && (
              <details className="raw-output">
                <summary>Sortie brute (XML nmap)</summary>
                <pre>{result.rawOutput}</pre>
              </details>
            )}
          </div>
        )}
      </div>

      <div className="nmap-info">
        <h3>Commande exécutée côté API</h3>
        <code>nmap -sV -oX - &lt;cible&gt;</code>
        <p>Détecte les services et versions sur tous les ports ouverts. Les métriques sont envoyées à InfluxDB.</p>
      </div>
    </div>
  )
}
