import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { Link } from '../components/Link'
import AuthForm from '../components/AuthForm'
import AuthPage from '../components/AuthPage'

const Login = () => {
  const { login } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    try {
      await login(Object.fromEntries(new FormData(event.currentTarget).entries()))
      window.history.pushState({}, '', '/dashboard'); window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (err) { setError(err.details || err.message) }
    finally { setBusy(false) }
  }

  return <AuthPage title="Welcome back" description="Sign in to your Snitch account." error={error}>
    <AuthForm mode="login" onSubmit={submit} busy={busy} />
    <p className="mt-5 text-center text-sm text-stone-600">New here? <Link to="/register" className="font-semibold text-orange-700 hover:underline">Create an account</Link></p>
  </AuthPage>
}

export default Login
