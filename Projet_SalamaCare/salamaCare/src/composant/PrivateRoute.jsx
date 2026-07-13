import { Navigate } from 'react-router-dom'
import { getDashboardPathByRole, getRoleFromToken, getToken, getUser } from '../utils/authStorage'

export default function PrivateRoute({ children, requiredType }) {
  const userToken = getToken()
  const userType = getRoleFromToken(userToken, getUser()?.role)
  
  if (!userToken) {
    return <Navigate to="/login" replace />
  }

  if (requiredType && userType !== requiredType) {
    return <Navigate to={getDashboardPathByRole(userType)} replace />
  }
  
  return children
}
