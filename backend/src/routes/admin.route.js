import { Router } from "express";
import product from '../controllers/admin.controller.js';
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.check.middleware.js";

const adminRouter = Router();

const multipleUpload = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'gallery', maxCount: 3 },
]);


adminRouter.post('/create', auth, isAdmin, multipleUpload, product.createProduct);
adminRouter.put('/update/:id', multipleUpload, product.updateProduct);
adminRouter.delete('/delete/:id', auth, isAdmin, product.deleteProduct);

adminRouter.get('/display', product.displayProduct);
adminRouter.get('/singleProduct/:id', product.Singleproduct);
adminRouter.get('/bestSeller', product.bestSeller);
adminRouter.get('/allProducts', product.getAllproducts);
adminRouter.get('/relatedProducts', product.relatedProduct);
adminRouter.get('/ourProducts', product.ourProduct);

export default adminRouter;