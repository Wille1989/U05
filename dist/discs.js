"use strict";
const mongoose = require("mongoose");
const discSchema = new mongoose.Schema({
    title: { type: String, requiered: true },
    type: { type: String, requiered: true },
    manufacturer: { type: String, requiered: true },
    speed: { type: Number, requiered: true },
    glide: { type: Number, requiered: true },
    turn: { type: Number, requiered: true },
    fade: { type: Number, requiered: true },
    colours: { type: String, requiered: true },
});
module.exports = mongoose.model("Disc", discSchema);
