import image from '../assets/pics1.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/login.css'

const Login = () => {
    const navigate = useNavigate()
    const [form, setform] = useState({
        email: '',
        password: ''
    })
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    console.log(apiURL)

    function handlesubmit(e) {
        e.preventDefault()
        const loginData = async () => {
            try {
                const res = await fetch(`${apiURL}/v1/api/user/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form),
                    credentials: 'include'
                })

                const data = await res.json()

                if (res.ok) {

                    navigate('/')
                } else {
                    console.log(data.message)
                }
            } catch (error) {
                console.log(error)
            }
        }

        loginData()

    }



    return (
        <>

            <div className='continer'>
                <img className='image' src={image} alt="" />
                <div className='signupform'>
                    <div></div>
                    <h1>Login in to Go Cart</h1>
                    <h5 className='text'>Enter your detail below</h5>
                    <form onSubmit={handlesubmit} className='form'  >
                        <input value={form.email} onChange={(e) => setform({ ...form, email: e.target.value })} className='input' type="text" placeholder='Enter Email...' />
                        <input value={form.password} onChange={(e) => setform({ ...form, password: e.target.value })} className='input' type="password" placeholder='Enter Password...' />
                        <button className='createBtn' type='submit'>Login</button>

                    </form>

                </div>
            </div>
        </>
    )
}

export default Login