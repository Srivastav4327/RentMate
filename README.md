# 🏠 RentMate

**RentMate** is a modern web application designed to help students and bachelors across India rent and share items locally. The platform enables users to browse available items, list their own items for rent, and manage rentals through a user-friendly dashboard.

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Vite  
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer  
- **Routing:** React Router DOM  
- **State & Data Management:** Firebase (Auth + Firestore), Axios, date-fns, jwt-decode  
- **UI Enhancements:** Lucide React (icons), React Hot Toast (notifications)  
- **Tooling:** ESLint, TypeScript, @vitejs/plugin-react, typescript-eslint  
- **Runtime:** Node.js (npm scripts)

## ✨ Features

- 🔐 Secure user authentication (Firebase)
- 🔍 Browse and search for items available for rent
- 📤 List new items with descriptions and images
- 📊 Dashboard for managing personal listings and rentals
- 🛠 Admin panel for platform-wide management
- 📱 Fully responsive design (mobile & desktop)
- 🔄 Real-time updates using Firebase


## 🛠 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/rentmate.git
cd rentmate

# 2. Install dependencies
npm install

# 3. Set up Firebase config in the `.env` file
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... other Firebase env variables

# 4. Start the development server
npm run dev
