import mongoose, { Schema } from "mongoose";
import { IManufacturerBody } from "../types/manufacturer";

const ManufacturerSchema = new Schema <IManufacturerBody> ({
    name: {type: String, required: true},
    country: {type: String, required: true}
});

export default mongoose.model<IManufacturerBody>("Manufacturer", ManufacturerSchema);