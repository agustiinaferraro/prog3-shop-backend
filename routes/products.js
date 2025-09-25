// routes/products.js
import express from "express";
const router = express.Router();
import Product from "../models/products.js";

// Obtener todos los productos
const findAllProducts = async (req, res) => {
    try {
        const products = await Product.find().select("_id title overview poster_path backdrop_path variants categories");
        return res.status(200).send({ message: "Todos los productos", products });
    } catch (error) {
        return res.status(500).send({ message: "Hubo un error", error });
    }
};

// Obtener un producto por id
const findOneProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findOne({ _id: id }).select("_id title overview poster_path backdrop_path variants categories");
        return res.status(200).send({ message: "Producto encontrado", product });
    } catch (error) {
        return res.status(500).send({ message: "Hubo un error", error });
    }
};

// Crear un producto
const addProduct = async (req, res) => {
    const { title, overview, poster_path, backdrop_path, variants, categories } = req.body;
    try {
        const product = new Product({ title, overview, poster_path, backdrop_path, variants, categories });
        await product.save();
        return res.status(200).send({ message: "Producto creado", product });
    } catch (error) {
        return res.status(500).send({ message: "Hubo un error", error });
    }
};

// Actualizar un producto por id
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
        return res.status(200).send({ message: "Producto actualizado", product: productToUpdate });
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

// PUT masivo para actualizar varios productos a la vez
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
            );
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
router.put("/", updateManyProducts); // PUT masivo

export default router;
