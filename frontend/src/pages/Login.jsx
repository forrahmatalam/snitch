import { useCallback, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { Link } from '../components/Link'
import AuthForm from '../components/AuthForm'
import AuthPage from '../components/AuthPage'
import GoogleLoginButton from '../components/GoogleLoginButton'

const Login = () => {
  const { login, loginWithGoogle } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const finishLogin = () => {
    window.history.pushState({}, '', '/dashboard')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const googleLogin = useCallback(async (code) => {
    setBusy(true)
    setError('')
    try {
      await loginWithGoogle(code)
      finishLogin()
    } catch (err) {
      setError(err.details || err.message)
    } finally {
      setBusy(false)
    }
  }, [loginWithGoogle])

  const showGoogleError = useCallback((message) => setError(message), [])

  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    try {
      await login(Object.fromEntries(new FormData(event.currentTarget).entries()))
      finishLogin()
    } catch (err) { setError(err.details || err.message) }
    finally { setBusy(false) }
  }

  return <AuthPage title="Welcome back" description="Sign in to your Snitch account." error={error}>
    <AuthForm mode="login" onSubmit={submit} busy={busy} />
    <div className="my-5 flex items-center gap-3 text-xs text-stone-400"><span className="h-px flex-1 bg-stone-200" />OR<span className="h-px flex-1 bg-stone-200" /></div>
    <GoogleLoginButton onCode={googleLogin} onError={showGoogleError} disabled={busy} />
    <p className="mt-5 text-center text-sm text-stone-600">New here? <Link to="/register" className="font-semibold text-orange-700 hover:underline">Create an account</Link></p>
  </AuthPage>
}

export default Login
