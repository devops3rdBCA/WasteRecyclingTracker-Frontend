# Waste Recycling Tracker – Frontend

This is the **frontend application** for the Waste Recycling Tracker project.
It is built using **React and Vite** and provides the user interface for families and recycling centers to manage recyclable waste entries.

The frontend communicates with a **Spring Boot backend API**. If the backend is not available, some features can still work using **browser localStorage**, which helps during testing or demo.

---

## Features

### Login Page

Users log in to access the system.

### Family Dashboard

Families can:

* Add waste entries
* View submitted entries
* Edit waste details
* Delete entries

Each entry includes:

* Waste type
* Quantity
* Status

### Recycling Center Dashboard

Recycling centers can:

* View all waste entries
* Update status
  **Pending → Processing → Recycled**
* Remove completed entries

### Statistics Page

Displays summary information such as:

* Total waste entries
* Total quantity collected
* Waste type totals
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

```id="ip4w91"
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

Make sure **Node.js 18 or higher** is installed.

Install dependencies:

```id="98erjw"
npm install
```

Start the development server:

```id="kp6jv2"
npm run dev
```

Open the application in your browser:

```id="cs1xqs"
http://localhost:5173
```

---

## Environment Configuration

Create a `.env` file in the frontend folder and add:

```id="1a7e3h"
VITE_API_URL=http://localhost:8081
```

This variable defines the backend API URL.

---

## Available Scripts

`npm run dev` → Starts the development server

`npm run build` → Builds the project for production

`npm run preview` → Preview the production build locally

---

## Deployment

The frontend can be deployed using platforms like:

* Vercel
* Netlify
* Docker

Example Docker build:

```id="agp34n"
docker build -t waste-recycling-frontend .
```

Run the container:

```id="iqy2wy"
docker run -p 3000:3000 waste-recycling-frontend
```

---

## Notes

* Make sure **node_modules** is not pushed to GitHub.
* Do not commit **.env files**.
* Always keep **package-lock.json** for consistent installations.

---

## Author

Built by **Jeynisha E**
BCA Student | Aspiring Full Stack Developer
