import type { NmapScanResult, ScanHistoryItem, SuricataAlert } from '../types'

function getAuthHeader(): string {
  return localStorage.getItem('chaussec_auth') ?? ''
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
      ...options.headers,
    },
  })

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('chaussec_auth')
    window.location.href = '/login'
    throw new Error('Non authentifié')
  }

  if (!res.ok) {
    throw new Error(`Erreur ${res.status}: ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export async function verifyAuth(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch('/chaussec/cki/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      const data = (await res.json()) as { token: string }
      localStorage.setItem('chaussec_auth', `Bearer ${data.token}`)
      return true
    }
    return false
  } catch {
    return false
  }
}

export async function startNmapScan(target: string): Promise<NmapScanResult> {
  return apiFetch<NmapScanResult>(`/chaussec/nmap/scan?target=${encodeURIComponent(target)}`, {
    method: 'POST',
  })
}

export async function getScanHistory(): Promise<ScanHistoryItem[]> {
  return apiFetch<ScanHistoryItem[]>('/chaussec/nmap/scans')
}

export async function getRecentAlerts(): Promise<SuricataAlert[]> {
  const query = {
    query: {
      bool: {
        must: [
          { term: { event_type: 'alert' } },
          { range: { timestamp: { gte: 'now-1h' } } },
        ],
      },
    },
    sort: [{ timestamp: { order: 'desc' } }],
    size: 100,
  }

  const res = await fetch('/opensearch/graylog_*/_search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  })

  if (!res.ok) throw new Error(`OpenSearch ${res.status}`)

  const data = (await res.json()) as { hits: { hits: Array<{ _source: SuricataAlert }> } }
  return data.hits.hits.map((h) => h._source)
}

export function logout(): void {
  localStorage.removeItem('chaussec_auth')
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('chaussec_auth')
}
