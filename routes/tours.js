import express from "express";
const router = express.Router();
import Concert from "../models/Concert.js";

// Obtengo todos los conciertos
const findAllConcerts = async (req, res) => {
    try {
        const concerts = await Concert.find().select("_id city venue date ticketUrl image videoUrl basePrice sectors");
        return res.status(200).send({ message: "Todos los conciertos", concerts });
    } catch (error) {
        return res.status(501).send({ message: "Hubo un error", error: error.message });
    }
};

// Obtengo un concierto por id
const findConcertById = async (req, res) => {
    const { id } = req.params;
    try {
        const concert = await Concert.findById(id).select("_id city venue date ticketUrl image videoUrl basePrice sectors");
        if (!concert) {
            return res.status(404).send({ message: "Concierto no encontrado" });
        }
        return res.status(200).send({ message: "Concierto encontrado", concert });
    } catch (error) {
        return res.status(500).send({ message: "Error obteniendo concierto", error: error.message });
    }
};

// Creo un nuevo concierto
const addConcert = async (req, res) => {
    const { city, venue, date, ticketUrl, image, videoUrl, basePrice, sectors } = req.body;
    try {
        const concert = new Concert({ city, venue, date, ticketUrl, image, videoUrl, basePrice, sectors });
        await concert.save();
        return res.status(201).send({ message: "Concierto creado", concert });
    } catch (error) {
        return res.status(500).send({ message: "Hubo un error", error: error.message });
    }
};

// Actualizo un concierto por id
const updateConcert = async (req, res) => {
    const { id } = req.params;
    const { city, venue, date, ticketUrl, image, videoUrl, basePrice, sectors } = req.body;

    try {
        const updatedConcert = await Concert.findByIdAndUpdate(
            id,
            { city, venue, date, ticketUrl, image, videoUrl, basePrice, ...(sectors && { sectors }) },
            { new: true }
        );

        if (!updatedConcert) {
            return res.status(404).send({ message: "Concierto no encontrado" });
        }

        return res.status(200).send({ message: "Concierto actualizado", concert: updatedConcert });
    } catch (error) {
        return res.status(500).send({ message: "Error actualizando concierto", error: error.message });
    }
};

// Actualizo varios conciertos a la vez
const updateManyConcerts = async (req, res) => {
    const updates = req.body.updates || req.body.concerts;

    if (!Array.isArray(updates)) {
        return res.status(400).send({ message: "Formato inválido, se esperaba un array" });
    }

    try {
        const results = [];
        for (let update of updates) {
            const updateData = {};
            if (update.city !== undefined) updateData.city = update.city;
            if (update.venue !== undefined) updateData.venue = update.venue;
            if (update.date !== undefined) updateData.date = update.date;
            if (update.ticketUrl !== undefined) updateData.ticketUrl = update.ticketUrl;
            if (update.image !== undefined) updateData.image = update.image;
            if (update.videoUrl !== undefined) updateData.videoUrl = update.videoUrl;
            if (update.basePrice !== undefined) updateData.basePrice = update.basePrice;
            if (update.sectors !== undefined) updateData.sectors = update.sectors;

            const updated = await Concert.findByIdAndUpdate(
                update._id,
                updateData,
                { new: true }
            );

            if (updated) results.push(updated);
        }

        return res.status(200).send({ message: "Conciertos actualizados", concerts: results });
    } catch (error) {
        console.error("Error en updateManyConcerts:", error);
        return res.status(500).send({ message: "Error actualizando conciertos", error: error.message });
    }
};

// Mis endpoints
router.get("/", findAllConcerts);
router.get("/:id", findConcertById);
router.post("/", addConcert);
router.put("/:id", updateConcert);
router.put("/", updateManyConcerts); // PUT masivo para varios conciertos

export default router;