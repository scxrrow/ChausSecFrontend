import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navbar } from './components/Navbar'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { NmapPage } from './pages/NmapPage'
import { HistoryPage } from './pages/HistoryPage'
import { AlertsPage } from './pages/AlertsPage'

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  )
}

function Protected({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Protected><DashboardPage /></Protected>} />
          <Route path="/nmap" element={<Protected><NmapPage /></Protected>} />
          <Route path="/history" element={<Protected><HistoryPage /></Protected>} />
          <Route path="/alerts" element={<Protected><AlertsPage /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
