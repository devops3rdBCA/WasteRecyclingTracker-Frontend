Add/update frontend source code
# Waste Recycling Tracker – Frontend
This repository contains the **frontend application** for the Waste Recycling Tracker project.
It is built using **React and Vite** and provides the user interface for families and recycling centers to manage recyclable waste entries.

The frontend communicates with the **Spring Boot backend API** to store and manage data.

---

## Features

### Login

Users can log in to access the system.

### Family Dashboard

Families can:

* Add waste entries
* View submitted entries
* Edit waste details
* Delete entries

Each entry contains:

* Waste type
* Quantity
* Status

### Recycling Center Dashboard

Recycling centers can:

* View all waste submissions
* Update waste status
  **Pending → Processing → Recycled**
* Delete recycled entries

### Statistics Page

Displays summary information such as:

* Total waste entries
* Total waste quantity
* Waste type distribution
* Status breakdown

---

## Tech Stack

* React 18
* Vite
* React Router
* Axios
* Bootstrap 5
* Material UI

---

## Project Structure

```
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── vite.config.js
```

---

## Running the Project Locally

Make sure **Node.js 18 or later** is installed.

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## Backend Integration

This frontend connects to the **Spring Boot backend API**.

Create a `.env` file in the frontend folder and add:

```
VITE_API_URL=http://localhost:8080
```

Example API request:

```
GET /api/family
POST /api/family
PUT /api/family/{id}
DELETE /api/family/{id}
```

---

## Deployment

The frontend can be deployed using **Vercel**.

Steps:

1. Push the project to GitHub
2. Go to https://vercel.com
3. Import the repository
4. Add environment variable

```
VITE_API_URL = your backend API URL
```

5. Deploy the project

