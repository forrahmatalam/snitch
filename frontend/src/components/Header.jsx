import { Link } from './Link'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight">snitch<span className="text-orange-600">.</span></Link>
        {user && <div className="flex items-center gap-4 text-sm"><span className="hidden text-stone-600 sm:block">{user.name}</span><button onClick={logout} className="font-medium text-orange-700 hover:underline">Log out</button></div>}
      </div>
    </header>
  )
}

export default Header
