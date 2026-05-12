import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'adminproduct',
        required: true
    }
})

const wishlist = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wishlistItem: [productSchema]
}, { timestamps: true })


const wishlistData = mongoose.model('wishlist', wishlist)
export default wishlistData