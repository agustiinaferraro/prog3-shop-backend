// models/Concert.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const concertSchema = new mongoose.Schema({
  city: { type: String, required: true },            // ciudad + pais
  venue: { type: String, required: true },           //lugar (ej: Luna Park)
  date: { type: Date, required: true },              //fecha del concierto
  ticketUrl: { type: String, required: true },       // link al front
  image: { type: String, required: true }            // img de un recital
}, { timestamps: true });

const Concert = mongoose.models.Concert || mongoose.model("Concert", concertSchema);

export default Concert;
