import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { AlertsPage } from './pages/AlertsPage'
import { HistoryPage } from './pages/HistoryPage'
import { NmapPage } from './pages/NmapPage'

export function App() {
  return (
    <>
      <Navbar />
      <main className="main-layout">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/nmap" element={<NmapPage />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}
