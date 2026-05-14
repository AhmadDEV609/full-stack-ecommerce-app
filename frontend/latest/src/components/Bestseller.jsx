import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import '../css/bestSeller.css'
export const fetchProducts = async () => {
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`${apiURL}/v1/api/admin/product/bestSeller`)
    if (!res.ok) throw new Error('Products is not fetch')
    const data = await res.json();
    return data;
}

const Bestseller = () => {


    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['product'],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5
    })



    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3, slidesToScroll: 3 },
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 2, slidesToScroll: 2 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1, slidesToScroll: 1 },
            },
        ],
    };

    if (isError) {
        return <h1>{isError}</h1>
    }
    if (isLoading) {
        return <h1>loading.....</h1>
    }

    return (

        <div className="bst-wrapper-slider">
            <Slider {...settings}>
                {data?.bestSellerData?.map((product) => (
                    <Link
                        className="bst-professional-link"
                        to={`/product-detail/${product._id}`}
                        key={product._id}
                    >
                        <div className="slide-item">
                            <div className="bst-professional-card">
                                <div className="bst-image-wrapper">
                                    <img
                                        className="bst-main-image"
                                        src={`http://localhost:5000/public/images/${product.thumbnail}`}
                                        alt={product.name}
                                    />

                                    {product.istopSeller && (
                                        <span className="bst-top-badge">
                                            Best Seller
                                        </span>
                                    )}
                                </div>

                                <div className="bst-product-details">
                                    <h4 className="bst-product-title">
                                        {product.name}
                                    </h4>

                                    <p className="bst-product-price">
                                        ${product.price}
                                    </p>

                                    <p className="bst-product-category">
                                        {product.catagory}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </Slider>
        </div>

    );
};

export default Bestseller;