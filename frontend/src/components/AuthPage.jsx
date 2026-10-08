const AuthPage = ({ title, description, error, children }) => {
  return <section className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Your account</p>
    <h1 className="text-3xl font-bold">{title}</h1><p className="mt-2 text-sm text-stone-600">{description}</p>
    {error && <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
    {children}
  </section>
}

export default AuthPage
