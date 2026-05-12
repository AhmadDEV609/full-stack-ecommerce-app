import express from "express";
import auth from "../middleware/auth.middleware.js";
import { isUser, isAdmin } from "../middleware/role.check.middleware.js";

import {
    addOrderitem,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    markOrderPaid
} from "../controllers/order.controller.js";

import { createPaymentIntent } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/add", auth, isUser, addOrderitem);
router.get("/user/order", auth, isUser, getUserOrders);
// this is for online payment intergration
router.post("/create", auth, isUser, createPaymentIntent);
router.post("/mark-paid", auth, isUser, markOrderPaid);

// this api is for admin
router.get("/all", auth, isAdmin, getAllOrders);
router.put("/status/:id", auth, isAdmin, updateOrderStatus);

export default router;