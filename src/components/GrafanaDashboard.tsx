import { useEffect, useRef, useState } from 'react'

interface GrafanaDashboardProps {
  dashboardUid: string
  dashboardUrl?: string
  height?: string
}

export function GrafanaDashboard({ 
  dashboardUid,
  dashboardUrl = 'http://localhost:3000',
  height = '600px' 
}: GrafanaDashboardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    // Build the Grafana embed URL
    // With anonymous access enabled, we can embed without auth
    const src = `${dashboardUrl}/d/${dashboardUid}?orgId=1&kiosk`
    
    if (iframeRef.current) {
      iframeRef.current.src = src
    }
  }, [dashboardUid, dashboardUrl])

  return (
    <div style={{ width: '100%', height, border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
      {error ? (
        <div style={{ padding: '20px', color: '#ef4444' }}>
          {error}
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Grafana Dashboard"
          allowFullScreen
        />
      )}
    </div>
  )
}
