import { Navigate }                        from 'react-router-dom'
import { getToken, getUser,
        getDashboardPathByRole }           from '../utils/authStorage'

export default function PrivateRoute({ children, requiredType }) {
    const token = getToken()
    const user  = getUser()

    // pas de token → login
    if (!token) {
        return <Navigate to="/login" replace />
    }

    // rôle depuis localStorage directement ✅
    const role = user?.role

    // mauvais rôle → son dashboard
    if (requiredType && role !== requiredType) {
        return <Navigate to={getDashboardPathByRole(role)} replace />
    }

    return children
}