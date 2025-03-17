
// MAIN
import { Request, Response } from "express";
import mongoose from "mongoose";

// MODELS
import Disc from "../models/disc";
import manufacturer from "../models/manufacturer";

// TYPES
import { IDisc } from "../types/disc";
import { ApiError, UserMessage } from "../types/responseTypes";
import { IdParams, DiscQuery } from "../types/requestTypes";
import { ICreateDiscBody, IUpdateDiscBody } from "../types/disc";


export const createDisc = async (
    req:Request<{}, {}, ICreateDiscBody>, 
    res:Response<IDisc | ApiError>
    ): Promise <Response<IDisc | ApiError>> => {
    try {

        const newDisc = new Disc(req.body);

        await newDisc.save();

        return res.status(201).json(newDisc);

    } catch (err){
        console.error("Fel uppstod när disc skulle skapas", {
            error: err,
            requestbody: req.body
        });

        if (err instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ error: (err as Error).message});
        } else {
            return res.status(500).json({ error: "Ett internt serverfel uppstod vid anrop" });
        }
    }
};

export const getDisc = async (
    req: Request<{}, {}, {}, DiscQuery>,
    res: Response<IDisc[] | ApiError | UserMessage>
    ): Promise <Response<IDisc[] | ApiError | UserMessage>> => {
  
    try {
        let query: DiscQuery = {};
        const searchTerm = (req.query.search as string)?.trim().toLowerCase();

        if(searchTerm) {
            query.$or = query.$or || [];

            query.$or.push({ title: {$regex: searchTerm, $options: "i"} });
            query.$or.push({ type: {$regex: searchTerm, $options: "i"} });

            if(!req.query.manufacturer) {

                const manufacturerDocs = await manufacturer.find({
                    name: { $regex: searchTerm, $options: "i" },
                    country: { $regex: searchTerm, $options: "i" }
                }) as { _id: mongoose.Types.ObjectId }[];

                if(!manufacturerDocs || manufacturerDocs.length === 0) {
                    return res.status(manufacturerDocs ? 404 : 500).json({ error: "Inga tillverkare hittades!" });
                }

                const manufacturerIds: mongoose.Types.ObjectId[] = manufacturerDocs.map(m => new mongoose.Types.ObjectId(m._id));

                query.$or.push({ manufacturer: { $in: manufacturerIds } });
            }
        }

        const numericFields: string[] = ["speed", "glide", "turn", "fade"];

            numericFields.forEach((field) => {
                if(req.query[field]){
                    const numericValue = Number(req.query[field]);

                    if(!isNaN(numericValue)) {
                        query[field] = numericValue;
                    }
                }
            });

        if (query.$or && query.$or.length === 0) {
            delete query.$or;
        }

        let Discs = await Disc.find(query).populate("manufacturer");

        return res.status(200).json(Discs);

    } catch(err){
        console.error(`fel för objektID: `, err);
        return res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
}

export const getDiscsById = async (
    req:Request<IdParams>, 
    res:Response<IDisc | ApiError>
    ): Promise <Response<IDisc | ApiError>> => {
    try {

        const { id } = req.params;
        const getDisc: IDisc | null = await Disc.findById(id).populate("manufacturer");

        if(!getDisc) {
            return res.status(404).json({error: "Discen kunde inte hittas!"});
        }

        return res.status(200).json(getDisc);

    } catch (err){
        console.error("fel vid hämtning av discs:", err, req.params.id);
        return res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
}

export const updateDisc = async (
    req:Request<IdParams, {}, {}, IUpdateDiscBody>, 
    res:Response<IDisc | ApiError>
    ): Promise <Response<IDisc | ApiError>> => {
    try {

        const { id } = req.params;
        const inputData = req.body;

        const getDisc: IDisc | null = await Disc.findByIdAndUpdate(
            id, 
            inputData, 
            { new: true, runValidators: true });

        if (!getDisc) {
            return res.status(404).json({error: `Disc med ID: ${id} går inte att hitta`});
        }

        return res.status(200).json(getDisc);
        
    } catch (err){
        console.error(`Ett fel uppstod när: ${req.params.id} skulle uppdateras och körningen avbröts!`, err);
        return res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
}


export const deleteDisc = async (
    req:Request<IdParams>, 
    res:Response
    ): Promise <Response> => {
    try {

        const { id } = req.params;

        const deleteDisc: IDisc | null = await Disc.findByIdAndDelete(id);

        if(!deleteDisc) {
            return res.status(404).json({error: `ID:t ${id} kan ej hittas!`});

        }

        return res.status(200).json({ message: "Du har tagit bort discen" });

    } catch (err){
        console.error(`Fel uppstod vid borttagning av specifik disc`, {
            id: req.params.id || "Ej tillgängligt",
            error: err
        });
        return res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
}