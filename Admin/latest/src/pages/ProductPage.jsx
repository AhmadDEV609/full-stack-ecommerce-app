import React, { useState } from 'react';
import '../css/productpage.css';

const ProductPage = () => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        catagory: '',
        price: '',
        thumbnail: null,
        gallery: [],
        istopSeller: false,
        stock: '',
        brand: '',
        sizes: ''
    });
    const apiURL = import.meta.env.VITE_BACKEND_URL;

    function handleForm(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('catagory', form.catagory);
        formData.append('price', form.price);
        formData.append('istopSeller', form.istopSeller ? 'true' : 'false');
        formData.append('sizes', form.sizes);
        formData.append('stock', form.stock);
        formData.append('brand', form.brand);

        if (form.thumbnail) formData.append('thumbnail', form.thumbnail);

        form.gallery.forEach((img) => {
            formData.append('gallery', img);
        });

        const sendData = async () => {
            try {
                const res = await fetch(`${apiURL}/v1/api/admin/product/create`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });

                if (res.ok) {
                    alert('Product is added');
                    setForm({
                        name: '',
                        description: '',
                        catagory: '',
                        price: '',
                        thumbnail: null,
                        gallery: [],
                        istopSeller: false,
                        stock: '',
                        brand: '',
                        sizes: ''
                    });
                } else {
                    console.log(await res.text());
                }
            } catch (error) {
                console.log(error);
            }
        };

        sendData();
    }

    return (
        <div className='prodpage-container'>
            <div className='prodpage-card'>
                <h2 className='prodpage-title'>Add Product</h2>

                <form onSubmit={handleForm} className='prodpage-form'>

                    <input
                        className='prodpage-input'
                        type="text"
                        placeholder='Product Name'
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <textarea
                        className='prodpage-textarea'
                        rows={5}
                        placeholder='Description'
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />

                    <input
                        className='prodpage-input'
                        type="text"
                        placeholder='Category'
                        value={form.catagory}
                        onChange={(e) => setForm({ ...form, catagory: e.target.value })}
                    />

                    <input
                        className='prodpage-input'
                        type="number"
                        placeholder='Price'
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />

                    <input
                        className='prodpage-input'
                        type="number"
                        placeholder='Stock'
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    />

                    <input
                        className='prodpage-input'
                        type="text"
                        placeholder='Brand'
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    />

                    <input
                        className='prodpage-input'
                        type="text"
                        placeholder='Sizes (S,M,L,XL)'
                        value={form.sizes}
                        onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    />

                    <label className='prodpage-label'>Thumbnail</label>
                    <input
                        className='prodpage-file'
                        type="file"
                        onChange={(e) => setForm({ ...form, thumbnail: e.target.files[0] })}
                    />

                    <label className='prodpage-label'>Gallery Images</label>
                    <input
                        className='prodpage-file'
                        type="file"
                        multiple
                        onChange={(e) => setForm({ ...form, gallery: Array.from(e.target.files) })}
                    />

                    <div className='prodpage-checkbox'>
                        <label>Top Seller</label>
                        <input
                            type="checkbox"
                            checked={form.istopSeller}
                            onChange={() => setForm({ ...form, istopSeller: !form.istopSeller })}
                        />
                    </div>

                    <button className='prodpage-btn' type='submit'>
                        Add Product
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ProductPage;