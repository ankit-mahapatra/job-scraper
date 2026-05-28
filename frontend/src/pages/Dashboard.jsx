import { useState } from 'react'
import axios from 'axios'

const JOBS_PER_PAGE = 5

export default function Dashboard() {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterPlatform, setFilterPlatform] = useState('All')
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks')
    return saved ? JSON.parse(saved) : []
  })

  const handleScrape = async () => {
    if (!keyword || !location) return alert('Please enter keyword and location!')
    setLoading(true)
    setCurrentPage(1)
    try {
      const res = await axios.get(`https://job-scraper-backend-4tbb.onrender.com/api/scrape?keyword=${keyword}&location=${location}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setJobs(res.data)
      setFilteredJobs(res.data)
      setFilterPlatform('All')
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const handleApply = async (job) => {
    try {
      await axios.post('https://job-scraper-backend-4tbb.onrender.com/api/applications/apply', job, {
        headers: { Authorization: `Bearer ${token}` }
      })
      window.open(job.jobLink, '_blank')
      alert('Application saved!')
    } catch (err) {
      console.log(err)
    }
  }

  const handleFilter = (platform) => {
    setFilterPlatform(platform)
    setCurrentPage(1)
    if (platform === 'All') {
      setFilteredJobs(jobs)
    } else {
      setFilteredJobs(jobs.filter(j => j.platform === platform))
    }
  }

  const handleBookmark = (job) => {
    const exists = bookmarks.find(b => b.jobTitle === job.jobTitle)
    let updated
    if (exists) {
      updated = bookmarks.filter(b => b.jobTitle !== job.jobTitle)
    } else {
      updated = [...bookmarks, job]
    }
    setBookmarks(updated)
    localStorage.setItem('bookmarks', JSON.stringify(updated))
  }

  const isBookmarked = (job) => bookmarks.find(b => b.jobTitle === job.jobTitle)

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  )

  const platforms = ['All', ...new Set(jobs.map(j => j.platform))]

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '16px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Welcome Banner */}
        <div style={{ background: '#2563eb', borderRadius: '16px', padding: '20px', marginBottom: '16px', color: 'white' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>Welcome back, {user?.name}! 👋</h2>
          <p style={{ color: '#bfdbfe', marginTop: '4px', fontSize: '14px' }}>Find and apply to your dream jobs today</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {[
            { label: 'Jobs Found', value: jobs.length },
            { label: 'Bookmarked', value: bookmarks.length },
            { label: 'Total Pages', value: totalPages || 0 },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '12px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #dbeafe' }}>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{stat.value}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search Box */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #dbeafe' }}>
          <h3 style={{ fontWeight: 'bold', color: '#374151', marginBottom: '12px' }}>🔎 Search Jobs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="Job keyword (e.g. React Developer)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
            />
            <input
              type="text"
              placeholder="Location (e.g. Mumbai)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
            />
            <button
              onClick={handleScrape}
              disabled={loading}
              style={{ background: '#2563eb', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '15px', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? '⏳ Scraping...' : '🚀 Scrape Jobs'}
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        {jobs.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => handleFilter(p)}
                style={{
                  padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', border: '1px solid #e5e7eb', cursor: 'pointer',
                  background: filterPlatform === p ? '#2563eb' : 'white',
                  color: filterPlatform === p ? 'white' : '#4b5563',
                }}
              >
                {p}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', color: '#9ca3af', fontSize: '13px', alignSelf: 'center' }}>
              {filteredJobs.length} jobs
            </span>
          </div>
        )}

        {/* Job Cards - Mobile Friendly */}
        {paginatedJobs.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontWeight: 'bold', color: '#374151', margin: 0 }}>📋 Job Results</h3>
              <span style={{ background: '#dbeafe', color: '#2563eb', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {paginatedJobs.map((job, index) => (
                <div key={index} style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #dbeafe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', color: '#1f2937', margin: 0, fontSize: '15px' }}>{job.jobTitle}</p>
                      <p style={{ color: '#6b7280', fontSize: '13px', margin: '4px 0' }}>{job.company} • 📍 {job.location}</p>
                      <span style={{ background: '#dbeafe', color: '#2563eb', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        {job.platform}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => handleApply(job)}
                        style={{ background: '#2563eb', color: 'white', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                      >
                        ✅ Apply
                      </button>
                      <button
                        onClick={() => handleBookmark(job)}
                        style={{
                          padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer',
                          background: isBookmarked(job) ? '#facc15' : '#f3f4f6',
                          color: isBookmarked(job) ? 'white' : '#4b5563',
                        }}
                      >
                        {isBookmarked(job) ? '🔖 Saved' : '🔖 Save'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                style={{ padding: '8px 16px', borderRadius: '10px', background: '#f3f4f6', border: 'none', cursor: 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}>
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}
                  style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: currentPage === i + 1 ? '#2563eb' : '#f3f4f6', color: currentPage === i + 1 ? 'white' : '#4b5563', fontWeight: '600' }}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                style={{ padding: '8px 16px', borderRadius: '10px', background: '#f3f4f6', border: 'none', cursor: 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Bookmarks */}
        {bookmarks.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #fde68a', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #fef3c7' }}>
              <h3 style={{ fontWeight: 'bold', color: '#d97706', margin: 0 }}>🔖 Bookmarked Jobs ({bookmarks.length})</h3>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {bookmarks.map((job, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#fffbeb', borderRadius: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>{job.jobTitle}</p>
                    <p style={{ color: '#6b7280', fontSize: '13px', margin: '2px 0 0' }}>{job.company} • {job.platform}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleApply(job)}
                      style={{ background: '#2563eb', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                      Apply
                    </button>
                    <button onClick={() => handleBookmark(job)}
                      style={{ background: '#fee2e2', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {jobs.length === 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <p style={{ fontSize: '60px' }}>💼</p>
            <p style={{ fontSize: '18px', color: '#6b7280', fontWeight: '500' }}>Enter a keyword and location to find jobs!</p>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>We'll scrape the latest listings for you</p>
          </div>
        )}

      </div>
    </div>
  )
}