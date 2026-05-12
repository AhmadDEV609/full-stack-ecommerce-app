import React from "react";
import { useQuery } from "@tanstack/react-query";
import "../css/orderstatus.css";

const Orderstatus = () => {

    const { data, isLoading, isError } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const res = await fetch(
                "http://localhost:5000/v1/api/order/user/order",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch orders");
            }

            return res.json();
        },

        refetchOnWindowFocus: true,
    });

    const orders = data?.orders || [];

    if (isLoading) {
        return <div className="order-container">Loading orders...</div>;
    }

    if (isError) {
        return <div className="order-container">Something went wrong</div>;
    }

    return (
        <div className="order-container">
            <h1 className="title">My Orders</h1>

            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                orders.map((order) => (
                    <div className="order-card" key={order._id}>
                        <div className="order-header">
                            <div>
                                <h2>{order.userId?.name}</h2>
                                <p className="location">
                                    {order.city}, {order.country}
                                </p>
                            </div>

                            <span className={`status ${order.status}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="order-body">
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Total:</strong> ${order.totalPrice}</p>
                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="progress">
                            <div className={`progress-bar ${order.status}`}></div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orderstatus;