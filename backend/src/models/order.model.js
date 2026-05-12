import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "adminproduct",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [orderProductSchema],

        totalPrice: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            default: "pending",
        },

        paymentMethod: {
            type: String,
            default: "cod",
        },

        paymentStatus: {
            type: String,
            default: "unpaid",
        },


        fullName: String,
        phone: String,
        address: String,
        city: String,
        zip: String,
        country: String,
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);