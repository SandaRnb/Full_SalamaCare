import { Navigate, Routes, Route } from 'react-router-dom'
import Login from './composant/login'
import Dashboard from './Dashboard'
import PatientDashboard from './composant/PatientDashboard'
import PrivateRoute from './composant/PrivateRoute'
import DashboardScreen from '../../../MediConsult/src/screens/DashboardScreen'

export default function AppRouter() {
  return (
    <Routes>
      {/* Route publique - Authentification unique */}
      <Route path="/login" element={<Login />} />
      
      {/* Routes protégées - Responsable */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute requiredType="responsable">
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      {/* Routes protégées - Patient */}
      <Route 
        path="/dashboard/patient" 
        element={
          <PrivateRoute requiredType="patient">
            <PatientDashboard/>
          </PrivateRoute>
        } 
      />

      {/* Routes protégées - Médecin */}
      <Route 
        path="/dashboard/medecin" 
        element={
          <PrivateRoute requiredType="medecin">
            <DashboardScreen/>
          </PrivateRoute>
        } 
      />
      
      {/* Redirection par défaut */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Route 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

