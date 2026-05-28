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
  const [bookmarks, setBookmarks] = useState([])
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const handleScrape = async () => {
    if (!keyword || !location) return alert('Please enter keyword and location!')
    setLoading(true)
    setCurrentPage(1)
    try {
      const res = await axios.get(`http://localhost:5000/api/scrape?keyword=${keyword}&location=${location}`, {
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
      await axios.post('http://localhost:5000/api/applications/apply', job, {
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
    if (exists) {
      setBookmarks(bookmarks.filter(b => b.jobTitle !== job.jobTitle))
    } else {
      setBookmarks([...bookmarks, job])
    }
  }

  const isBookmarked = (job) => bookmarks.find(b => b.jobTitle === job.jobTitle)

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  )

  const platforms = ['All', ...new Set(jobs.map(j => j.platform))]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Welcome Banner */}
        <div className="bg-blue-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <h2 className="text-3xl font-bold">Welcome back, {user?.name}! 👋</h2>
          <p className="text-blue-100 mt-1">Find and apply to your dream jobs today</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow border border-blue-100 text-center">
            <p className="text-3xl font-bold text-blue-600">{jobs.length}</p>
            <p className="text-gray-500 text-sm mt-1">Jobs Found</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow border border-blue-100 text-center">
            <p className="text-3xl font-bold text-blue-600">{bookmarks.length}</p>
            <p className="text-gray-500 text-sm mt-1">Bookmarked</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow border border-blue-100 text-center">
            <p className="text-3xl font-bold text-blue-600">{totalPages || 0}</p>
            <p className="text-gray-500 text-sm mt-1">Total Pages</p>
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-700 mb-4">🔎 Search Jobs</h3>
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Job keyword (e.g. React Developer)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            <input
              type="text"
              placeholder="Location (e.g. Mumbai)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            <button
              onClick={handleScrape}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-50"
            >
              {loading ? '⏳ Scraping...' : '🚀 Scrape Jobs'}
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        {jobs.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => handleFilter(p)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition
                  ${filterPlatform === p
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'
                  }`}
              >
                {p}
              </button>
            ))}
            <span className="ml-auto text-gray-400 text-sm self-center">
              Showing {filteredJobs.length} jobs
            </span>
          </div>
        )}

        {/* Results Table */}
        {paginatedJobs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden mb-4">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-700">📋 Job Results</h3>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-4 text-left font-semibold">Job Title</th>
                    <th className="p-4 text-left font-semibold">Company</th>
                    <th className="p-4 text-left font-semibold">Location</th>
                    <th className="p-4 text-left font-semibold">Platform</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedJobs.map((job, index) => (
                    <tr key={index} className="border-t hover:bg-blue-50 transition">
                      <td className="p-4 font-medium text-gray-800">{job.jobTitle}</td>
                      <td className="p-4 text-gray-600">{job.company}</td>
                      <td className="p-4 text-gray-600">📍 {job.location}</td>
                      <td className="p-4">
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                          {job.platform}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleApply(job)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 transition shadow"
                        >
                          ✅ Apply
                        </button>
                        <button
                          onClick={() => handleBookmark(job)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition shadow
                            ${isBookmarked(job)
                              ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                              : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                            }`}
                        >
                          {isBookmarked(job) ? '🔖 Saved' : '🔖 Save'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-100 disabled:opacity-40 font-medium text-sm"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition
                    ${currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-100 disabled:opacity-40 font-medium text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Bookmarks Section */}
        {bookmarks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-yellow-200 overflow-hidden mb-4">
            <div className="p-4 border-b border-yellow-100">
              <h3 className="font-bold text-yellow-600">🔖 Bookmarked Jobs ({bookmarks.length})</h3>
            </div>
            <div className="p-4 space-y-2">
              {bookmarks.map((job, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800">{job.jobTitle}</p>
                    <p className="text-gray-500 text-sm">{job.company} • {job.platform}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApply(job)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-700"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => handleBookmark(job)}
                      className="bg-red-100 text-red-500 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {jobs.length === 0 && !loading && (
          <div className="text-center mt-20">
            <p className="text-6xl mb-4">💼</p>
            <p className="text-xl text-gray-500 font-medium">Enter a keyword and location to find jobs!</p>
            <p className="text-gray-400 text-sm mt-2">We'll scrape the latest listings for you</p>
          </div>
        )}

      </div>
    </div>
  )
}