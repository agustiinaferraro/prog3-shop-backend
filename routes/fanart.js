// routes/fanart.js
import express from "express";
const router = express.Router();
import Fanart from "../models/Fanart.js";

// Obtiene todos los fanarts
const findAllFanarts = async (req, res) => {
  try {
    const fanarts = await Fanart.find().select("_id image artist");
    return res.status(200).send({ message: "Todos los fanarts", fanarts });
  } catch (error) {
    return res.status(501).send({ message: "Hubo un error", error });
  }
};

// Obtiene un fanart por id
const findFanartById = async (req, res) => {
  const { id } = req.params;
  try {
    const fanart = await Fanart.findById(id).select("_id image artist");
    if (!fanart) {
      return res.status(404).send({ message: "Fanart no encontrado" });
    }
    return res.status(200).send({ message: "Fanart encontrado", fanart });
  } catch (error) {
    return res.status(500).send({ message: "Error obteniendo fanart", error });
  }
};

// Crea un fanart
const addFanart = async (req, res) => {
  const { image, artist } = req.body;
  try {
    const fanart = new Fanart({ image, artist });
    await fanart.save();
    return res.status(201).send({ message: "Fanart creado", fanart });
  } catch (error) {
    return res.status(501).send({ message: "Hubo un error", error });
  }
};

// Actualiza un fanart por id
const updateFanart = async (req, res) => {
  const { id } = req.params;
  const { image, artist } = req.body;

  try {
    const updatedFanart = await Fanart.findByIdAndUpdate(
      id,
      { image, artist },
      { new: true } // devuelve el fanart actualizado
    );

    if (!updatedFanart) {
      return res.status(404).send({ message: "Fanart no encontrado" });
    }

    return res.status(200).send({ message: "Fanart actualizado", fanart: updatedFanart });
  } catch (error) {
    return res.status(500).send({ message: "Error actualizando fanart", error });
  }
};

// Actualiza varios fanarts a la vez (por ejemplo para reemplazar links)
const updateManyFanarts = async (req, res) => {
  const { updates } = req.body; 
  // updates = [{ _id, image }, {_id, image }, ...]

  try {
    const results = [];
    for (let update of updates) {
      const updated = await Fanart.findByIdAndUpdate(
        update._id,
        { image: update.image },
        { new: true }
      );
      if (updated) results.push(updated);
    }
    return res.status(200).send({ message: "Fanarts actualizados", fanarts: results });
  } catch (error) {
    return res.status(500).send({ message: "Error actualizando fanarts", error });
  }
};

// Endpoints principales
router.get("/", findAllFanarts);
router.get("/:id", findFanartById);
router.post("/", addFanart);
router.put("/:id", updateFanart);
router.put("/", updateManyFanarts); // PUT masivo para cambiar varios links a la vez

export default router;