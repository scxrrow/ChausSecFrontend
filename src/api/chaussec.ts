import type { NmapScanResult, ScanHistoryItem, SuricataAlert } from '../types'

const AUTH_KEY = 'chaussec_auth'

function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_KEY)
}

function getBearerToken(): string | null {
  const raw = getAuthToken()
  if (!raw) return null
  if (raw.startsWith('Bearer ')) return raw
  return `Bearer ${raw}`
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const bearer = getBearerToken()
  if (bearer) {
    headers['Authorization'] = bearer
  }

  if (options.headers) {
    const extra = options.headers as Record<string, string>
    for (const key of Object.keys(extra)) {
      headers[key] = extra[key]
    }
  }

  const res = await fetch(path, {
    ...options,
    headers,
  })

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem(AUTH_KEY)
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
    throw new Error('Non authentifié')
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `Erreur ${res.status}: ${res.statusText}`)
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
      if (!data.token) return false
      localStorage.setItem(AUTH_KEY, `Bearer ${data.token}`)
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
  localStorage.removeItem(AUTH_KEY)
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}
