import express from "express";
import { config } from "dotenv";
import appRouter from "./routes/index.js";


config();
const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/api/v1",appRouter);




export default app;

