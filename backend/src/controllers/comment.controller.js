import asyncHandler from "../utils/asyncHandler.js";
import adminProducts from "../models/adminproduct.model.js";
import dbconnection from "../db/dbconnection.js";

export const commentAdd = asyncHandler(async (req, res) => {

    const { comment, productId } = req.body;
    await adminProducts.findByIdAndUpdate(
        productId,
        {
            $push: {
                reviews: {
                    comment,
                    user: req.user.id
                }
            }
        }
    )

    res.status(200).json({ message: "Comment added" });
});



export const getSingleProduct = asyncHandler(async (req, res) => {

    const product = await adminProducts.findById(req.params.id)
        .populate({
            path: "reviews.user",
            select: "name _id"
        })
        .lean();

    if (!product) {
        const err = new Error("Not found");
        err.status = 404;
        throw err;
    }

    res.status(200).json({ product });
});



export const deleteComment = asyncHandler(async (req, res) => {

    const { productId, reviewId } = req.params;
    const product = await adminProducts.findByIdAndUpdate(
        productId,
        {
            $pull: {
                reviews: {
                    _id: reviewId,
                    user: req.user.id
                }
            }
        }
    )
    res.status(200).json({ message: "Deleted" });
});