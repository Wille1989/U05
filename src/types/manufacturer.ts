import mongoose from "mongoose";

export interface IManufacturerBody extends mongoose.Document {
    name: string;
    country: string;
}

export interface ICreateManufacturerBody extends IManufacturerBody {}

export interface IUpdateManufacturerBody extends Partial<IManufacturerBody> {}