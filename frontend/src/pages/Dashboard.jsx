import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import ProductForm from '../components/ProductForm'

const Dashboard = () => {
  const { user, role } = useAuth()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  return <>
    {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
    {message && <div role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-2xl bg-stone-900 p-7 text-white sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">Account</p>
        <h1 className="mt-3 text-3xl font-bold">Hi, {user.name}</h1><p className="mt-2 break-all text-stone-300">{user.email}</p>
        <div className="mt-8 border-t border-white/15 pt-5"><p className="text-sm text-stone-400">Account type</p><p className="mt-1 font-medium capitalize">{role}</p></div>
      </section>
      {role === 'seller' ? <ProductForm onMessage={setMessage} onError={setError} /> : (
        <section className="flex min-h-64 flex-col justify-center rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Seller tools</p>
          <h2 className="mt-2 text-2xl font-bold">Product creation is for sellers</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-stone-600">Your account is a regular user. The current register API creates regular users only, so it does not provide a way to register as a seller.</p>
        </section>
      )}
    </div>
  </>
}

export default Dashboard
