import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { isUser } from "../middleware/role.check.middleware.js";

import {
    commentAdd,
    getSingleProduct,
    deleteComment
} from "../controllers/comment.controller.js";

const router = Router();


router.post("/add", auth, isUser, commentAdd);
router.get("/display/:id", auth, isUser, getSingleProduct);
router.delete("/delete/:productId/:reviewId", auth, isUser, deleteComment);

export default router;