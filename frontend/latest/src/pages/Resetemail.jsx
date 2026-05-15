import React, { useState } from 'react';

const apiURL = import.meta.env.VITE_BACKEND_URL;

const Resetemail = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${apiURL}/v1/api/user/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Reset token generated (check response)");
                console.log("RESET TOKEN:", data.resetToken);
                setEmail("");
            } else {
                setMessage(data.message);
            }

        } catch (err) {
            setMessage("Server error");
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
            <form onSubmit={handleSubmit} style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                width: "300px"
            }}>
                <h2 style={{ textAlign: "center" }}>Reset Password</h2>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        outline: "none"
                    }}
                />

                <button style={{
                    padding: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}>
                    Forget Password
                </button>

                <p style={{
                    textAlign: "center",
                    color: message.includes("error") ? "red" : "green"
                }}>
                    {message}
                </p>
            </form>
        </div>
    );
};

export default Resetemail;