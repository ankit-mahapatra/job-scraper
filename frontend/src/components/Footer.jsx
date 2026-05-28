export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-3 gap-8 mb-8">

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">💼 JobScraper</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              A full stack job scraping platform built with MERN stack.
              Find, apply, and track jobs from multiple platforms in one place.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>✅ Live Job Scraping</li>
              <li>✅ Multi Platform Support</li>
              <li>✅ Application History</li>
              <li>✅ Bookmark Jobs</li>
              <li>✅ Resume Upload</li>
              <li>✅ JWT Authentication</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Tech Stack</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>⚛️ React + Vite + Tailwind</li>
              <li>🟢 Node.js + Express</li>
              <li>🍃 MongoDB + Mongoose</li>
              <li>🔐 JWT Authentication</li>
              <li>🕷️ Cheerio + Axios Scraper</li>
              <li>☁️ Deployed on Vercel + Render</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2026 JobScraper — Built for HireKarma SDE-1 Assessment
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.open('https://github.com/ankitmahapatra851', '_blank')}
              className="text-gray-400 hover:text-white text-sm transition"
            >
              GitHub
            </button>
            <button
              onClick={() => window.open('https://linkedin.com', '_blank')}
              className="text-gray-400 hover:text-white text-sm transition"
            >
              LinkedIn
            </button>
          </div>
        </div>

      </div>
    </footer>
  )
}