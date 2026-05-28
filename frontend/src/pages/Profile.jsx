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

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:5000/api/profile', user, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showMessage('✅ Profile updated successfully!')
    } catch (err) {
      console.log(err)
    }
  }

  const handleImageUpload = async () => {
    if (!imageFile) return alert('Please select an image!')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      const res = await axios.post('http://localhost:5000/api/profile/image', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      setUser(res.data)
      showMessage('✅ Profile image uploaded!')
    } catch (err) {
      console.log(err)
    }
    setUploading(false)
  }

  const handleDeleteImage = async () => {
    if (!window.confirm('Delete profile image?')) return
    try {
      const res = await axios.delete('http://localhost:5000/api/profile/image', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data)
      showMessage('🗑️ Image deleted!')
    } catch (err) {
      console.log(err)
    }
  }

  const handleResumeUpload = async () => {
    if (!resumeFile) return alert('Please select a PDF!')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      await axios.post('http://localhost:5000/api/profile/resume', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      showMessage('✅ Resume uploaded!')
      fetchProfile()
    } catch (err) {
      console.log(err)
    }
    setUploading(false)
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account!')) return
    try {
      await axios.delete('http://localhost:5000/api/profile/account', {
        headers: { Authorization: `Bearer ${token}` }
      })
      localStorage.clear()
      navigate('/signup')
    } catch (err) {
      console.log(err)
    }
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm font-medium border border-green-200">
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow border border-blue-100 p-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">👤 My Profile</h2>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow"
              />
            ) : (
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="text-xs border border-gray-300 rounded-lg px-2 py-1"
              />
              <button
                onClick={handleImageUpload}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-700"
              >
                Upload
              </button>
              {user.profileImage && (
                <button
                  onClick={handleDeleteImage}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* Resume Card */}
        <div className="bg-white rounded-2xl shadow border border-blue-100 p-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">📄 Resume</h2>

          {user.resume && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-semibold text-green-700">Resume Uploaded!</p>
                <button
                  onClick={() => window.open(user.resume, '_blank')}
                  className="text-blue-600 text-sm hover:underline"
                >
                  View Resume
                </button>
              </div>
            </div>
          )}

          <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center">
            <p className="text-4xl mb-2">📁</p>
            <p className="text-gray-500 text-sm mb-4">Upload your resume (PDF only)</p>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            />
          </div>

          <button
            onClick={handleResumeUpload}
            disabled={uploading}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow border border-red-100 p-8">
          <h2 className="text-2xl font-bold text-red-500 mb-2">⚠️ Danger Zone</h2>
          <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all data.</p>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            🗑️ Delete Account
          </button>
        </div>

      </div>
    </div>
  )
}