import mongoose, { Schema, Document, Model } from "mongoose";
import { Imanufacturer } from "./manufacturer";

export interface IDisc extends Document {
    title: string;
    type: "Distance Driver" | "Driver" | "Mid-Range" | "Putter";
    manufacturer: mongoose.Types.ObjectId | Imanufacturer;
    speed: number;
    glide: number;
    turn: number;
    fade: number;
}

const DiscSchema = new Schema<IDisc>({
    title: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: {
            values: ["Distance Driver", "Driver", "Mid-Range", "Putter"],
            message: "{VALUE} Not Valid, chose one of these: Distance Driver, Driver, Mid-Range, Putter."
        }
    },
    manufacturer: { type: Schema.Types.ObjectId, ref: "Manufacturer", required: true },
    speed: { type: Number, required: true },
    glide: { type: Number, required: true },
    turn: { type: Number, required: true },
    fade: { type: Number, required: true }
});

const Disc: Model<IDisc> = mongoose.model<IDisc>("Disc", DiscSchema);
export default Disc;