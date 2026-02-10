import express from "express";
const app = express();
export default app;

import usersRouter from "#api/users";
import getUserFromToken from "#middleware/getUserFromToken";
import handlePostgresErrors from "#middleware/handlePostgresErrors";
import cors from "cors";
import morgan from "morgan";
//----------API routes
import liftsRouter from "#api/lifts";
import workoutsRouter from "#api/workouts";
import weightRouter from "#api/weight";
import nutritionRouter from "#api/nutrition";

//----------Middleware


app.use(cors({ origin: process.env.CORS_ORIGIN ?? /localhost/ }));

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(getUserFromToken);

app.get("/", (req, res) => res.send("Hello, World!"));

app.use("/users", usersRouter);

app.use(handlePostgresErrors);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

app.use("/api/lifts", liftsRouter);
app.use("/api/workouts", workoutsRouter);
app.use("/api/weight", weightRouter);
app.use("/api/nutrition", nutritionRouter);