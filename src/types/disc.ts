import mongoose from "mongoose";
import { IManufacturerBody } from "./manufacturer";

export interface IDisc extends mongoose.Document {
    manufacturer: mongoose.Types.ObjectId | IManufacturerBody;
    title: string;
    type: "Distance Driver" | "Driver" | "Mid-Range" | "Putter";
    speed: number;
    glide: number;
    turn: number;
    fade: number;
}

export interface ICreateDiscBody extends IDisc {}

export interface IUpdateDiscBody extends Partial<IDisc> {}