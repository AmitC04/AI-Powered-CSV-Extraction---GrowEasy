🧬 GrowEasy AI Importer
A Modern AI-Powered CSV Extraction Web Application
Next.js Node.js Groq AI MIT License

Building intelligent data pipelines with modern development practices

Features • Installation • Usage • Documentation • Contributing

📋 Overview
GrowEasy AI Importer is a production-ready full-stack web application showcasing modern web development architecture and AI integration. Built with Next.js, Node.js, and Groq's Llama 3.3 model, it demonstrates best practices in AI prompt engineering, streaming API design, and scalable application structure.

Why GrowEasy AI Importer?
🎯 AI-Powered Field Mapping - Works with any CSV column names without configuration
⚡ Real-Time Streaming - Server-Sent Events (SSE) stream live progress
🔄 Smart Retry Logic - Auto-retries failed AI batches with exponential backoff
🎨 Component Architecture - Reusable, premium UI components for a seamless experience
🐳 Deployment Ready - Configured for Vercel (Frontend) and traditional hosting (Backend)

✨ Features
Full-Stack Framework: Complete Next.js implementation with an Express backend
Intelligent AI Extraction: Groq Llama 3.3 for high-speed, accurate CRM lead extraction
API Routes: RESTful endpoints built with Node.js and Express
Modern React: Component-based architecture with React best practices
Data Validation: Post-AI sanitization enforces enum constraints and skips invalid records
Deployment Ready: Configured for Vercel, Railway, Render, or traditional hosting

🏗️ Project Structure
AI-Powered-CSV-Extraction---GrowEasy/
├── backend/
│   ├── services/
│   │   ├── ai.service.js      # Groq AI integration with retry logic
│   │   └── csv.service.js     # CSV parsing with csv-parse
│   ├── server.js              # Express server + SSE streaming endpoint
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment variables template
├── frontend/
│   ├── app/
│   │   ├── page.js            # Main 4-step import flow
│   │   ├── layout.js          # Root layout with metadata
│   │   └── globals.css        # Design system & tokens
│   ├── components/            # Reusable React components (Upload, Tables, UI)
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   └── next.config.mjs        # Next.js configuration
├── sample_leads.csv           # Sample dataset for testing
└── README.md

🛠️ Tech Stack
Category	Technology
Frontend	Next.js 15, React 19
Backend	Node.js, Express 4.x
AI Model	Groq Llama 3.3 70B Versatile
CSV Parsing	PapaParse (Client), csv-parse (Server)
Styling	Vanilla CSS / CSS Modules
Deployment	Vercel (Frontend) / Railway (Backend)

🚀 Installation
Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v18.0 or higher)
npm or yarn
Git
A free Groq API key (from console.groq.com)

Step 1: Clone the Repository
git clone https://github.com/AmitC04/AI-Powered-CSV-Extraction---GrowEasy.git
cd AI-Powered-CSV-Extraction---GrowEasy

Step 2: Setup Backend
cd backend
npm install

Step 3: Environment Configuration
Create a .env file in the backend/ directory:

# Groq API Key
GROQ_API_KEY="gsk_your_groq_api_key_here"

# Server Port
PORT=3001

⚠️ Important: Never commit your .env file to version control!

Step 4: Start Backend Server
node server.js
# Runs on http://localhost:3001

Step 5: Setup Frontend
Open a new terminal window:
cd frontend
npm install
npm run dev

Visit http://localhost:3000 to see your application! 🎉

📖 Usage
Development Commands (Frontend)
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

API Routes
API endpoints are available under /api/*. Example:

POST /api/process
Upload and process a CSV file. Returns a Server-Sent Events (SSE) stream.
Accepts: multipart/form-data (CSV file, max 10MB)

Access at: http://localhost:3001/api/process

☁️ Vercel Deployment
Deploying the Frontend to Vercel
1. Push your code to GitHub
2. Go to vercel.com/new
3. Click "Import Project" and select your GitHub repo
4. Set the Root Directory to `frontend`
5. Framework Preset: Next.js (auto-detected)
6. Add Environment Variable:
   Name: NEXT_PUBLIC_API_URL
   Value: Your deployed backend URL (e.g., https://your-backend.railway.app)
7. Click Deploy!

Deploying the Backend to Railway
1. Go to railway.app and create a new project
2. Click "Deploy from GitHub repo" and select your repo
3. Set the Root Directory to `backend`
4. Add environment variables: GROQ_API_KEY and PORT
5. Railway auto-detects Node.js and deploys your server.

📚 Documentation
CRM Fields Extraction
The AI maps incoming CSV columns to the following CRM fields:

Field                         Description
created_at                    Lead creation date
name                          Full name
email                         Primary email address
country_code                  Country code (e.g., +91)
mobile_without_country_code   Phone number
company                       Company name
city                          City
state                         State
country                       Country
lead_owner                    Assigned lead owner
crm_status                    Lead status (Enum)
crm_note                      Notes/remarks
data_source                   Lead source (Enum)
possession_time               Property possession time
description                   Additional description

Environment Variables
Variable	          Description	           Required
GROQ_API_KEY	  Groq API Key	           ✅ Yes (Backend)
PORT	          Backend Port	           ❌ No (Backend)
NEXT_PUBLIC_API_URL API Base URL	           ❌ No (Frontend)

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create a feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m 'Add amazing feature'
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request

Development Guidelines
Follow the existing code style
Write meaningful commit messages
Add tests for new features
Update documentation as needed
Run npm run lint before committing

🐛 Troubleshooting
Common Issues
Problem: "Authentication Error"

# Solution: Check your GROQ_API_KEY in backend/.env
# Ensure the key is valid and you have restarted the backend server.
Problem: "Connection Error - Cannot reach backend"

# Solution: Ensure the backend is running on port 3001
cd backend && node server.js
Problem: Port 3001 already in use

# Solution: Change port in .env or kill existing process
PORT=3002 node server.js

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨💻 Author
Amit C04

GitHub: @AmitC04
Project Link: AI-Powered-CSV-Extraction---GrowEasy

🙏 Acknowledgments
Next.js Documentation
Groq Documentation
React Documentation

📊 Project Status
🟢 Active Development - This project is actively maintained and updated regularly.

Position Applied For: Intern / Full-Time

Made with ❤️ using Next.js and Groq AI

⭐ Star this repo if you find it helpful!
