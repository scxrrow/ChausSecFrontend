const GRAFANA = import.meta.env.VITE_GRAFANA_URL || 'http://localhost:3000'
const UID = import.meta.env.VITE_GRAFANA_DASHBOARD_UID || 'chaussec-soc'

function GrafanaPanel({ panelId, title, from = 'now-1h', full = false }: {
  panelId: number
  title: string
  from?: string
  full?: boolean
}) {
  const src = `${GRAFANA}/d-solo/${UID}/dashboard?panelId=${panelId}&orgId=1&from=${from}&to=now&refresh=5s&theme=dark`
  return (
    <div className={`panel${full ? ' panel-full' : ''}`}>
      <h3 className="panel-title">{title}</h3>
      <iframe src={src} title={title} className="grafana-iframe" />
    </div>
  )
}

export function DashboardPage() {
  return (
    <div className="page">
      <h2 className="page-title">Dashboard de Supervision</h2>
      <div className="panels-grid">
        <GrafanaPanel panelId={1} title="Trafic HTTP Prometheus" />
        <GrafanaPanel panelId={2} title="Détections IDS (Suricata)" />
        <GrafanaPanel panelId={3} title="Scans Nmap — Ports Ouverts (10h)" from="now-10h" full />
      </div>
      <div className="grafana-link">
        <a href={`${GRAFANA}/d/${UID}`} target="_blank" rel="noreferrer">
          Ouvrir Grafana complet →
        </a>
      </div>
    </div>
  )
}
