import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const apiURL = import.meta.env.VITE_BACKEND_URL;

const ResetPasswordpage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${apiURL}/v1/api/user/newPassword/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword: password })
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Password updated");
            setTimeout(() => navigate("/login"), 1500);
        } else {
            setMessage(data.message);
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f5f5f5"
        }}>
            <div style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                width: "320px",
                textAlign: "center"
            }}>
                <h2 style={{ marginBottom: "20px" }}>Reset Password</h2>

                <form onSubmit={handleSubmit} style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px"
                }}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password"
                        style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            outline: "none"
                        }}
                    />

                    <button style={{
                        padding: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}>
                        Update Password
                    </button>
                </form>

                <p style={{
                    marginTop: "15px",
                    color: message.includes("updated") ? "green" : "red"
                }}>
                    {message}
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordpage;