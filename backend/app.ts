import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import userRoutes from "./src/routes/userRoutes";
import routeRoutes from "./src/routes/estimateRoute";
import driverRoutes from "./src/routes/driverRoutes";
import confirmRideRoute from "./src/routes/confirmRideRoute";
import historyRides from "./src/routes/ridesHistoryRoute";

// Import the custom corsMiddleware
import corsMiddleware from './src/config/cors';

// Import the seed function
import { seedData } from "./src/config/seedData";
import { PrismaClient } from "@prisma/client";

// Initialize express app
const app: Express = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use the CORS middleware
app.use(corsMiddleware);

// Initialize Prisma Client
const prisma = new PrismaClient();

// Check database connection when the app starts
async function checkDatabaseConnection() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users fetched successfully:", users);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Seed data (Make sure this is only called once to avoid duplication)
async function seed() {
  try {
    await seedData();
    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

// Initialize app by checking DB connection and seeding data
async function initializeApp() {
  await checkDatabaseConnection();
  await seed();
}

// Call initializeApp on startup
initializeApp();

// Routes
app.use(routeRoutes);
app.use(userRoutes);
app.use(driverRoutes);
app.use(confirmRideRoute);
app.use(historyRides);

// Start the server
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/api/config', (req, res) => {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  res.json({ googleApiKey });
});
