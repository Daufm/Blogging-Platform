import express from "express";
import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRoutes from './routes/webhook.route.js';

import analyticsRoutes from "./routes/analytics.route.js";
import handleRequest from "./routes/handleRequest.route.js";
import PaymentRouter from "./routes/PaymentRouter.js"
import authorRouter from "./routes/authorRouter.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";


dotenv.config();

const app = express();
const __dirname = path.resolve();

// Enable CORS
console.log("CORS enabled for:", process.env.CLIENT_URL);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// Middleware to parse JSON
app.use(express.json());

// Set headers for CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use('/chapa', webhookRoutes);

app.use("/analytics", analyticsRoutes);
app.use("/request",handleRequest);
app.use("/payment", PaymentRouter)
app.use("/author", authorRouter);


app.use(express.static(path.join(__dirname, '/frontend/dist')));



// Error handling middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

// Start the server
app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000!");
});
