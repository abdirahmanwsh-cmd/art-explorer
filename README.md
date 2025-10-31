# Art Explorer

Art Explorer is a responsive React + Firebase web application that reimagines how we experience art online.
It unites open collections from world-renowned museums — including The Metropolitan Museum of Art and The Art Institute of Chicago — into one elegant, immersive digital platform for exploring, saving, and appreciating art.

## ✨ Features

-  Browse curated artwork collections in Netflix-style carousels
-  Search across multiple museum collections
-  Dynamic artwork details and high-resolution images
-  Save favorite artworks to your personal gallery
-  Secure authentication with Firebase
-  Responsive design across all devices

## Tech Stack
**Frontend**	React (Vite)
**Styling**	Tailwind CSS
**APIs**	The Met Museum API, The Art Institute of Chicago API
**Backend**	Firebase Firestore
**Authentication**	Firebase Auth (Email, Google)
**Hosting**	Firebase Hosting
**State Management**	React Hooks & Context
**Deployment**	Firebase CLI
## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm
- Firebase account

### Installation

1. **Clone the repository**
```bash
git clone git@github.com:abdirahmanwsh-cmd/art-explorer.git
cd art-explorer
```

2. **Install dependencies**

npm install


3. **Configure Firebase**
- Create a `.env` file:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id


4. **Run locally**

npm run dev


## 📁 Folder Structure

art-explorer/
│
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Card.jsx
│   │   ├── Row.jsx
│   │   ├── Favorites.jsx
│   │   ├── FavoriteButton.jsx
│   │   ├── cart.jsx
│   │   ├── checkout.jsx
│   │   └── details.jsx
│   │
│   ├── lib/
│   │   ├── met.js
│   │   ├── aic.js
│   │   ├── favorites.js
│   │   └── cart.js
│   │
│   ├── auth.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── firebaseConfig.js
│
├── .firebaserc
├── firebase.json
├── vite.config.js
├── package.json
└── README.md

## 🔥 Deployment


npm run build
firebase deploy

## live link
  https://art-explorer-6707a.web.app

## 🎯 Future Enhancements

- AI-powered artwork recommendations
- Social features and sharing
- Advanced filtering options
- Dark mode support

## 📝 License

MIT License 


## 👏 Acknowledgments

- The Metropolitan Museum of Art
- Art Institute of Chicago
- Firebase team

## Author

Art Explorer Project
Created by Abdirahman Warsame Sheikh

Built with ❤️ using React and Firebase
Inspired by open museum APIs from The Met and The Art Institute of Chicago

"Art enables us to find ourselves and lose ourselves at the same time." — Thomas Merton

## contact
Abdirahman.wsh@gmail.com
