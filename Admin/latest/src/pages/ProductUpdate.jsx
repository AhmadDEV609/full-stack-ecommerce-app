import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../css/updateProduct.css'

const ProductUpdate = () => {

    const [form, setForm] = useState({
        name: '',
        description: '',
        catagory: '',
        price: '',
        thumbnail: '',
        gallery: []
    })

    const { id } = useParams()

    useEffect(() => {
        const getSingleproduct = async () => {
            try {
                const res = await fetch(`http://localhost:5000/v1/api/Admin/product/singleproduct/${id}`)
                const data = await res.json()
                setForm(data.product)
            } catch (error) {
                console.log(error)
            }
        }
        getSingleproduct()
    }, [id])

    function handleForm(e) {
        e.preventDefault()

        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('catagory', form.catagory)
        formData.append('description', form.description)
        formData.append('price', form.price)
        formData.append('thumbnail', form.thumbnail)

        form.gallery.forEach((file) => {
            formData.append('gallery', file)
        })

        const updatebtn = async () => {
            try {
                const res = await fetch(`http://localhost:5000/v1/api/admin/product/update/${id}`, {
                    method: 'PUT',
                    body: formData
                })
                if (res.ok) {
                    alert('Item is updated')
                }
            } catch (error) {
                console.log(error)
            }
        }

        updatebtn()
    }

    return (
        <div className='updatepage-container'>

            <div className='updatepage-card'>

                <h2 className='updatepage-title'>Update Product</h2>

                <form onSubmit={handleForm} className='updatepage-form'>

                    <label className='updatepage-label'>Product Name</label>
                    <input
                        className='updatepage-input'
                        type="text"
                        placeholder='Enter Name'
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <label className='updatepage-label'>Description</label>
                    <textarea
                        className='updatepage-textarea'
                        placeholder='Enter description'
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />

                    <label className='updatepage-label'>Category</label>
                    <input
                        className='updatepage-input'
                        type="text"
                        placeholder='Enter Category'
                        value={form.catagory}
                        onChange={(e) => setForm({ ...form, catagory: e.target.value })}
                    />

                    <label className='updatepage-label'>Price</label>
                    <input
                        className='updatepage-input'
                        type="number"
                        placeholder='Enter price'
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />

                    <label className='updatepage-label'>Select Thumbnail</label>
                    <input
                        className='updatepage-file'
                        type="file"
                        onChange={(e) => setForm({ ...form, thumbnail: e.target.files[0] })}
                    />

                    <label className='updatepage-label'>Select Gallery</label>
                    <input
                        className='updatepage-file'
                        type="file"
                        multiple
                        onChange={(e) => setForm({ ...form, gallery: Array.from(e.target.files) })}
                    />

                    <button className='updatepage-btn' type='submit'>
                        Update Product
                    </button>

                </form>

            </div>

        </div>
    )
}

export default ProductUpdate