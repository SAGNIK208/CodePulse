import express, {Express,Request, Response } from "express";
import { PORT } from "@repo/config/constant";
import connectToDB from "@repo/db/connect";
import bodyParser from "body-parser";
import { apiRouter } from "./routes";
import errorHandler from "./utils/errorHandler";

const app:Express = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

// API Routes
app.use("/api", apiRouter);

// Health Check Route
app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    msg: "Problem Service is healthy",
  });
});

// Error handler (should be the last middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`Server started at port: ${PORT}`);
  try {
    await connectToDB();
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Database connection failed", error);
  }
});

export default app;
