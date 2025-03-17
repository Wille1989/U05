import mongoose, { Schema, Model } from "mongoose";
import { IDisc } from "../types/disc";


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