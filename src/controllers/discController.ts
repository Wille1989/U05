
// MAIN
import { Request, Response } from "express";
import mongoose from "mongoose";

// MODELS
import Disc from "../models/disc";
import manufacturer from "../models/manufacturer";

// TYPES
import { IDisc } from "../types/disc";
import { ApiResponse } from "../types/responseTypes";
import { IdParams, DiscQuery } from "../types/requestTypes";
import { ICreateDiscBody, IUpdateDiscBody } from "../types/disc";


export const createDisc = async (
    req:Request<{}, {}, ICreateDiscBody>, 
    res:Response<ApiResponse<IDisc>>
    ): Promise <void> => {
    try {

        const newDisc = new Disc(req.body);

        await newDisc.save();

        res.status(201).json({
            success: true, 
            data: newDisc, 
            error: null, 
            message: `Discen med ID ${newDisc} sparades!`
        });

    } catch (err){
        console.error("Fel uppstod när disc skulle skapas", {
            error: err,
            requestbody: req.body
        });

        if (err instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ 
                success: false, 
                data: null, 
                error: "Valideringen misslyckades, försök igen", 
                message: null
            });

            return;

        } else {
            res.status(500).json({
                success: false, 
                data: null, 
                error: "Ett internt serverfel uppstod vid anrop", 
                message: null 
            });

            return;
        }
    }
};

export const getDisc = async (
    req: Request<{}, {}, {}, DiscQuery>,
    res: Response<ApiResponse<IDisc[]>>
    ): Promise <void> => {
  
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

                if(manufacturerDocs.length === 0) {
                    res.status(500).json({
                        success: false, 
                        data: null, 
                        error: "Dokumentet innehåller för få tecken", 
                        message: null
                    });
                }

                if(!manufacturerDocs) {
                    res.status(404).json({
                        success: false, 
                        data: null, 
                        error: "Inga tillverkare hittades!", 
                        message: null });
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

        let Discs: IDisc[] = await Disc.find(query).populate("manufacturer").lean();

        res.status(200).json({
            success: true, 
            data: Discs, 
            error: null, 
            message:"Ny disc tillagd!"});

    } catch(err){
        console.error(`fel för objektID: `, err);

        res.status(500).json({
            success: false, 
            data: null, 
            error: "Ett internt serverfel uppstod när anrop gjordes", 
            message: null});

        return;
    }
}

export const getDiscsById = async (
    req:Request<IdParams>, 
    res:Response<ApiResponse<IDisc>>
    ): Promise <void> => {
    try {

        const { id } = req.params;
        const getDisc: IDisc | null = await Disc.findById(id).populate("manufacturer");

        if(!getDisc) {
            res.status(404).json({
                success: false, 
                data: null, 
                error: "Discen kunde inte hittas!", 
                message: null
            });

            return;
        }

        res.status(200).json({
            success: true, 
            data: getDisc, 
            error: null, 
            message: `Disc med ID ${id} hämtad!`
        });

    } catch (err){
        console.error("fel vid hämtning av discs:", err, req.params.id);

        res.status(500).json({
            success: false, 
            data: null, 
            error: "Ett internt serverfel uppstod när anrop gjordes", 
            message: null
        });

        return;
    }
}

export const updateDisc = async (
    req:Request<IdParams, {}, {}, IUpdateDiscBody>, 
    res:Response<ApiResponse<IDisc>>
    ): Promise <void> => {
    try {

        const { id } = req.params;
        const inputData = req.body;

        const getDisc: IDisc | null = await Disc.findByIdAndUpdate(
            id, 
            inputData, 
            { new: true, runValidators: true });

        if (!getDisc) {
            res.status(404).json({
                success: false, 
                data: null, 
                error: `Disc med ID: ${id} går inte att hitta`, 
                message: null});

            return;
        }

        res.status(200).json({
            success: true, 
            data: getDisc, 
            error: null, 
            message: `Disc med ID${id} uppdaterades!`});
        
    } catch (err){
        console.error(`Ett fel uppstod när: ${req.params.id} skulle uppdateras och körningen avbröts!`, err);

        res.status(500).json({
            success: false, 
            data: null, 
            error: "Ett internt serverfel uppstod när anrop gjordes", 
            message: null
        });

        return;
    }
}


export const deleteDisc = async (
    req:Request<IdParams>, 
    res:Response
    ): Promise <void> => {
    try {

        const { id } = req.params;

        const deleteDisc: IDisc | null = await Disc.findByIdAndDelete(id);

        if(!deleteDisc) {
            res.status(404).json({
                success: false, 
                data:null, 
                error: `ID:t ${id} kan ej hittas!`, 
                message: null
            });

            return;
        }

        res.status(200).json({
            success: true, 
            data: null, 
            error: null, 
            message: "Du har tagit bort discen"
        });

    } catch (err){
        console.error(`Fel uppstod vid borttagning av specifik disc`, {
            id: req.params.id || "Ej tillgängligt",
            error: err
        });

        res.status(500).json({
            success: false, 
            data: null, 
            error: "Ett internt serverfel uppstod när anrop gjordes", 
            message: null
        });

        return;
    }
}