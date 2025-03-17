import mongoose from "mongoose";
import { IManufacturerBody } from "./manufacturer";

export interface IDisc extends mongoose.Document {
    title: string;
    type: "Distance Driver" | "Driver" | "Mid-Range" | "Putter";
    manufacturer: mongoose.Types.ObjectId | IManufacturerBody;
    speed: number;
    glide: number;
    turn: number;
    fade: number;
}

export interface ICreateDiscBody extends IDisc {}

export interface IUpdateDiscBody extends Partial<IDisc> {}