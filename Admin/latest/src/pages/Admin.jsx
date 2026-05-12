import React, { useEffect, useState } from 'react';
import '../css/admin.css';
import { Link } from 'react-router-dom';

const Admin = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:5000/v1/api/admin/product/display');

            if (!res.ok) {
                console.log('API error:', res.status);
                setProducts([]);
                return;
            }

            const data = await res.json();
            setProducts(data.data || []);

        } catch (error) {
            console.log(error);
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    async function deletebtn(id) {
        try {
            const res = await fetch(`http://localhost:5000/v1/api/admin/product/delete/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('item is deleted');
                fetchProducts();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="admin-container">

            {/* Header Row */}
            <div className="header-row">
                <span>Image</span>
                <span>Name</span>
                <span>Price</span>
                <span>Category</span>
                <span>Sizes</span>
                <span>Stock</span>
                <span>Brand</span>
                <span>Actions</span>
            </div>

            {/* Data Rows */}
            {products.length === 0 ? (
                <p>No products found</p>
            ) : (
                products.map((item) => (
                    <div key={item._id} className="row">

                        <img
                            src={`http://localhost:5000/public/images/${item.thumbnail}`}
                            alt={item.name}
                            className="row-img"
                        />

                        <span>{item.name}</span>
                        <span>${item.price}</span>
                        <span>{item.catagory}</span>

                        <span>
                            {Array.isArray(item.sizes)
                                ? item.sizes.join(', ')
                                : 'not mentioned'}
                        </span>

                        <span>{item.stock}</span>
                        <span>{item.brand}</span>

                        <div className="actions">
                            <Link to={`/update/${item._id}`} className="edit">
                                Edit
                            </Link>

                            <button
                                onClick={() => deletebtn(item._id)}
                                className="delete"
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                ))
            )}
        </div>
    );
};

export default Admin;