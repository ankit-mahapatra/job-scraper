import { useState, useEffect } from 'react'
import axios from 'axios'

export default function History() {
  const [applications, setApplications] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await axios.get('https://job-scraper-backend-4tbb.onrender.com/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setApplications(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '16px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #dbeafe', padding: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2563eb', marginBottom: '20px' }}>📋 Application History</h2>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: '40px' }}>
              <p style={{ fontSize: '40px' }}>📭</p>
              <p style={{ fontSize: '16px', marginTop: '8px' }}>No applications yet!</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Go to Dashboard and apply to jobs</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {applications.map((app, index) => (
                <div key={index} style={{ background: '#f8faff', borderRadius: '14px', padding: '16px', border: '1px solid #dbeafe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '15px', margin: 0 }}>{app.jobTitle}</p>
                      <p style={{ color: '#6b7280', fontSize: '13px', margin: '4px 0' }}>{app.company}</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                        <span style={{ background: '#dbeafe', color: '#2563eb', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                          {app.platform}
                        </span>
                        <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                          {app.status || 'Applied'}
                        </span>
                        <span style={{ color: '#9ca3af', fontSize: '12px', alignSelf: 'center' }}>
                          📅 {new Date(app.dateApplied).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(app.jobLink, '_blank')}
                      style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                    >
                      View Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}