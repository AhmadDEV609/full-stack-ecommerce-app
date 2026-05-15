import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/cart.model.js";
import adminProducts from "../models/adminproduct.model.js";
import dbconnection from "../db/dbconnection.js";

export const addCart = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const { product, quantity, size } = req.body.items[0];

    const productData = await adminProducts
        .findById(product)
        .select("stock");

    if (!productData || productData.stock < 1) {
        const err = new Error("Out of stock");
        err.status = 409;
        throw err;
    }

    const updated = await Cart.findOneAndUpdate(
        { userId, "items.product": product },
        { $inc: { "items.$.quantity": quantity } },
        { new: true }
    );

    if (!updated) {
        await Cart.updateOne(
            { userId },
            {
                $push: {
                    items: {
                        product,
                        quantity,
                        size
                    }
                }
            },
            { upsert: true }
        );
    }

    return res.status(200).json({
        message: "Added to cart",
    });
});



export const displayCart = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne({ userId: req.user.id })
        .populate({
            path: "items.product",
            select: "name price thumbnail"
        })
        .lean();

    if (!cart || cart.items.length === 0) {
        return res.status(200).json({
            message: "Cart is empty",
            cart: { items: [] }
        });
    }

    const totalPrice = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return res.status(200).json({
        message: "Cart retrieved",
        cart,
        totalPrice
    });
});



export const increaseQuantity = asyncHandler(async (req, res) => {

    await Cart.updateOne(
        { userId: req.user.id, "items.product": req.params.id },
        { $inc: { "items.$.quantity": 1 } }
    );

    return res.status(200).json({
        message: "Quantity increased"
    });
});



export const decreaseQuantity = asyncHandler(async (req, res) => {

    await Cart.updateOne(
        { userId: req.user.id, "items.product": req.params.id, "items.quantity": { $gt: 1 } },
        { $inc: { "items.$.quantity": -1 } }
    );

    return res.status(200).json({
        message: "Quantity decreased"
    });
});



export const deleteCartitem = asyncHandler(async (req, res) => {

    await Cart.updateOne(
        { userId: req.user.id },
        { $pull: { items: { product: req.params.id } } }
    );

    return res.status(200).json({
        message: "Item deleted"
    });
});