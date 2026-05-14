import adminProducts from "../models/adminproduct.model.js";
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import asyncHandler from "../utils/asyncHandler.js";
import dbconnection from "../db/dbconnection.js";

const createProduct = asyncHandler(async (req, res, next) => {
    await dbconnection()
    const { name, description, price, catagory, istopSeller, sizes, stock, brand } = req.body
    if (!name || !description || !price || !catagory) {
        const err = new Error('Please fill all Fields')
        err.status = 400
        return next(err)
    }
    const thumbnailImage = req.files.thumbnail ? req.files.thumbnail[0].filename : null
    const galleryImages = req.files.gallery ? req.files.gallery.map((f) => f.filename) : []
    const uniqueId = uuidv4();
    const Allproducts = await adminProducts.create({
        name, description, price, catagory,
        thumbnail: thumbnailImage,
        gallery: galleryImages,
        istopSeller: istopSeller === 'true',
        sizes: sizes ? sizes.split(',').map(s => s.trim()) : [],
        stock, brand,
        sku: uniqueId
    })
    res.status(200).send({ message: "Product is added", Allproducts })
})


const displayProduct = asyncHandler(async (req, res, next) => {
    await dbconnection()
    const data = await adminProducts.find({}).limit(8)

    res.status(200).send({ message: "Products are here", data })
})

const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name, description, price, catagory, sizes } = req.body

    const olddata = await adminProducts.findById(id)
    if (!olddata) {
        const err = new Error('Item is not found')
        err.status = 404
        return next(err)
    }

    const updatedData = await adminProducts.findByIdAndUpdate(
        id,
        {
            name, description, price, catagory,
            thumbnail: req.body.thumbnail,
            gallery: req.body.gallery || [],
            sizes: sizes ? sizes.split(',').map(s => s.trim()) : []
        },
        {
            new: true,
            runValidators: true
        }
    )
    if (!updatedData) {
        const err = new Error('Product ID is not found')
        err.status = 404
        return next(err)
    }

    const safeDeleteFile = async (filePath) => {
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            console.log("Deleted:", filePath);
        } catch (err) {
            if (err.code === "ENOENT") {
                console.log("File not found, skipping:", filePath);
            } else {
                console.error("Error deleting file:", filePath, err);
            }
        }
    };

    if (olddata.thumbnail && olddata.thumbnail !== req.body.thumbnail) {
        await safeDeleteFile(`public/images/${olddata.thumbnail}`);
    }

    const oldGallery = olddata.gallery || [];
    const newGallery = req.files?.gallery
        ? req.files.gallery.map(f => f.filename)
        : oldGallery;

    for (const file of oldGallery) {
        if (!newGallery.includes(file)) await safeDeleteFile(file);
    }

    res.status(200).send({ message: "Product updated successfully", updatedData })
})


const deleteProduct = asyncHandler(async (req, res, next) => {
    await dbconnection()
    const { id } = req.params
    const deleteLogic = await adminProducts.findByIdAndDelete(id)
    if (!deleteLogic) {
        const err = new Error('Item is not found')
        err.status = 404
        return next(err)
    }

    if (deleteLogic.thumbnail) {
        try {
            await fs.unlink(`public/images/${deleteLogic.thumbnail}`);
            console.log("Thumbnail deleted");
        } catch (err) {
            console.log("Error deleting thumbnail:", err);
        }
    }

    if (deleteLogic.gallery?.length) {
        for (const file of deleteLogic.gallery) {
            try {
                await fs.unlink(`public/images/${file}`);
                console.log("Gallery file deleted:", file);
            } catch (err) {
                console.log("Gallery delete error:", err);
            }
        }
    }
    res.status(200).send({ message: "Product deleted", deleteLogic })
})


const Singleproduct = asyncHandler(async (req, res, next) => {
    await dbconnection()
    const { id } = req.params
    const product = await adminProducts.findById(id)
    if (!product) {
        const err = new Error('Product not found')
        err.status = 404
        return next(err)
    }
    res.status(200).send({ message: "Single product is here", product })
})


const bestSeller = asyncHandler(async (req, res, next) => {
    await dbconnection()
    const bestSellerData = await adminProducts.find({ istopSeller: true })
    if (!bestSellerData.length) {
        const err = new Error('No best seller found')
        err.status = 404
        return next(err)
    }
    res.status(200).send({ message: 'Best seller product is here', bestSellerData })
})

// this is for user product page 

const getAllproducts = asyncHandler(async (req, res, next) => {
    await dbconnection()
    const search = req.query.search || ''
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 5)
    const catagory = req.query.catagory || ''
    const maxPrice = Number(req.query.maxPrice) || 0
    const option = {
        page,
        limit,
        lean: true,
        sort: { createdAt: -1 }
    }
    let filter = {};

    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    if (catagory) {
        filter.catagory = catagory;
    }


    if (maxPrice > 0) {
        filter.price = { $lte: maxPrice };
    }

    const data = await adminProducts.paginate(filter, option)
    res.status(200).send({ message: 'All products', data })
})


const relatedProduct = asyncHandler(async (req, res) => {
    await dbconnection()
    const RelatedProduct = await adminProducts.find({})
    res.status(200).send({ message: 'Related product is here ', RelatedProduct })
})

const ourProduct = asyncHandler(async (req, res) => {
    const products = await adminProducts.find({ istopSeller: false }).limit(5)
    res.status(200).send({ message: 'Related product is here ', products })
})


export default { createProduct, displayProduct, deleteProduct, updateProduct, Singleproduct, bestSeller, getAllproducts, relatedProduct, ourProduct }