const AuthForm = ({ mode, onSubmit, busy }) => {
  const isRegister = mode === 'register'
  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-4">
      {isRegister && <label className="field">Name<input name="name" required minLength="3" maxLength="50" autoComplete="name" /></label>}
      <label className="field">Email<input name="email" type="email" required autoComplete="email" /></label>
      <label className="field">Password<input name="password" type="password" required minLength="6" autoComplete={isRegister ? 'new-password' : 'current-password'} /></label>
      <button disabled={busy} className="primary-button w-full">{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}</button>
    </form>
  )
}

export default AuthForm
