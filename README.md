# Waste Recycling Tracking System – Frontend

This project is the frontend of a small waste recycling tracking system built using React and Vite.

The application allows families to submit waste recycling records and lets recycling centers review and manage those submissions. It is designed to work with a backend API, but it can also run without a backend by using the browser's localStorage. This makes it useful for demos, testing, or showcasing the UI.

## Features

The application has three main parts.

Login page
Users log in to access the system.

Family dashboard
Families can add, edit, and delete waste entries. Each entry includes the waste type and quantity.

Recycling center dashboard
The recycling center can review submitted entries and update the status as the waste moves through the recycling process.

Statistics page
Shows a summary of the data including total entries, total waste quantity, number of families, waste-type totals, and status breakdowns.

## Technologies Used

React 18
Vite 5
React Router
Axios
Bootstrap 5
Material UI

## Running the Project Locally

Make sure Node.js version 18 or newer is installed.

Install dependencies:

npm install

Start the development server:

npm run dev

Open the app in your browser:

http://localhost:5173

## Available Scripts

npm run dev – starts the development server
npm run build – creates a production build in the dist folder
npm run preview – runs the production build locally

## Backend Configuration

If you have a backend running, you can configure the API URL using an environment variable.

Create a `.env` file and add:

VITE_API_URL=http://localhost:8081

If this variable is not set, the frontend will use http://localhost:8081 by default.

The app first tries to use backend routes under /api. If the backend is not available, the application falls back to localStorage so the basic functionality still works.

## Local Storage Keys

The app uses the following keys in the browser:

wasteEntries
wasteEntriesNextId

## Application Pages

/ – Login page
/family – Family dashboard
/center – Recycling center dashboard
/statistics – Statistics dashboard

## Docker

Build the Docker image:

docker build -t waste-recycling-frontend .

Run the container:

docker run -p 3000:3000 waste-recycling-frontend

Open in browser:

http://localhost:3000


## License

This project currently does not include a license file. Add one if you plan to make the repository public.
