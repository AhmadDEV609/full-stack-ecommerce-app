import React, { useState } from 'react';

const Resetemail = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiURL}/v1/api/user/reset`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Password reset email sent");
                setEmail('')
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
                <h2>Forgot Password</h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}>
                    Send Reset Link
                </button>

                <p style={{ marginTop: "10px", color: "green" }}>
                    {message}
                </p>
            </form>
        </div>
    );
};

export default Resetemail;