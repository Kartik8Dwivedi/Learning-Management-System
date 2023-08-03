import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import connectToDB from "./config/dbConnection.js";

const app = express();

connectToDB();

app.use(json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/ping", (req, res) => {
  res.send("Pong");
});

app.use("/api/v1/user", userRoutes);

app.all("*", (req, res) => {
  res.status(200).send("OOPS! 404 page not found");
});

app.use(errorMiddleware); // It will handle the errors passed to next

export default app;
