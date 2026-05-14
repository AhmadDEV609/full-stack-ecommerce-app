import React, { useEffect, useState } from "react";
import "../css/order.css";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const fetchOrders = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `${apiURL}/v1/api/order/all`,
                { credentials: "include" }
            );

            const data = await res.json();
            setOrders(data.orders || []);
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    console.log(orders)

    const handleChange = async (id, status) => {
        try {
            setLoadingId(id);

            await fetch(
                `${apiURL}/v1/api/order/status/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ status })
                }
            );

            setLoadingId(null);
            fetchOrders();

        } catch (error) {
            console.log(error);
            setLoadingId(null);
        }
    };

    if (loading) return <p className="loading-text">Loading orders...</p>;

    return (
        <div className="admin-orders">

            <div className="admin-header">
                <h2>Orders Management</h2>
                <p>Total Orders: {orders.length}</p>
            </div>

            {orders.length === 0 && (
                <p className="empty-text">No orders found</p>
            )}

            {orders.map(order => (
                <div key={order._id} className="order-card">


                    <div className="order-grid">

                        <div className="card-box">
                            <h4>User</h4>
                            <p>{order.userId?.name}</p>
                            <span>{order.userId?.email}</span>
                        </div>

                        <div className="card-box">
                            <h4>Shipping</h4>
                            <p>{order.address || "N/A"}</p>
                            <span>{order.city || ""} {order.country || ""}</span>
                        </div>

                        <div className="card-box total-box">
                            <h4>Total Amount</h4>
                            <h3>${order.totalPrice}</h3>
                            <h3>{order.paymentStatus}</h3>
                        </div>

                    </div>


                    <div className="order-status">

                        <div className={`status-pill ${order.status}`}>
                            {order.status}
                        </div>

                        <select
                            value={order.status}
                            onChange={(e) =>
                                handleChange(order._id, e.target.value)
                            }
                            disabled={loadingId === order._id}
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        {loadingId === order._id && (
                            <span className="loading-small">Updating...</span>
                        )}

                    </div>

                    <div className="table-wrapper">

                        <table className="order-table">

                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {order.items.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.product?.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.price}</td>
                                        <td>${item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                </div>
            ))}
        </div>
    );
};

export default Orders;