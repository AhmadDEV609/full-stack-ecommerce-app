import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import adminProducts from "../models/adminproduct.model.js";
import mongoose from "mongoose";
import dbconnection from "../db/dbconnection.js";

const addOrderitem = asyncHandler(async (req, res) => {
    await dbconnection()

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const userId = req.user.id;

        const cart = await Cart.findOne({ userId })
            .populate("items.product")
            .session(session);

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        let totalPrice = 0;

        const orderItems = cart.items.map((item) => {
            const product = item.product;

            if (!product || !product.price) {
                throw new Error("Product data missing");
            }

            totalPrice += product.price * item.quantity;

            return {
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            };
        });


        for (const item of cart.items) {
            const updated = await adminProducts.findOneAndUpdate(
                {
                    _id: item.product._id,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: { stock: -item.quantity }
                },
                { session }
            );

            if (!updated) {
                throw new Error("Insufficient stock");
            }
        }

        const order = await Order.create([{
            userId,
            items: orderItems,
            totalPrice,
            status: "pending",
            paymentStatus: "unpaid",
            paymentMethod: req.body.paymentMethod || "cod",
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
        }], { session });

        cart.items = [];
        await cart.save({ session });


        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Order created successfully",
            order: order[0],
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            message: error.message,
        });
    }
});



export const getAllOrders = asyncHandler(async (req, res) => {
    await dbconnection()
    const orders = await Order.find()
        .populate("userId", "name email")
        .populate("items.product")
        .sort({ createdAt: -1 })
        .lean()

    res.json({ orders });
});



export const getUserOrders = asyncHandler(async (req, res) => {
    await dbconnection()
    const orders = await Order.find({ userId: req.user.id })
        .populate("items.product")
        .lean();

    res.json({ orders });
});



// this is for admin panal 

export const updateOrderStatus = asyncHandler(async (req, res) => {
    await dbconnection()
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    if (!order) {
        const err = new Error("Order not found");
        err.status = 404;
        throw err;
    }

    order.status = status
    if (status === 'delivered') {
        order.paymentStatus = 'paid'
    } else if (status !== 'delivered') {
        order.paymentStatus = 'unpaid'
    }

    await order.save()

    res.json({
        message: "Status updated",
        order,
    });
});

// this is for stripe
export const markOrderPaid = asyncHandler(async (req, res) => {
    await dbconnection()
    const { orderId, paymentIntentId } = req.body;

    if (!orderId) {
        return res.status(400).json({ message: "OrderId missing" });
    }

    const order = await Order.findByIdAndUpdate(
        orderId,
        {
            paymentStatus: "paid",
            status: "processing",
            paymentIntentId: paymentIntentId || null,
        },
        { new: true }
    );

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    res.json({
        message: "Payment marked as paid",
        order,
    });
});


export { addOrderitem };