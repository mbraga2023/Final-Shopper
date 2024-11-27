import { Router } from 'express';
import dotenv from 'dotenv';

// Initialize dotenv to load environment variables
dotenv.config();

const router = Router();

// Define the route
router.get('/config', (req, res) => {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (googleApiKey) {
    res.json({ googleApiKey });
  } else {
    res.status(500).json({ message: 'API key not found' });
  }
});

export default router;
