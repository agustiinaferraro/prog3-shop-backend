import express from "express";
import Category from "../models/category.js";

const router = express.Router();

// Crear categoría (name + slug)
router.post("/", async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = new Category({ name, slug });
    await category.save();
    return res.status(201).send({ message: "Categoría creada", category });
  } catch (error) {
    return res.status(500).send({ message: "Hubo un error", error });
  }
});

// Listar categorías
router.get("/", async (_req, res) => {
  try {
    const categories = await Category.find().select("_id name slug");
    return res.status(200).send({ message: "Todas las categorías", categories });
  } catch (error) {
    return res.status(500).send({ message: "Hubo un error", error });
  }
});

// Productos por categoría (slug o id)
router.get("/:key/products", async (req, res) => {
  const { key } = req.params;
  try {
    const isId = key.match(/^[0-9a-fA-F]{24}$/);
    const category = isId
      ? await Category.findById(key)
      : await Category.findOne({ slug: key });

    if (!category) return res.status(404).send({ message: "Categoría no encontrada" });

    const products = await (await import("../models/products.js")).default
      .find({ categories: category._id })
      .select("_id title poster_path categories")
      .populate("categories", "name slug");

    return res.status(200).send({
      message: "Productos por categoría",
      category: { _id: category._id, name: category.name, slug: category.slug },
      products
    });
  } catch (error) {
    return res.status(500).send({ message: "Hubo un error", error });
  }
});

// Reemplaza todas las categorías (PUT)
router.put("/", async (req, res) => {
  try {
    const { categories } = req.body; // envia el array completo de categorías

    if (!Array.isArray(categories)) {
      return res.status(400).send({ message: "Se espera un array de categorías" });
    }

    // Borra todas las categorías actuales
    await Category.deleteMany();

    // Crea las nuevas categorías
    const newCategories = await Category.insertMany(categories);

    return res.status(200).send({ message: "Categorías actualizadas", categories: newCategories });
  } catch (error) {
    return res.status(500).send({ message: "Hubo un error", error });
  }
});

export default router;