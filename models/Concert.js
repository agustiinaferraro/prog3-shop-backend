import mongoose from "mongoose";
const { Schema } = mongoose;

const sectorSchema = new Schema({
  name: { type: String, required: true },
  priceModifier: { type: Number, required: true }
});

const concertSchema = new mongoose.Schema({
  city: { type: String, required: true },            // ciudad + país
  venue: { type: String, required: true },           // lugar (ej: Luna Park)
  date: { type: Date, required: true },              // fecha del concierto
  ticketUrl: { type: String, required: true },       // link al front
  image: { type: String, required: true },           // img de un recital
  videoUrl: { type: String },     // link al video del recital (YouTube, Vimeo, etc.)
  basePrice: { type: Number, required: true },       
  sectors: { type: [sectorSchema], default: [
    { name: "Campo", priceModifier: 1 },
    { name: "Platea", priceModifier: 1.2 },
    { name: "VIP", priceModifier: 1.5 }
  ] }
}, { timestamps: true });

const Concert = mongoose.models.Concert || mongoose.model("Concert", concertSchema);

export default Concert;