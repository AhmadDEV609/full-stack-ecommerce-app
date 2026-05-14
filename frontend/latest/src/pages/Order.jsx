import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useNavigate } from 'react-router-dom'
import "../css/order.css";

const stripePromise = loadStripe("pk_test_51TPnP07A1bE5x6fsdfjMlDLIlNLBI9WO7rSoOXQAofwL9i71S1ZvCbIaJnBa9sgaDIMaxdR34SV8p0Br9BhsJiKM00sI6V4zeF");
const apiURL = import.meta.env.VITE_BACKEND_URL;
const Order = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        zip: "",
        country: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [clientSecret, setClientSecret] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [showStripe, setShowStripe] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const res = await fetch(`${apiURL}/v1/api/cart/display`, {
                credentials: "include",
            });
            return res.json();
        },
    });

    const items = data?.cart?.items || [];
    const totalPrice = data?.totalPrice || 0;

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // COD
    const handleCOD = async () => {
        if (!items.length) return toast.error("Cart empty");

        const res = await fetch(`${apiURL}/v1/api/order/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                ...form,
                paymentMethod: "cod",
            }),
        });

        const data = await res.json();

        if (res.ok && data?.order?._id) {
            toast.success("Order placed");
            queryClient.invalidateQueries(["cart"]);
            setTimeout(() => {
                navigate('/order/status')
            }, 2000);
        } else {
            toast.error("Order failed");
        }
    };

    // STRIPE FLOW (FIXED)
    const handleStripeFlow = async () => {
        if (!items.length) return toast.error("Cart empty");

        const orderRes = await fetch(`${apiURL}/v1/api/order/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                ...form,
                paymentMethod: "card",
            }),
        });

        const orderData = await orderRes.json();

        if (!orderData?.order?._id) {
            return toast.error("Order creation failed");
        }

        setOrderId(orderData.order._id);

        const stripeRes = await fetch(`${apiURL}/v1/api/order/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                orderId: orderData.order._id,
            }),
        });

        const stripeData = await stripeRes.json();

        if (!stripeData?.clientSecret) {
            return toast.error("Stripe init failed");
        }

        setClientSecret(stripeData.clientSecret);
        setShowStripe(true);
        toast.success("Proceed to payment");
    };

    if (isLoading) return <div className="checkout-loading">Loading...</div>;

    return (
        <div className="checkout-page">
            <ToastContainer />

            <div className="checkout-wrapper">

                <div className="checkout-left">

                    <div className="checkout-box">
                        <h3 className="section-title">Shipping Details</h3>

                        <input name="fullName" placeholder="Full Name" onChange={handleChange} />
                        <input name="phone" placeholder="Phone" onChange={handleChange} />
                        <input name="address" placeholder="Address" onChange={handleChange} />
                        <input name="city" placeholder="City" onChange={handleChange} />
                        <input name="zip" placeholder="ZIP" onChange={handleChange} />
                        <input name="country" placeholder="Country" onChange={handleChange} />
                    </div>

                    <div className="payment-method">

                        <h4>Payment Method</h4>

                        <button
                            className={paymentMethod === "cod" ? "active" : ""}
                            onClick={() => {
                                setPaymentMethod("cod");
                                setShowStripe(false);
                            }}
                        >
                            Cash on Delivery
                        </button>

                        <button
                            className={paymentMethod === "card" ? "active" : ""}
                            onClick={() => setPaymentMethod("card")}
                        >
                            Card Payment
                        </button>
                    </div>

                    {paymentMethod === "card" && showStripe && clientSecret && (
                        <div className="card-payment-box">
                            <h4>Enter Card Details</h4>

                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm
                                    clientSecret={clientSecret}
                                    orderId={orderId}
                                />
                            </Elements>
                        </div>
                    )}

                </div>

                <div className="checkout-right">

                    <h3 className="summary-title">Order Summary</h3>

                    <div className="summary-items">
                        {items.map((item) => (
                            <div className="summary-item" key={item._id}>
                                <div className="summary-info">
                                    <p>{item.product?.name}</p>
                                    <span>Qty: {item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="summary-total">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                    </div>

                    <button
                        className="checkout-btn"
                        onClick={() =>
                            paymentMethod === "card"
                                ? handleStripeFlow()
                                : handleCOD()
                        }
                    >
                        Place Order
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Order;