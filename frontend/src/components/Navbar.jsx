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
    <nav style={{ background: '#2563eb', color: 'white', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>💼 JobScraper</h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', paddingBottom: '8px' }}>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
          <Link to="/history" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>History</Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Profile</Link>
          <span style={{ color: '#bfdbfe' }}>Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            style={{ background: 'white', color: '#2563eb', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', width: '100%' }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}