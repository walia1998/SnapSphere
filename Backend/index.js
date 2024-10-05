import express, {urlencoded} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import connectDB from "./utils/dbs.js";
import userRoute from './routes/userRoute.js';
import postRoute from "./routes/postRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { app, server} from "./socketIo/socket.js";




dotenv.config({})

const PORT = process.env.PORT || 3000;

app.get("/", (_,res) => {
  return res.status(200).json({
    message: "I'm coming from backend",
    success: true,
  });
});

//MiddleWare
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));

// Yahan par Api aayengi

app.use("/api/v2/user", userRoute);
app.use("/api/v2/post", postRoute);
app.use("/api/v2/message", messageRoute);


server.listen(PORT, () => {
    connectDB();
  console.log(`Server listen at port ${PORT}`);
});
