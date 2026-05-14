import { Navigate, Link, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-amber-900 mb-2">Access Restricted</h1>
          <p className="text-amber-800 mb-6">
            Your account role does not have access to this page.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 transition"
            >
              Go Home
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Open Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return children
}
