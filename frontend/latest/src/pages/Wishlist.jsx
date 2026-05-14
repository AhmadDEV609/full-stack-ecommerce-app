import React from 'react'
import '../css/wishlist.css'
import { FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const Wishlist = () => {

    const queryClient = useQueryClient()

    const apiURL = import.meta.env.VITE_BACKEND_URL;
    const { data, isLoading, isError } = useQuery({
        queryKey: ["wishlist"],
        queryFn: async () => {
            const res = await fetch(`${apiURL}/v1/api/wishlist`, {
                credentials: "include"
            })
            return res.json()
        }
    })

    const wishlistItems = data?.wishlist?.wishlistItem || []


    const removeMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(
                `${apiURL}/v1/api/wishlist/delete/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            )
            return res.json()
        },

        onMutate: async (id) => {
            await queryClient.cancelQueries(["wishlist"]);

            const previousCart = queryClient.getQueryData(["wishlist"]);


            queryClient.setQueryData(["wishlist"], (old) => {
                if (!old) return old

                return {
                    ...old,
                    wishlist: {
                        ...old.wishlist,
                        wishlistItem: data.wishlist.wishlistItem.filter((element) => element.product._id !== id)
                    }
                }
            })

        },
        onError: (err, id, context) => {
            queryClient.setQueryData(["wishlist"], context.previousCart);
            toast.error("Update failed");
        },

        onSettled: () => {
            queryClient.invalidateQueries(["wishlist"]);
        }


    })

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error loading wishlist</p>

    return (
        <div className="wishlist-page">

            <h1 className="wishlist-title">My Wishlist</h1>

            {wishlistItems.length === 0 ? (
                <p className="wishlist-empty">Your wishlist is empty 💔</p>
            ) : (

                <div className="wishlist-grid">

                    {wishlistItems.map((item) => (
                        <div className="wishlist-card" key={item._id}>

                            <img
                                className="wishlist-img"
                                src={`${apiURL}/public/images/${item.product.thumbnail}`}
                                alt={item.product.name}
                            />

                            <div className="wishlist-info">
                                <h3>{item.product.name}</h3>
                                <p className="wishlist-price">
                                    ${item.product.price}
                                </p>

                                <div className="wishlist-buttons">

                                    <Link to={`/product-detail/${item.product._id}`}>
                                        <button className='btn-remove'>
                                            See detail
                                        </button>
                                    </Link>

                                    <button
                                        className="btn-remove"
                                        onClick={() => removeMutation.mutate(item.product._id)}
                                    >
                                        <FaTrash /> Remove
                                    </button>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            )}

        </div>
    )
}

export default Wishlist