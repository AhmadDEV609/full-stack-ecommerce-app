import asyncHandler from "../utils/asyncHandler.js";
import wishlistData from "../models/wishlist.model.js";
import dbconnection from "../db/dbconnection.js";

const addTowishlist = asyncHandler(async (req, res) => {

    if (!req.user) {
        const err = new Error("Not logged in");
        err.status = 401;
        throw err;
    }

    let wishlist = await wishlistData.findOne({ userid: req.user.id });

    if (!wishlist) {
        wishlist = new wishlistData({
            userid: req.user.id,
            wishlistItem: []
        });
    }

    const items = req.body.wishlistItem;

    if (!Array.isArray(items)) {
        const err = new Error("wishlistItem must be array");
        err.status = 400;
        throw err;
    }

    for (const item of items) {

        if (!item.product) continue;

        const exists = wishlist.wishlistItem.find(
            (i) => i.product.toString() === item.product
        );

        if (!exists) {
            wishlist.wishlistItem.push({
                product: item.product
            });
        }
    }

    await wishlist.save();

    res.status(200).send({
        message: "Added to wishlist",
        wishlist
    });
});



const deleteWishlist = asyncHandler(async (req, res) => {

    const wishlist = await wishlistData.findOne({ userid: req.user.id });

    if (!wishlist) {
        const err = new Error("Wishlist not found");
        err.status = 404;
        throw err;
    }

    wishlist.wishlistItem = wishlist.wishlistItem.filter(
        (item) => item.product.toString() !== req.params.id
    );

    await wishlist.save();

    res.status(200).send({
        message: "Item removed",
        wishlist
    });
});



const getWishlist = asyncHandler(async (req, res) => {

    const wishlist = await wishlistData
        .findOne({ userid: req.user.id })
        .populate("wishlistItem.product")
        .lean();

    res.status(200).send({
        wishlist
    });
});


export { addTowishlist, deleteWishlist, getWishlist };