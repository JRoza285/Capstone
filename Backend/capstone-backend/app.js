import express from "express";
const app = express();
export default app;

import cors from "cors";
import morgan from "morgan";

// Middleware
import getUserFromToken from "#middleware/getUserFromToken";
import handlePostgresErrors from "#middleware/handlePostgresErrors";

// API routes
import usersRouter from "#api/users";
import liftsRouter from "#api/lifts";
import workoutsRouter from "#api/workouts";
import weightRouter from "#api/weight";
import nutritionRouter from "#api/nutrition";
import faqRouter from "#api/faq"; // ✅ FIX: added FAQ router

// ---------------- Middleware setup ----------------

app.use(cors({ origin: process.env.CORS_ORIGIN ?? /localhost/ }));
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(getUserFromToken);

// ---------------- Routes ----------------

app.get("/", (req, res) => res.send("Hello, World!"));

// User routes
app.use("/users", usersRouter);

// API routes
app.use("/api/lifts", liftsRouter);
app.use("/api/workouts", workoutsRouter);
app.use("/api/weight", weightRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/faq", faqRouter); // ✅ FIX: this was missing

// ---------------- Error handling ----------------

app.use(handlePostgresErrors);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});