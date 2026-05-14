import React, { memo } from 'react'
import Sliders from '../components/Sliders'
import Bestseller from '../components/Bestseller'
import testomonial from '../assets/testimonial.png'
import '../css/home.css'
import arrival from '../assets/arrival.png'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

const apiURL = import.meta.env.VITE_BACKEND_URL;
export const fetchProduct = async () => {

    const res = await fetch(`${apiURL}/v1/api/admin/product/ourProducts`)
    if (!res.ok) throw new Error('product is not fetch')
    const data = await res.json()
    return data
}

const Home = () => {
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProduct,
        staleTime: 1000 * 60 * 5
    })

    return (
        <>
            <Sliders />

            <div className='main'>
                <h3 className='month'>This month</h3>
                <div className='seller-container'>
                    <h3 className='text'>Best Selling Products</h3>
                </div>
            </div>

            <Bestseller />

            <div className='main'>
                <h3 className='month'>Our Products</h3>

                <div className='products-grid'>
                    {isLoading && <p>Loading products...</p>}
                    {isError && <p>{error.message}</p>}

                    {data?.products.map((product) => (
                        <div className='product-card' key={product._id}>
                            <Link className='link' to={`/product-detail/${product._id}`}>
                                <img
                                    src={`${apiURL}/public/images/${product.thumbnail}`}
                                    alt={product.name}
                                    className='product-image'
                                />
                                <h4 className='product-name'>{product.name}</h4>
                                <p className='product-price'>Rs. {product.price}</p>
                                <p className='product-brand'>{product.brand}</p>
                                <button className='product-btn'>See Detail</button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <div className='conatiner-btn'>
                <Link className='link' to={'/product'}> <button className='btn-all'>View All Products</button></Link>
            </div>

            <div className='main'>
                <h3 className='month'>New Arrivals</h3>
                <Link to={'/product'}> <img className='arrival-image' src={arrival} alt="" /></Link>
            </div>

            <div className='testomonial-image-container'>
                <img className='testomonial-image' src={testomonial} alt="" />
            </div>
        </>
    )
}

export default memo(Home)