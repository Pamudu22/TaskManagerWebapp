import express from "express";
import { config } from "dotenv";
import appRouter from "./routes/index.js";

import cors from 'cors';



config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

// middlewares
app.use(express.json());

// routes
app.use("/api/v1",appRouter);




export default app;

