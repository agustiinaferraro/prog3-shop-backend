// models/Product.js
import mongoose from "mongoose";
const { Schema } = mongoose

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  image: { type: String, required: true },
  sizes: [{ type: String, required: true }] // Array de talles
});

const productSchema = new mongoose.Schema({
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  title: { type: String, required: true },
  overview: { type: String, required: true },
  poster_path: { type: String, required: true },
  backdrop_path: { type: String, required: true },
  variants: [variantSchema] // Array de variantes
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
