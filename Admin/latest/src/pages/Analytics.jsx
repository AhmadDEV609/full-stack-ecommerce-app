import React, { useEffect, useState } from "react";
import "../css/analytics.css";

const Analytics = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const fetchOrders = async () => {
        try {
            const res = await fetch(
                `${apiURL}/v1/api/order/all`,
                { credentials: "include" }
            );

            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.log("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const totalOrders = orders.length;

    let Revenue = 0
    const totalRevenue = orders.reduce((a, b) => {
        if (b.status === 'delivered') {
            return Revenue += a + Number(b.totalPrice)
        } else {
            return Revenue = 0
        }
    }, 0)
    console.log(Revenue)
    const pendingOrders = orders.filter(
        (o) => o.status === "pending"
    ).length;

    const deliveredOrders = orders.filter(
        (o) => o.status === "delivered"
    ).length;




    if (loading) {
        return <h2 className="loading">Loading...</h2>;
    }

    return (
        <div className="analytics-container">
            <h1 className="title">Admin Analytics Dashboard</h1>

            <div className="card-grid">
                <div className="card blue">
                    <h3>Total Orders</h3>
                    <p>{totalOrders}</p>
                </div>

                <div className="card green">
                    <h3>Total Revenue</h3>
                    <p>${Revenue}</p>
                </div>

                <div className="card orange">
                    <h3>Pending Orders</h3>
                    <p>{pendingOrders}</p>
                </div>

                <div className="card red">
                    <h3>Delivered Orders</h3>
                    <p>{deliveredOrders}</p>
                </div>
            </div>

            <div className="table-section">
                <h2>Recent Orders</h2>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.orderStatus}</td>
                                    <td>{order.paymentStatus}</td>
                                    <td>₹ {order.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;