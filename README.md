# 💼 JobScraper - MERN Job Scraping App

A full-stack MERN application that scrapes job listings from multiple platforms, allowing users to search, bookmark, and apply for jobs — all in one place.

---

## 🚀 Live Demo

- **Frontend:** [job-scraper-frontend-phi.vercel.app](https://job-scraper-frontend-phi.vercel.app)
- **Backend:** [job-scraper-backend-4tbb.onrender.com](https://job-scraper-backend-4tbb.onrender.com)

---

## ✨ Features

- 🔐 User Authentication (Signup / Login with JWT)
- 🔎 Job Scraping by keyword and location
- 📋 Filter jobs by platform
- 🔖 Bookmark jobs for later
- ✅ Apply to jobs and track application history
- 👤 User profile with image upload (Cloudinary)
- 📱 Fully responsive UI

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Context API (Auth)

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt.js
- Cloudinary (image uploads)
- Multer (file handling)
- Helmet & CORS

**Deployment:**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## 📁 Project Structure

```
JobScraper/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   └── Profile.jsx
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── applicationController.js
│   │   ├── ProfileController.js
│   │   └── Scrape.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── cloudinary.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── application.js
│   │   ├── profile.js
│   │   └── Scrape.js
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Cloudinary account
- Git

### 1. Clone the repository
```bash
git clone https://github.com/ankit-mahapatra/job-scraper.git
cd job-scraper
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:
```bash
node index.js
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## 👨‍💻 Author

**Ankit Mahapatra**
- GitHub: [@ankit-mahapatra](https://github.com/ankit-mahapatra)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

> Note: .env file has been removed from latest commit. 
> node_modules are excluded going forward via .gitignore