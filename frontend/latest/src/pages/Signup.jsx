import image from '../assets/pics1.png'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import '../css/signup.css'
const apiURL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (form) => {
        try {
            const res = await fetch(`${apiURL}/v1/api/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Signup sucessfully");
                reset();
                navigate("/login");
            } else {
                alert(data.message);
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className='continer'>

                <img className='image' src={image} alt="" />

                <div className='signupform'>
                    <h1>Signup</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className='form'>

                        <input
                            {...register("name", { required: "Name required" })}
                            placeholder="Name"
                            className='input'
                        />
                        {errors.name && <p>{errors.name.message}</p>}

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

                        <button className='createBtn'>Create Account</button>

                        <button type="button" className='createBtn'
                            onClick={() => window.location.href = `${apiURL}/v1/api/user/google`}
                        >
                            Signup with Google
                        </button>

                        <Link style={{ color: 'black' }} to="/login">Login</Link>

                    </form>
                </div>
            </div>
        </>
    );
};

export default Signup;