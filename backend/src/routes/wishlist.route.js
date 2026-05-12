import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { isUser } from "../middleware/role.check.middleware.js";

import {
    addTowishlist,
    deleteWishlist,
    getWishlist
} from "../controllers/wishlist.controller.js";

const wishlistRoute = Router();


wishlistRoute.post("/add", auth, isUser, addTowishlist);
wishlistRoute.get("/", auth, isUser, getWishlist);
wishlistRoute.delete("/delete/:id", auth, isUser, deleteWishlist);

export default wishlistRoute;