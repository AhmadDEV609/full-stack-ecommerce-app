import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { isUser } from "../middleware/role.check.middleware.js";

import {
    addCart,
    displayCart,
    deleteCartitem,
    increaseQuantity,
    decreaseQuantity
} from "../controllers/cart.controller.js";

const Cart = Router();


Cart.post('/add', auth, isUser, addCart);
Cart.get('/display', auth, isUser, displayCart);
Cart.delete('/delete/:id', auth, isUser, deleteCartitem);
Cart.put('/quantityIncrease/:id', auth, isUser, increaseQuantity);
Cart.put('/quantityDecrease/:id', auth, isUser, decreaseQuantity);

export default Cart;