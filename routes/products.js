import express from "express";
const router = express.Router();
import Product from "../models/products.js";

// Obtener todos los productos con categorías pobladas
const findAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("categories", "name slug");
        return res.status(200).send({ message: "Todos los productos", products });
    } catch (error) {
        return res.status(500).send({ message: "Hubo un error", error });
    }
};

// Obtener un producto por id con categorías pobladas
const findOneProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id).populate("categories", "name slug");
        if (!product) {
            return res.status(404).send({ message: "Producto no encontrado", id });
        }
        return res.status(200).send({ message: "Producto encontrado", product });
    } catch (error) {
        return res.status(500).send({ message: "Hubo un error", error });
    }
};

// Crear un producto y devolverlo con categorías pobladas
const addProduct = async (req, res) => {
    const { title, overview, poster_path, backdrop_path, variants, categories } = req.body;
    try {
        const product = new Product({ title, overview, poster_path, backdrop_path, variants, categories });
        await product.save();
        const populatedProduct = await product.populate("categories", "name slug");
        return res.status(201).send({ message: "Producto creado", product: populatedProduct });
    } catch (error) {
        return res.status(500).send({ message: "Hubo un error", error });
    }
};

// Actualizar un producto por id y devolverlo con categorías pobladas
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, overview, poster_path, backdrop_path, variants, categories } = req.body;
    try {
        const productToUpdate = await Product.findById(id);
        if (!productToUpdate) {
            return res.status(404).send({ message: "No existe el producto", id });
        }

        productToUpdate.title = title;
        productToUpdate.overview = overview;
        productToUpdate.poster_path = poster_path;
        productToUpdate.backdrop_path = backdrop_path;
        productToUpdate.variants = variants;
        productToUpdate.categories = categories;

        await productToUpdate.save();
        const populatedProduct = await productToUpdate.populate("categories", "name slug");
        return res.status(200).send({ message: "Producto actualizado", product: populatedProduct });
    } catch (error) {
        return res.status(500).send({ message: "Hubo un error", error });
    }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const productToDelete = await Product.findById(id);
        if (!productToDelete) {
            return res.status(404).send({ message: "No existe el producto", id });
        }

        await Product.deleteOne({ _id: id });
        return res.status(200).send({ message: "Producto borrado", product: productToDelete });
    } catch (error) {
        return res.status(500).send({ message: "Hubo un error", error });
    }
};

// PUT masivo para actualizar varios productos a la vez con categorías pobladas
const updateManyProducts = async (req, res) => {
    const updates = req.body.products;

    if (!Array.isArray(updates)) {
        return res.status(400).send({ message: "El body debe contener un array 'products'" });
    }

    try {
        const results = [];
        for (let update of updates) {
            const updated = await Product.findByIdAndUpdate(
                update._id,
                {
                    title: update.title,
                    overview: update.overview,
                    poster_path: update.poster_path,
                    backdrop_path: update.backdrop_path,
                    variants: update.variants,
                    categories: update.categories
                },
                { new: true }
            ).populate("categories", "name slug");
            if (updated) results.push(updated);
        }
        return res.status(200).send({ message: "Productos actualizados", products: results });
    } catch (error) {
        return res.status(500).send({ message: "Error actualizando productos", error });
    }
};

// CRUD endpoints
router.get("/", findAllProducts);
router.get("/:id", findOneProduct);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.put("/", updateManyProducts);

export default router;
