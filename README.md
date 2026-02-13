# 🚀 Professional Mini Job Portal

A high-performance, role-based recruitment ecosystem built with the **React + Vite** and **Firebase (BaaS)** stack. This platform delivers a seamless experience for recruiters and job seekers through modular architecture, custom hook logic, and real-time database integration.

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/lasanga890/mini-job-portal.git
cd mini-job-portal
```

### 2. Install Dependencies

```bash
npm install react react-dom react-router-dom firebase react-hook-form
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer eslint
npm install
```

### 3. Local Development

```bash
npm run dev
```

### 4. Production Build

```bash
npm run build
```

---

---
## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 (Vite), Tailwind CSS |
| **Routing** | React Router v6 |
| **Backend** | Firebase Auth, Firestore NoSQL, Firebase Storage |
| **Deployment** | Netlify (CI/CD) + Firebase Security Rules |

---

## 📋 Database Schema (Firestore)

### `users` Collection

| Field | Type | Description |
|-------|------|-------------|
| `Document ID` | String | Auto-generated unique identifier |
| `bio` | String | User biography or professional summary |
| `companyName` | String | Company name (for employers) |
| `createdAt` | Timestamp | Account creation timestamp |
| `cvUrl` | String | URL to uploaded CV/resume (for candidates) |
| `description` | String | Detailed profile description |
| `email` | String | User email address |
| `industry` | String | Industry sector |
| `location` | String | Geographic location |
| `name` | String | Full name / Display name |
| `phone` | String | Contact phone number |
| `role` | String | User role: `candidate`, `employer`, or `admin` |
| `skills` | Array | List of skills (for candidates) |
| `updatedAt` | Timestamp | Last profile update timestamp |
| `website` | String | Personal or company website URL |

### `jobs` Collection

| Field | Type | Description |
|-------|------|-------------|
| `Document ID` | String | Auto-generated unique identifier |
| `createdAt` | Timestamp | Job posting creation timestamp |
| `description` | String | Detailed job description and requirements |
| `employerId` | String | Reference to employer's user ID |
| `employerName` | String | Name of the hiring company/employer |
| `location` | String | Job location |
| `salary` | String/Number | Salary range or compensation details |
| `status` | String | Job status: `active`, `closed`, etc. |
| `title` | String | Job title/designation |
| `type` | String | Employment type: `Full-time`, `Part-time`, `Internship`, `Contract` |
| `updatedAt` | Timestamp | Last update timestamp |

### `applications` Collection

| Field | Type | Description |
|-------|------|-------------|
| `Document ID` | String | Auto-generated unique identifier |
| `candidateEmail` | String | Applicant's email address |
| `candidateId` | String | Reference to candidate's user ID |
| `candidateName` | String | Full name of the applicant |
| `createdAt` | Timestamp | Application submission timestamp |
| `cvUrl` | String | URL to candidate's CV/resume |
| `employerId` | String | Reference to employer's user ID |
| `employerName` | String | Name of the hiring company |
| `jobId` | String | Reference to the specific job posting |
| `jobTitle` | String | Title of the job being applied for |
| `message` | String | Cover letter or application message |
| `status` | String | Application status: `pending`, `shortlisted`, `rejected` |

---

## ⚙️ Environment Variables

To run this project, create a `.env` file in the root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---


## 🔐 Test Credentials

Use these accounts to test the different role-based features:

| Account Role | Email | Password |
|-------------|-------|----------|
| **System Admin** | `admin@gmail.com` | `Admin@123` |
| **Verified Employer** | `employer@test.com` | `Password@123` |
| **Job Candidate** | `candidate@test.com` | `Password@123` |

---

## 🌐 Deployment

### Netlify (Frontend)

This project is deployed using Netlify using Git integration.

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

### Firebase (Backend Security)

- **Security Rules**: Firestore and Storage rules are deployed to ensure data integrity.
- **Validation**: Strict rules ensure Candidates can only modify their own profiles and Employers can only update status for their own job applications.

---

## 📬 Contact & Deliverables

- **GitHub Repo**: [https://github.com/lasanga890/mini-job-portal](https://github.com/lasanga890/mini-job-portal.git)
- **Live Demo**: [https://mini-job-portal.netlify.app/](https://mini-job-portal.netlify.app/)
- **Demo Video**: [Link to Video]

---


## 👨‍💻 Author

**Lasanga Dissanayaka**
- GitHub: [@lasanga890](https://github.com/lasanga890)
- LinkedIn: [Lasanga Dissanayaka](https://linkedin.com/in/lasanga-dissanayaka)

---