import { useEffect, useState } from 'react'
import Header from './components/Header'
import { Link } from './components/Link'
import { useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  const { user, loading } = useAuth()
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname)
    window.addEventListener('popstate', updatePath)
    return () => window.removeEventListener('popstate', updatePath)
  }, [])

  let page
  if (loading) page = <p className="text-center text-sm text-stone-500">Loading account…</p>
  else if (user) page = <Dashboard />
  else if (path === '/register') page = <Register />
  else if (path === '/login') page = <Login />
  else page = <section className="mx-auto max-w-xl py-12 text-center">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Snitch account</p>
    <h1 className="mt-3 text-4xl font-bold">Welcome to Snitch</h1>
    <p className="mt-3 text-stone-600">Log in or create an account to continue.</p>
    <div className="mt-7 flex justify-center gap-3"><Link to="/login" className="primary-button">Log in</Link><Link to="/register" className="rounded-[.65rem] border border-stone-300 bg-white px-4 py-3 font-semibold hover:bg-stone-100">Register</Link></div>
  </section>

  return <main className="min-h-screen bg-stone-50 text-stone-900"><Header /><div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">{page}</div></main>
}

export default App
