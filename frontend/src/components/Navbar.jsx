import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">💼 JobScraper</h1>
        <button
          className="text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-3 mt-4 pb-2">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 font-medium">Dashboard</Link>
          <Link to="/history" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 font-medium">History</Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 font-medium">Profile</Link>
          <span className="text-blue-200">Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition w-full"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}