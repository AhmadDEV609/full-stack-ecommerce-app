import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordpage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiURL}/v1/api/user/newPassword/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newPassword: password })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Password updated successfully");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(data.message || "Something went wrong");
            }
        } catch (error) {
            setMessage("Server error");
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f4f6f8"
        }}>
            <form onSubmit={handleSubmit} style={{
                padding: "30px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                textAlign: "center"
            }}>
                <h2>Reset Password</h2>

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: "10px",
                        margin: "15px 0",
                        width: "100%",
                        borderRadius: "5px",
                        border: "1px solid #ccc"
                    }}
                />

                <button type="submit" style={{
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}>
                    Update Password
                </button>

                <p style={{ marginTop: "10px", color: "green" }}>{message}</p>
            </form>
        </div>
    );
};

export default ResetPasswordpage;