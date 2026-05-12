import React from 'react'
import '../css/contact.css'
const Contact = () => {
    return (
        <div class="contact-container">

            <div class="contact-info">
                <h2>Contact Us</h2>
                <p>Have questions? We'd love to hear from you.</p>

                <div class="info-box">
                    <p><strong>Email:</strong> support@yourstore.com</p>
                    <p><strong>Phone:</strong> +92 300 1234567</p>
                    <p><strong>Address:</strong> Lahore, Pakistan</p>
                </div>
            </div>

            <div class="contact-form">
                <form>
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <textarea rows="5" placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>

        </div>
    )
}

export default Contact