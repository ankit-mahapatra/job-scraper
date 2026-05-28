import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">💼 JobScraper</h1>
      <div className="flex gap-6 items-center">
        <Link to="/dashboard" className="hover:text-blue-200 font-medium">Dashboard</Link>
        <Link to="/history" className="hover:text-blue-200 font-medium">History</Link>
        <Link to="/profile" className="hover:text-blue-200 font-medium">Profile</Link>
        <span className="text-blue-200">Hi, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}