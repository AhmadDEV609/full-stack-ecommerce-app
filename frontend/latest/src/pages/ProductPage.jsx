import { useQuery } from '@tanstack/react-query';
import '../css/product.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProductPage = () => {
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const [catagory, setCatagory] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [debounce, setdebounce] = useState('')
    const [priceRange, setPriceRange] = useState(0);
    const [debouncedPrice, setDebouncedPrice] = useState(0);
    const limit = 8;
    useEffect(() => {
        const timer = setTimeout(() => {
            setdebounce(search)
        }, 500);

        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPrice(Number(priceRange));
        }, 500);

        return () => clearTimeout(timer);
    }, [priceRange]);


    const { data, isLoading, isError } = useQuery({
        queryKey: ['productsData', catagory, debounce, page, debouncedPrice],
        queryFn: async () => {

            const query = new URLSearchParams({
                catagory,
                search: debounce,
                maxPrice: debouncedPrice,
                page,
                limit
            });


            const res = await fetch(
                `${apiURL}/v1/api/admin/product/allProducts?${query}`
            );

            return res.json();
        }
    });


    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading products</p>;

    const products = data?.data?.docs || [];
    const totalPages = data?.data?.totalPages || 1;

    return (
        <div className="pd-container">

            {/* SEARCH */}
            <div className="pd-search-box">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            <div className="pd-wrapper">

                {/* CATEGORY */}
                <aside className="pd-sidebar-desktop">
                    <h3>Categories</h3>

                    <ul>
                        <li onClick={() => { setCatagory(''); setPage(1); }}>
                            All
                        </li>

                        <li onClick={() => { setCatagory('Electronics'); setPage(1); }}>
                            Electronics
                        </li>

                        <li onClick={() => { setCatagory('Footwear'); setPage(1); }}>
                            Footwear
                        </li>

                        <li onClick={() => { setCatagory('Clothing'); setPage(1); }}>
                            Clothing
                        </li>
                        <li onClick={() => { setCatagory('Shoes'); setPage(1); }}>
                            Shoes
                        </li>
                    </ul>
                    <br></br>
                    <h4>Price : {priceRange}</h4>
                    <br></br>
                    <input type="range" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} min="0"
                        max="3000" />

                </aside>

                {/* PRODUCTS */}
                <main className="pd-products">

                    <h1>Products</h1>

                    <div className="pd-grid">

                        {products.length === 0 ? (
                            <p>No products found</p>
                        ) : (

                            products.map((item) => (
                                <div className="pd-card" key={item._id}>

                                    <img
                                        src={`http://localhost:5000/public/images/${item.thumbnail}`}
                                        alt={item.name}
                                    />

                                    <h3>{item.name}</h3>
                                    <p className="pd-price">${item.price}</p>

                                    <Link to={`/product-detail/${item._id}`}>
                                        <button className="pd-btn">
                                            See Detail
                                        </button>
                                    </Link>

                                </div>
                            ))
                        )}

                    </div>

                    {/* PAGINATION */}
                    <div className="pd-pagination">

                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Prev
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default ProductPage;