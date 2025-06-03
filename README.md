# 🏙️ QSee – Bridging QCitizens and Quezon City LGU

QSee is a web-based platform designed to bridge the communication gap between QCitizens and the Quezon City Local Government Unit (LGU). It provides a centralized and transparent medium for reporting civic issues such as poor infrastructure, unorganized commute routes, public health concerns, safety issues, and corruption.

---

## 📌 Project Overview

Through QSee, verified citizens can post, comment, and track local concerns in a public space. The Quezon City LGU acts as administrators, responding to reports as a sign of transparency and responsible governance. The system also supports volunteering features, interactive mapping, and administrator dashboards powered by AI.

---

## 👥 Group Members

- John Gavin Deposoy  
- Sean Patrick P. Rada  
- Aurold John R. Sadullo  
- Mark Daniel Bermudez  

---

## 🎯 Objectives

- Provide a centralized platform for QCitizens to report civic problems.
- Promote government transparency and faster response to public concerns.
- Encourage community involvement through comments and volunteer opportunities.
- Ensure ease of use through a clean UI/UX and mobile/desktop accessibility.
- Leverage AI and mapping tools for efficient administration and tracking.

---

## 🌟 Key Features

- **Verified Citizen Log-in** – Secure sign-in using mobile numbers linked to valid IDs  
- **Public Complaint Posting** – Citizens can post and comment on local issues  
- **Interactive District/Barangay Map** – View reports by geolocation  
- **reCAPTCHA Integration** – Protection against bots and spam  
- **AI-Powered Admin Dashboard** – Summarized insights via Gemini AI  
- **Volunteer System** – Citizens can join local initiatives  
- **Responsive Design** – Accessible across desktop and mobile devices  

---

## 🛠️ Technologies Used

### Front-end  
- **React.js** – Web application UI framework  
- **Tailwind CSS** – Utility-first CSS for styling  
- **ShadCN** – UI component library for React  

### Back-end  
- **Node.js** – Server-side logic  
- **Supabase** – Backend-as-a-Service (BaaS) for authentication and database  

### APIs and Services  
- **Google reCAPTCHA** – Bot protection  
- **Gemini API** – AI-powered report summarization  
- **Google Maps API** – Interactive mapping and geolocation  

### UI/UX Tools  
- **Figma** – Wireframing and prototyping  

---

## 🚀 How to Run Locally

### 📦 Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- Supabase project (with auth & database)
- Google Maps API key
- Gemini API key
- Google reCAPTCHA key

---

### 🔧 Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/SeanTheBuilder1/gitgyud-sparkfest.git
cd gitgyud-sparkfest
```

2. **Install dependencies**
```bash
npm install
```
3. **Create .env file in root directory**
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
GEMINI_API_KEY=your_gemini_api_key
```
4. **Run the app**
```bash
npm run dev
```
