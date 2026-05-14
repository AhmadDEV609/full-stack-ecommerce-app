import { useParams, Link, data } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import '../css/productdetail.css'
import { FaTrash } from "react-icons/fa"
import { ClipLoader } from "react-spinners";
const ProductDetailpage = () => {
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const queryClient = useQueryClient()
    const { id } = useParams()


    const [selectedSize, setSelectedSize] = useState(null)
    const [commentText, setcomment] = useState('')
    const [galleryImages, setgalleryImages] = useState('')
    const { data: productData, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const res = await fetch(
                `${apiURL}/v1/api/comment/display/${id}`,
                { credentials: 'include' }
            )
            return res.json()
        }
    })

    useEffect(() => {
        if (productData?.product?.thumbnail) {
            setgalleryImages(productData.product.thumbnail)
        }
    }, [productData])

    const product = productData?.product
    const { data: relatedData } = useQuery({
        queryKey: ["relatedProducts", product?._id],
        enabled: !!product,
        queryFn: async () => {
            const res = await fetch(
                `${apiURL}/v1/api/admin/product/relatedProducts`
            )
            const data = await res.json()

            return data.RelatedProduct.filter((element) =>
                element.catagory === product.catagory &&
                element._id !== product._id
            )
        }
    })

    const relatedProducts = relatedData || []

    const addComment = useMutation({

        mutationFn: async (commentText) => {
            if (!commentText.trim()) {
                throw new Error("Empty comment")
            }


            const res = await fetch(
                `${apiURL}/v1/api/comment/add`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        comment: commentText,
                        productId: product._id
                    })
                }
            )

            if (!res.ok) throw new Error("Failed")

            return res.json()
        },

        onMutate: async () => {

            await queryClient.cancelQueries(["product", id])

            const oldData = queryClient.getQueryData(["product", id])

            const newComment = {
                _id: Date.now(),
                comment: commentText,
                createdAt: new Date().toISOString(),
                user: { _id: "temp", name: "You" }
            }

            queryClient.setQueryData(["product", id], (old) => {

                if (!old) return old

                return {
                    ...old,
                    product: {
                        ...old.product,

                        reviews: [
                            newComment,
                            ...old.product.reviews
                        ]
                    }
                }
            })

            setcomment("")

            return { oldData }
        },

        onError: (err, _, context) => {
            queryClient.setQueryData(["product", id], context.oldData)
        },

        onSettled: () => {
            queryClient.invalidateQueries(["product", id])
        }
    })

    const deleteComment = useMutation({
        mutationFn: async (reviewId) => {
            try {
                const res = await fetch(
                    `${apiURL}/v1/api/comment/delete/${product._id}/${reviewId}`,
                    {
                        method: 'DELETE',
                        credentials: 'include'
                    }
                )

                if (res.ok) {
                    queryClient.invalidateQueries(["product", id])
                }
            } catch (error) {
                console.log(error)
            }
        },

        onMutate: async (reviewId) => {
            await queryClient.cancelQueries(['product', id])
            const previousComment = queryClient.getQueryData(["product", id]);

            queryClient.setQueryData(['product', id], (old) => {
                if (!old) return old
                return {
                    ...old,
                    product: {
                        ...old.product,
                        reviews: old.product.reviews.filter(
                            (element) => element._id !== reviewId
                        )
                    }
                }
            })
            return { previousComment }
        },
        onError: (err, reviewId, context) => {
            queryClient.setQueryData(["product", id], context.previousComment);
            toast.error("Update failed");
        },

        onSettled: () => {
            queryClient.invalidateQueries(["product", id]);
        },
    })





    async function cartbtn(product) {
        try {
            if (product?.stock > 1) {
                const res = await fetch(
                    `${apiURL}/v1/api/cart/add`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            items: [{
                                product: product._id,
                                quantity: 1,
                                size: selectedSize
                            }]
                        })
                    }
                )

                if (res.ok) {
                    alert("Product added to cart")
                    queryClient.invalidateQueries(["cart"])
                }
            } else {
                alert('product is out of stock')
            }

        } catch (error) {
            console.log(error)
        }
    }








    async function wishlistbtn(product) {
        try {
            const res = await fetch(
                `${apiURL}/v1/api/wishlist/add`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        wishlistItem: [{
                            product: product._id,
                        }]
                    })
                }
            )

            if (res.ok) {
                alert("Product added to wishlist")
                queryClient.invalidateQueries(["wishlist"])
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (isLoading || !product) return <h3>loading....</h3>

    return (
        <div className="product-detail-page">

            <div className="main-container">

                <img
                    className="thumbnail-image"
                    src={`${apiURL}/public/images/${galleryImages}`}
                    alt={product.name}
                />
                <div className='gallery-1'>
                    {
                        product?.gallery.map((element) => {
                            return (
                                <>
                                    <img className={` gallery-image  ${galleryImages == element ? 'active' : ''}`} onClick={() => setgalleryImages(element)} src={`http://localhost:5000/public/images/${element}`} />
                                </>
                            )
                        })
                    }
                </div>


                <div className="product-info">

                    <h1>{product.name}</h1>
                    <h2>Price: ${product.price}</h2>
                    <h4>Stock: {product.stock}</h4>
                    <h4>Brand: {product.brand}</h4>

                    <div className='size-container'>
                        {product.sizes?.map((size, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedSize(size)}
                                className={`sizes-btn ${selectedSize === size ? 'active' : ''}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>

                    <button onClick={() => cartbtn(product)} className='Cart-btn'>
                        Add to Cart
                    </button>

                    <button onClick={() => wishlistbtn(product)} className='Cart-btn'>
                        Add to Wishlist
                    </button>

                    <p>{product.description}</p>
                </div>
            </div>
            <div className='gallery'>
                {
                    product?.gallery.map((element) => {
                        return (
                            <>
                                <img className={` gallery-image  ${galleryImages == element ? 'active' : ''}`} onClick={() => setgalleryImages(element)} src={`http://localhost:5000/public/images/${element}`} />
                            </>
                        )
                    })
                }
            </div>

            <h2>Reviews</h2>

            <div className="comment-container">
                <input
                    value={commentText}
                    onChange={(e) => setcomment(e.target.value)}
                    type="text"
                    placeholder="Write your comment..."
                />
                <button onClick={() => addComment.mutate(commentText)} >Post</button>
            </div>



            <div className="reviews-container">

                {product.reviews?.length > 0 ? (
                    product.reviews.map((rev) => (
                        <div key={rev._id} className="review-card">

                            <div className="review-header">

                                <span>
                                    👤 {rev.user?.name || "Anonymous"}
                                </span>

                                <span className="review-date">
                                    {rev.createdAt
                                        ? new Date(rev.createdAt).toLocaleDateString()
                                        : ""}
                                </span>

                                <FaTrash
                                    style={{ cursor: "pointer", color: "red" }}
                                    onClick={() => deleteComment.mutate(rev._id)}
                                />

                            </div>

                            <p className="review-comment">
                                {rev.comment}
                            </p>

                        </div>
                    ))
                ) : (
                    <p>No reviews yet</p>
                )}

            </div>

            <div className="related-container">
                <h3>Related Products</h3>

                <div className="related-grid">
                    {relatedProducts.map((item) => (
                        <Link
                            key={item._id}
                            className='link'
                            to={`/product-detail/${item._id}`}
                        >
                            <div className="related-card">
                                <img
                                    src={`http://localhost:5000/public/images/${item.thumbnail}`}
                                    alt=""
                                />
                                <h4>{item.name}</h4>
                                <p>${item.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default ProductDetailpage