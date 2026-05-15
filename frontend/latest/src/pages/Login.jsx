import React from 'react'
import image from '../assets/pics1.png'
import { useNavigate, Link } from 'react-router-dom'
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const apiURL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (form) => {
        try {
            const res = await fetch(`${apiURL}/v1/api/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                queryClient.invalidateQueries(["user"]);
                navigate("/");
            } else {
                alert(data.message);
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='continer'>
            <img className='image' src={image} alt="" />

            <div className='signupform'>
                <h1>Login</h1>

                <form onSubmit={handleSubmit(onSubmit)} className='form'>

                    <input
                        {...register("email", { required: "Email required" })}
                        placeholder="Email"
                        className='input'
                    />
                    {errors.email && <p>{errors.email.message}</p>}

                    <input
                        {...register("password", { required: "Password required" })}
                        type="password"
                        placeholder="Password"
                        className='input'
                    />
                    {errors.password && <p>{errors.password.message}</p>}

                    <button className='createBtn'>Login</button>

                    <button
                        type="button"
                        className='createBtn'
                        onClick={() => window.location.href = `${apiURL}/v1/api/user/google`}
                    >
                        Login with Google
                    </button>

                    <Link to="/reset-mail">Forgot Password</Link>
                    <Link to="/signup">Signup</Link>

                </form>
            </div>
        </div>
    );
};

export default Login;