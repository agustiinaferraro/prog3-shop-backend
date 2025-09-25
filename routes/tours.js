import express from "express";
const router = express.Router();
import Concert from "../models/Concert.js"; // tu modelo Concert

// Obtiene todos los conciertos
const findAllConcerts = async (req, res) => {
    try {
        const concerts = await Concert.find().select("_id city venue date ticketUrl image");
        return res.status(200).send({ message: "Todos los conciertos", concerts });
    } catch (error) {
        return res.status(501).send({ message: "Hubo un error", error });
    }
};

// Obtiene un concierto por id
const findConcertById = async (req, res) => {
    const { id } = req.params;
    try {
        const concert = await Concert.findById(id).select("_id city venue date ticketUrl image");
        if (!concert) {
            return res.status(404).send({ message: "Concierto no encontrado" });
        }
        return res.status(200).send({ message: "Concierto encontrado", concert });
    } catch (error) {
        return res.status(500).send({ message: "Error obteniendo concierto", error });
    }
};

// Crea un concierto
const addConcert = async (req, res) => {
    const { city, venue, date, ticketUrl, image } = req.body;
    try {
        const concert = new Concert({ city, venue, date, ticketUrl, image });
        await concert.save();
        return res.status(201).send({ message: "Concierto creado", concert });
    } catch (error) {
        return res.status(500).send({ message: "Hubo un error", error });
    }
};

// Actualiza un concierto por id
const updateConcert = async (req, res) => {
    const { id } = req.params;
    const { city, venue, date, ticketUrl, image } = req.body;

    try {
        const updatedConcert = await Concert.findByIdAndUpdate(
            id,
            { city, venue, date, ticketUrl, image },
            { new: true }
        );

        if (!updatedConcert) {
            return res.status(404).send({ message: "Concierto no encontrado" });
        }

        return res.status(200).send({ message: "Concierto actualizado", concert: updatedConcert });
    } catch (error) {
        return res.status(500).send({ message: "Error actualizando concierto", error });
    }
};

// Actualiza varios conciertos a la vez (por ejemplo para reemplazar links)
const updateManyConcerts = async (req, res) => {
    const { updates } = req.body; 
    // updates = [{ _id, city, venue, date, ticketUrl, image }, {...}, ...]

    try {
        const results = [];
        for (let update of updates) {
            const updated = await Concert.findByIdAndUpdate(
                update._id,
                {
                    city: update.city,
                    venue: update.venue,
                    date: update.date,
                    ticketUrl: update.ticketUrl,
                    image: update.image,
                },
                { new: true }
            );
            if (updated) results.push(updated);
        }
        return res.status(200).send({ message: "Conciertos actualizados", concerts: results });
    } catch (error) {
        return res.status(500).send({ message: "Error actualizando conciertos", error });
    }
};

// Endpoints principales
router.get("/", findAllConcerts);
router.get("/:id", findConcertById);
router.post("/", addConcert);
router.put("/:id", updateConcert);
router.put("/", updateManyConcerts); // PUT masivo para cambiar varios links a la vez

export default router;
