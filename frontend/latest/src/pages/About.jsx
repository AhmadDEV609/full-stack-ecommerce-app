import React from 'react'
import '../css/about.css'
const About = () => {
    return (
        <div class="about-container">
            <div class="about-content">
                <h1>About Us</h1>
                <p>
                    Welcome to our store! We are committed to providing high-quality products
                    with excellent customer service. Our goal is to deliver the best shopping
                    experience with trusted brands and affordable prices.
                </p>

                <div class="about-grid">
                    <div class="about-box">
                        <h3>Our Mission</h3>
                        <p>To provide premium products with customer satisfaction as our priority.</p>
                    </div>

                    <div class="about-box">
                        <h3>Our Vision</h3>
                        <p>To become a leading eCommerce platform trusted worldwide.</p>
                    </div>

                    <div class="about-box">
                        <h3>Why Choose Us</h3>
                        <p>Fast delivery, quality products, and 24/7 customer support.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About