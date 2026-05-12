import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "./services/passport.js";
import error from "./middleware/error.middleware.js";


const app = express();

app.use("/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/public/images", express.static("public/images"));

import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import cartRouter from "./routes/cart.route.js";
import wishlistRoute from "./routes/wishlist.route.js";
import orderRouter from "./routes/order.route.js";
import commentRoute from "./routes/comment.route.js";


app.use("/v1/api/user", userRouter);
app.use("/v1/api/admin/product", adminRouter);
app.use("/v1/api/cart", cartRouter);
app.use("/v1/api/wishlist", wishlistRoute);
app.use("/v1/api/order", orderRouter);
app.use("/v1/api/comment", commentRoute);




app.use(error);

export default app;