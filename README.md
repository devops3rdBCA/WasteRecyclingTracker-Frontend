# Waste Recycling Tracker – Frontend

This repository contains the **frontend application** for the Waste Recycling Tracker project, built using **React 18** and **Vite**. It provides a UI for both families and recycling centers to manage recyclable waste entries and review statistics.

The frontend communicates with the **Spring Boot backend API**, but can also fall back to using localStorage for demo/testing if no backend is available.

---

## Features

#### Login
- Users can log in to access the system.

#### Family Dashboard
- Add, view, edit, and delete waste entries
- Each entry contains: waste type, quantity, and status

#### Recycling Center Dashboard
- View all submissions
- Update waste status (`Pending → Processing → Recycled`)
- Delete recycled entries

#### Statistics Page
- Total waste entries, quantities, waste type distribution, and status breakdowns

---

## Built With / Tech Stack

- React 18
- Vite 5
- React Router
- Axios
- Bootstrap 5
- Material UI

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
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Open:
```
http://localhost:5173
```

---

## Backend Configuration

If you have a backend running, you can point the frontend to it with this environment variable (in a `.env` file):

```
VITE_API_URL=http://localhost:8081
```
If not set, it defaults to `http://localhost:8081`.  
The app will fall back to browser localStorage for the main entry and statistics pages if the backend is unavailable.

Keys used in localStorage:
- wasteEntries
- wasteEntriesNextId

---

## Main Pages

- `/`           – login
- `/family`     – family dashboard
- `/center`     – recycling center dashboard
- `/statistics` – statistics dashboard

---

## Docker

To build the image:
```bash
docker build -t waste-recycling-frontend .
```

To run it:
```bash
docker run -p 3000:3000 waste-recycling-frontend
```

Open:
```
http://localhost:3000
```

---

## Deployment

You can deploy the frontend using **Vercel** or any static host.

For Vercel:

1. Push the project to GitHub
2. Go to https://vercel.com and import the repository
3. Add the environment variable:
    ```
    VITE_API_URL = your backend API URL
    ```
4. Deploy your project

---

## Best Practices Before Uploading to GitHub

- Keep `node_modules` out of the repository
- Do not commit secret or machine-specific environment files
- Include `package-lock.json` for consistent installs
- Make sure `.gitignore` covers local and build artifacts

---

## License

This project does not currently include a license file. If you plan to make the repository public, add one before sharing.
