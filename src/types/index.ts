export interface NmapScanResult {
  target: string
  status: string
  openPorts: string[] | null
  rawOutput: string
}

export interface ScanHistoryItem {
  targetIp: string
  status: string
  openPortsCount: number
  scanTime: string
}

export interface SuricataAlert {
  timestamp: string
  src_ip: string
  dest_ip: string
  src_port: number
  dest_port: number
  proto: string
  alert?: {
    signature: string
    category: string
    severity: number
  }
}
