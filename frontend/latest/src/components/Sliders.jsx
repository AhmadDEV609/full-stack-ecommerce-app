import React from "react"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import banner1 from '../assets/banner1.jpg'
import banner2 from '../assets/banner2.jpg'
import banner3 from '../assets/banner3.jpg'
import '../css/slider.css'

const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
}

const Sliders = () => {
    return (
        <Slider className="sliders-container" {...settings}>
            <div>
                <img className="images" src={banner1} alt="" />
            </div>
            <div>
                <img className="images" src={banner2} alt="" />
            </div>
            <div>
                <img className="images" src={banner3} alt="" />
            </div>
        </Slider>
    )
}

export default React.memo(Sliders)