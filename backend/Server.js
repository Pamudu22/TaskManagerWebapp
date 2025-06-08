import dotenv from 'dotenv';
dotenv.config()
import app from './app.js';
import { connectDB } from './db/connection.js';

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
   
  });
