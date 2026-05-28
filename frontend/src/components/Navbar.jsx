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
    <nav style={{ background: '#2563eb', color: 'white', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>💼 JobScraper</h1>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
          <Link to="/history" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>History</Link>
          <Link to="/profile" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Profile</Link>
          <span style={{ color: '#bfdbfe', fontSize: '14px' }}>Hi, {user?.name}</span>
          <button onClick={handleLogout}
            style={{ background: 'white', color: '#2563eb', padding: '6px 16px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="mobile-dropdown" style={{ background: '#1d4ed8', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
          <Link to="/history" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>History</Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Profile</Link>
          <span style={{ color: '#bfdbfe', fontSize: '14px' }}>Hi, {user?.name}</span>
          <button onClick={handleLogout}
            style={{ background: 'white', color: '#2563eb', padding: '8px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-dropdown { display: none !important; }
        }
      `}</style>
    </nav>
  )
}