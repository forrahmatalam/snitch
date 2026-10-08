import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { Link } from '../components/Link'
import AuthForm from '../components/AuthForm'
import AuthPage from '../components/AuthPage'

const Register = () => {
  const { register } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    try {
      await register(Object.fromEntries(new FormData(event.currentTarget).entries()))
      window.history.pushState({}, '', '/dashboard'); window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (err) { setError(err.details || err.message) }
    finally { setBusy(false) }
  }

  return <AuthPage title="Create account" description="Register with the details below." error={error}>
    <AuthForm mode="register" onSubmit={submit} busy={busy} />
    <p className="mt-5 text-center text-sm text-stone-600">Already registered? <Link to="/login" className="font-semibold text-orange-700 hover:underline">Log in</Link></p>
    <p className="mt-4 rounded-lg bg-stone-50 p-3 text-xs leading-5 text-stone-500">The current register API creates a regular user account. Seller accounts are not created through this API.</p>
  </AuthPage>
}

export default Register
