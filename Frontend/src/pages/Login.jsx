import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import StudentSignupForm from '../components/auth/StudentSignupForm'
import useAuth from '../hooks/useAuth'
import {
  checkApiHealth,
  loginUser,
  submitStudentSignupRequest
} from '../services/authService'

const MODE_LOGIN = 'login'
const MODE_SIGNUP = 'signup'

export default function Login() {
  const { login } = useAuth()
  const [mode, setMode] = useState(MODE_LOGIN)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [serverReady, setServerReady] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    checkApiHealth().then((isReady) => {
      if (!active) {
        return
      }

      setServerReady(isReady)
    })

    return () => {
      active = false
    }
  }, [])

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    setMessage('')
  }

  const handleLoginSubmit = async ({ email, password }) => {
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const data = await loginUser({ email, password })
      login(data.user)
      navigate(data.user?.role === 'admin' ? '/admin' : '/')
      return true
    } catch (err) {
      setError(err.message || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleStudentSignupSubmit = async ({ name, email, password }) => {
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const data = await submitStudentSignupRequest({ name, email, password })
      setMessage(data.message || 'Signup request submitted. Wait for admin approval.')
      setMode(MODE_LOGIN)
      return true
    } catch (err) {
      setError(err.message || 'Signup request failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-sky-100">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-3xl font-bold text-sky-700">CampusCart</h1>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              serverReady === true
                ? 'bg-emerald-100 text-emerald-700'
                : serverReady === false
                ? 'bg-rose-100 text-rose-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {serverReady === true ? 'Mongo Connected' : serverReady === false ? 'API Offline' : 'Checking API'}
          </span>
        </div>

        <p className="text-gray-600 mb-6">
          {mode === MODE_LOGIN
            ? 'Sign in to continue to your account.'
            : 'Create a student account request. Admin approval is required before login.'}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => switchMode(MODE_LOGIN)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
              mode === MODE_LOGIN ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode(MODE_SIGNUP)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
              mode === MODE_SIGNUP
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Student Signup
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {mode === MODE_LOGIN ? (
          <LoginForm
            onSubmit={handleLoginSubmit}
            loading={loading}
            disabled={serverReady === false}
          />
        ) : (
          <StudentSignupForm
            onSubmit={handleStudentSignupSubmit}
            loading={loading}
            disabled={serverReady === false}
          />
        )}
      </div>
    </div>
  )
}
