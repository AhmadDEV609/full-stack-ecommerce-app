import React from 'react'
import image from '../assets/pics1.png'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import '../css/login.css'


const apiURL = import.meta.env.VITE_BACKEND_URL;
const Login = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    function handlesubmit(form) {
        const loginData = async () => {
            try {
                const res = await fetch(`${apiURL}/v1/api/user/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form),
                    credentials: 'include'
                });

                const data = await res.json();
                console.log(data)
                if (res.ok) {
                    navigate('/');
                    queryClient.invalidateQueries({ queryKey: ["user"] });
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loginData();
    }

    const handleGoogleLogin = () => {
        window.location.href = `${apiURL}/v1/api/user/google`;
    }

    return (
        <div className='continer'>
            <img className='image' src={image} alt="" />

            <div className='signupform'>
                <h1>Login in to Go Cart</h1>
                <h5 className='text'>Enter your detail below</h5>

                <form onSubmit={handleSubmit(handlesubmit)} className='form'>
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email format"
                            }
                        })}
                        className='input'
                        type="text"
                        placeholder='Enter Email...'
                    />
                    {errors.email && (
                        <p style={{ color: "red", fontSize: "12px" }}>
                            {errors.email.message}
                        </p>
                    )}


                    <input
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 5,
                                message: "Password must be at least 5 characters"
                            }
                        })}
                        className='input'
                        type="password"
                        placeholder='Enter Password...'
                    />
                    {errors.password && (
                        <p style={{ color: "red", fontSize: "12px" }}>
                            {errors.password.message}
                        </p>
                    )}


                    <button className='createBtn' type='submit'>
                        Login
                    </button>


                    <button
                        type="button"
                        className='createBtn'
                        onClick={handleGoogleLogin}
                    >
                        Login with Google
                    </button>

                    <Link className='link1' to={'/reset-mail'}>
                        Forget Password
                    </Link>
                    <Link className='link1' to={'/signup'}>
                        Signup
                    </Link>

                </form>
            </div>
        </div>
    )
}

export default Login