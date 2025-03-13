import mongoose, { Schema, Document } from "mongoose";

export interface Imanufacturer extends Document {
    name: string;
    country: string;
}

const ManufacturerSchema = new Schema <Imanufacturer> ({
    name: {type: String, required: true},
    country: {type: String, required: true}
});

export default mongoose.model<Imanufacturer>("Manufacturer", ManufacturerSchema);