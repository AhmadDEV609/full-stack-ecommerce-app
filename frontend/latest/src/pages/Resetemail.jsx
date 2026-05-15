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
        <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
            <form onSubmit={handleSubmit}>
                <h2>Reset Password</h2>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                />

                <button>Generate Reset Token</button>

                <p>{message}</p>
            </form>
        </div>
    );
};

export default Resetemail;