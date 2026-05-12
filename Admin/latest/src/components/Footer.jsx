import React from 'react'
import '../css/footer.css'
const Footer = () => {
    return (
        <>
            <footer className='footer-container' >
                <div className='inner-container'>
                    <ul>
                        <li className='heading'>GoCart</li>
                        <li>Subcribe</li>
                        <li>Get 10% off your first order</li>
                        <input type="text" placeholder='Enter your mail' />
                    </ul>
                    <ul>
                        <li className='heading'>Support</li>
                        <li>Main ferozpure road near Arfa tower, Lahore</li>
                        <li>Gocart@gmail.com</li>
                        <li>+9232614809199</li>
                    </ul>
                    <ul>
                        <li className='heading'>Account</li>
                        <li>Login/Signup</li>
                        <li>Wishlist</li>
                        <li>Shop</li>
                    </ul>

                    <ul>
                        <li className='heading'>Quick Link</li>
                        <li>Privacy Policy</li>
                        <li>Team of use</li>
                        <li>FAQ</li>
                        <li>Contact</li>
                    </ul>

                </div>
            </footer>
        </>
    )
}

export default Footer