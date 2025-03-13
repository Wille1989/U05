"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DiscSchema = new mongoose_1.default.Schema({
    title: { type: String, requiered: true },
    type: { type: String, requiered: true },
    manufacturer: { type: String, requiered: true },
    speed: { type: Number, requiered: true },
    glide: { type: Number, requiered: true },
    turn: { type: Number, requiered: true },
    fade: { type: Number, requiered: true },
    colours: { type: String, requiered: true },
});
exports.default = mongoose_1.default.model("Disc", DiscSchema);
