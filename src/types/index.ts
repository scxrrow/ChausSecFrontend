export interface NmapScanResult {
  target: string
  status: string
  ports: Array<{
    port: number
    state: string
    service: string
  }>
  os?: string
  timestamps: {
    start: string
    end: string
  }
}

export interface ScanHistoryItem {
  id: string
  target: string
  status: string
  startTime: string
  endTime: string
  portCount: number
}

export interface SuricataAlert {
  timestamp: string
  event_type: string
  alert_signature: string
  alert_severity: number | string
  alert_category: string
  src_ip: string
  src_port: number
  dest_ip: string
  dest_port: number
  proto: string
}

export interface AuthResponse {
  token: string
}
