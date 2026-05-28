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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow border border-blue-100 p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Application History</h2>

          {applications.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <p className="text-xl">No applications yet!</p>
              <p className="text-sm mt-2">Go to Dashboard and apply to jobs</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4 text-left">Job Title</th>
                    <th className="p-4 text-left">Company</th>
                    <th className="p-4 text-left">Platform</th>
                    <th className="p-4 text-left">Date Applied</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <tr key={index} className="border-t hover:bg-blue-50 transition">
                      <td className="p-4 font-medium text-gray-800">{app.jobTitle}</td>
                      <td className="p-4 text-gray-600">{app.company}</td>
                      <td className="p-4">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                          {app.platform}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(app.dateApplied).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => window.open(app.jobLink, '_blank')}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          View Job
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}