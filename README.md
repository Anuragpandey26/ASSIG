Mini LinkedIn-like Community Platform

Welcome to the Mini LinkedIn-like Community Platform! This project is a simplified social networking application inspired by LinkedIn, featuring user authentication, profile management, post creation, editing, and deletion, with real-time updates and profile picture support. It consists of a frontend built with React and a backend built with Node.js/Express, designed to work together seamlessly.

Overview

Frontend

Technology: React, React Router, Axios

Features:

User signup and login with form validation

Protected routes for landing and profile pages

Profile management (edit name, email, skills, etc., and upload profile picture)

Post creation, editing, and deletion

Real-time feed updates via polling

Responsive navbar with logout functionality


Directory: frontend/


Backend


Technology: Node.js, Express, MongoDB (via Mongoose), JWT for authentication

Features:

User registration and login with JWT-based authentication

Profile update endpoint with file upload support (profile picture)

Post management (create, edit, delete)

API endpoints for feed and user data


Directory: backend/

Prerequisites

Node.js (v14.x or later)

npm (comes with Node.js)

MongoDB (local instance or MongoDB Atlas)

Git (for cloning the repository)

Installation

Backend Setup


Navigate to the backend directory:

cd backend


Install dependencies:

npm install


Create a .env file in the backend directory with the following variables:

PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_secret_key


Replace your_mongodb_connection_string with your MongoDB URI (e.g., mongodb://localhost:27017/linkedin-clone).

Replace your_secret_key with a strong, unique string for JWT signing.


Start the backend server:

node index.js


The server will run on http://localhost:3000.



Frontend Setup

Navigate to the frontend directory:

cd frontend


Install dependencies:

npm install


Start the development server:

npm run dev


The app will be available at http://localhost:5173.



Usage

Signing Up

Visit http://localhost:5173/signup.

Fill in the required fields (name, username, email, password) with valid data.

Submit to create an account and redirect to the login page.


Logging In

Visit http://localhost:5173/login.

Enter your username and password.

Log in to access the landing page.


Landing Page

View the home feed with posts from all users.

Create new posts (requires login).

Posts update every 10 seconds via polling.


Profile Page

Navigate to http://localhost:5173/profile (requires login).

Edit your profile details and upload a profile picture.

Create, edit, or delete your posts.


Logging Out

Click the "Logout" button in the navbar to end your session and return to the login page.


File Structure

Mini-LinkedIn-Clone/

├── backend/

│   ├── config/

│   ├── controllers/

│   ├── middleware/

│   ├── models/

│   ├── routes/

│   ├── index.js

│   ├── package.json

│   └── .env

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── context/

│   │   ├── pages/

│   │   ├── App.jsx

│   │   ├── main.jsx

│   │   └── index.css

│   ├── package.json

│   └── .env

├── README.md

