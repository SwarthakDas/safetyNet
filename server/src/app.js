import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as userRouter } from "./routes/user.routes.js";
import { router as departmentRouter } from "./routes/department.routes.js"; // ✅ Import department routes

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/civilian", userRouter);
app.use("/department", departmentRouter); 

export { app };