import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const adminProduct = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        min: [0, "Price cannot be negative"]
    },
    catagory: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    gallery: {
        type: [String],
        default: []
    },
    istopSeller: {
        type: Boolean,
        default: false
    },
    sizes: {
        type: [String],
        default: []
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    brand: {
        type: String
    },
    sku: {
        type: String,
        unique: true
    },
    reviews: [reviewSchema]
}, { timestamps: true });

adminProduct.plugin(mongoosePaginate)
const adminProducts = mongoose.model('adminproduct', adminProduct);

export default adminProducts;