import mongoose from "mongoose";

export interface IdParams {
    id: string;
}

export interface DiscQuery extends Record<string, unknown> {
    $or?: (
        | { [key: string]: { $regex: string; $options: string } } 
        | { [key: string]: { $in: mongoose.Types.ObjectId[] } }
        | { [key: string]: number }
    )[];
    manufacturer?: string;
}