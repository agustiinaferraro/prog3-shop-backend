// models/Fanart.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const fanartSchema = new Schema({
  image: { type: String, required: true },      //URL de la img del fanart
  artist: { type: String, required: true }      //nombre del artista con @
}, { timestamps: true });

const Fanart = mongoose.models.Fanart || mongoose.model("Fanart", fanartSchema);

export default Fanart;
