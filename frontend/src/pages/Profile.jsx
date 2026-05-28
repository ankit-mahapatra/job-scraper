import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '', profileImage: '', resume: '' })
  const [message, setMessage] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get('https://job-scraper-backend-4tbb.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data)
    } catch (err) { console.log(err) }
  }

  const handleUpdate = async () => {
    try {
      await axios.put('https://job-scraper-backend-4tbb.onrender.com/api/profile', user, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showMessage('✅ Profile updated successfully!')
    } catch (err) { console.log(err) }
  }

  const handleImageUpload = async () => {
    if (!imageFile) return alert('Please select an image!')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      const res = await axios.post('https://job-scraper-backend-4tbb.onrender.com/api/profile/image', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      setUser(res.data)
      showMessage('✅ Profile image uploaded!')
    } catch (err) { console.log(err) }
    setUploading(false)
  }

  const handleDeleteImage = async () => {
    if (!window.confirm('Delete profile image?')) return
    try {
      const res = await axios.delete('https://job-scraper-backend-4tbb.onrender.com/api/profile/image', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data)
      showMessage('🗑️ Image deleted!')
    } catch (err) { console.log(err) }
  }

  const handleResumeUpload = async () => {
    if (!resumeFile) return alert('Please select a PDF!')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      await axios.post('https://job-scraper-backend-4tbb.onrender.com/api/profile/resume', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      showMessage('✅ Resume uploaded!')
      fetchProfile()
    } catch (err) { console.log(err) }
    setUploading(false)
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account!')) return
    try {
      await axios.delete('https://job-scraper-backend-4tbb.onrender.com/api/profile/account', {
        headers: { Authorization: `Bearer ${token}` }
      })
      localStorage.clear()
      navigate('/signup')
    } catch (err) { console.log(err) }
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const card = { background: 'white', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #dbeafe', padding: '24px', marginBottom: '16px' }
  const input = { width: '100%', border: '1px solid #d1d5db', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }
  const btn = { background: '#2563eb', color: 'white', padding: '11px', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '14px', width: '100%' }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {message && (
          <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', border: '1px solid #bbf7d0' }}>
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div style={card}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', marginBottom: '20px' }}>👤 My Profile</h2>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #bfdbfe' }} />
            ) : (
              <div style={{ width: '88px', height: '88px', background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '36px', fontWeight: 'bold' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
                style={{ fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '4px 8px' }} />
              <button onClick={handleImageUpload}
                style={{ background: '#2563eb', color: 'white', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                Upload
              </button>
              {user.profileImage && (
                <button onClick={handleDeleteImage}
                  style={{ background: '#ef4444', color: 'white', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                  Delete
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Full Name</label>
              <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} style={input} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Email</label>
              <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} style={input} />
            </div>
            <button onClick={handleUpdate} style={btn}>Update Profile</button>
          </div>
        </div>

        {/* Resume Card */}
        <div style={card}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', marginBottom: '16px' }}>📄 Resume</h2>
          {user.resume && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>📄</span>
              <div>
                <p style={{ fontWeight: '600', color: '#16a34a', margin: 0 }}>Resume Uploaded!</p>
                <button onClick={() => window.open(user.resume, '_blank')}
                  style={{ color: '#2563eb', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                  View Resume
                </button>
              </div>
            </div>
          )}
          <div style={{ border: '2px dashed #bfdbfe', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '12px' }}>
            <p style={{ fontSize: '36px', margin: 0 }}>📁</p>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0' }}>Upload your resume (PDF only)</p>
            <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])}
              style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleResumeUpload} disabled={uploading} style={{ ...btn, opacity: uploading ? 0.6 : 1 }}>
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>

        {/* Danger Zone */}
        <div style={{ ...card, border: '1px solid #fecaca' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>⚠️ Danger Zone</h2>
          <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '14px' }}>Permanently delete your account and all data.</p>
          <button onClick={handleDeleteAccount}
            style={{ background: '#ef4444', color: 'white', padding: '11px', borderRadius: '10px', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '14px', width: '100%' }}>
            🗑️ Delete Account
          </button>
        </div>

      </div>
    </div>
  )
}