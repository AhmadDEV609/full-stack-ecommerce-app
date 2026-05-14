import '../css/signup.css'
import image from '../assets/pics1.png'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from "react-hook-form";
const Signup = () => {
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    function handlesubmit(form) {

        const signupData = async () => {
            try {
                const res = await fetch(`${apiURL}/v1/api/user/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                })
                const data = await res.json()
                if (res.ok) {
                    alert(data.message)
                    reset()
                }
                setform('')
            } catch (error) {
                console.log(error)
            }
        }

        signupData()

    }
    return (
        <>

            <div className='continer'>
                <img className='image' src={image} alt="" />
                <div className='signupform'>
                    <div></div>
                    <h1>Create an account</h1>
                    <h5 className='text'>Enter your detail below</h5>
                    <form onSubmit={handleSubmit(handlesubmit)} action='/v1/api/user/signup' method='POST' className='form'  >
                        <input {...register("name", {
                            required: 'name is required'
                        })}
                            className='input'
                            type="text"
                            placeholder='Enter Name...' />
                        {errors.name && (
                            <p style={{ color: "red", fontSize: "7px" }}>
                                {errors.name.message}
                            </p>
                        )}
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
                            <p style={{ color: "red", fontSize: "7px" }}>
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
                            <p style={{ color: "red", fontSize: "7px" }}>
                                {errors.password.message}
                            </p>
                        )}

                        <button type='submit' className='createBtn' >Create Account</button>
                        <button className='createBtn' >Login with Google</button>
                        <h3>Already have account? <Link to={'/login'}>Log in</Link></h3>
                    </form>

                </div>
            </div>
        </>
    )
}

export default Signup