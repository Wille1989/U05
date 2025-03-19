
// MAIN
import { Request, Response } from "express";
import mongoose from "mongoose";

// MODELS
import Disc from "../models/disc";
import Manufacturer from "../models/manufacturer";

// TYPES
import { IDisc } from "../types/disc";
import { ApiResponse } from "../types/responseTypes";
import { IdParams, DiscQuery } from "../types/requestTypes";
import { ICreateDiscBody, IUpdateDiscBody } from "../types/disc";


// Skapa en ny disc, kopplad till en tillverkare via ID
export const createDisc = async (
    req: Request<{}, {}, ICreateDiscBody>,
    res: Response<ApiResponse<IDisc>>
): Promise<void> => {
    try {

        const newDisc = new Disc(req.body);

        await newDisc.save();

        res.status(201).json({
            success: true,
            data: newDisc,
            error: null,
            message: `Discen med ID ${newDisc} sparades!`
        });

    } catch (err) {
        console.error("Fel uppstod när disc skulle skapas", {
            error: err,
            requestbody: req.body
        });

        if (err instanceof mongoose.Error.ValidationError) {
            console.error("Mongooese validation Error:", err);
            console.log("Request Body Received:", req.body);
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


// HÄMTA DISC ELLER TILLVERKARE BASERAT PÅ SÖKNINGSFILTER
export const getDisc = async (
    req: Request<{}, {}, {}, DiscQuery>,
    res: Response<ApiResponse<IDisc[]>>
): Promise<void> => {

    try {
        let query: DiscQuery = {};
        const searchTerm = (req.query.search as string)?.trim().toLowerCase();

        if(searchTerm) {
            query.$or = query.$or || [];

            query.$or.push({ title: { $regex: `.*${searchTerm}.*`, $options: "i" } });
            query.$or.push({ type: { $regex: `.*${searchTerm}.*`, $options: "i" } });

            const numericValue = Number(searchTerm);
                if (!isNaN(numericValue)) {
                const numericFields: string[] = ["speed", "glide", "turn", "fade"];

                numericFields.forEach((field) => {
                    query.$or?.push({ [field]: numericValue });
                });
            }

            const manufacturerDocs = await Manufacturer.find({
                $or: [
                    { name: { $regex: `.*${searchTerm}.*`, $options: "i" } },
                    { country: { $regex: `.*${searchTerm}.*`, $options: "i" } }
                ]
            });

            if (manufacturerDocs.length > 0) {
                const manufacturerIds: mongoose.Types.ObjectId[] = manufacturerDocs.map(m => new mongoose.Types.ObjectId(m._id as mongoose.Types.ObjectId ));
            
                query.$or = query.$or || [];
                query.$or.push({ manufacturer: { $in: manufacturerIds } });
            }
            

            if (query.$or && query.$or.length === 0) {
                delete query.$or;
            }

            let Discs: IDisc[] = await Disc.find(query).populate("manufacturer").lean();

            if(Discs.length === 0){
                res.status(404).json({
                    success: true,
                    data: Discs, 
                    error: null,
                    message: "Sökningen matchade inget resultat!"
                }); 
            } else {
                res.status(200).json({
                    success: true,
                    data: Discs, 
                    error: null,
                    message: "Visar resultatet av din sökning!",
                });
            } 
        }

    } catch (err) {
        console.error(`fel för objektID: `, err);

        res.status(500).json({
            success: false,
            data: null,
            error: "Ett internt serverfel uppstod när anrop gjordes",
            message: null
        });

        return;
    }
}

// HÄMTA SPECIFIK DISC GENOM ATT ANGE ID
export const getDiscsById = async (
    req: Request<IdParams>,
    res: Response<ApiResponse<IDisc>>
): Promise<void> => {
    try {

        const { id } = req.params;
        const getDisc: IDisc | null = await Disc.findById(id).populate("manufacturer");

        if (!getDisc) {
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

    } catch (err) {
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

// UPPDATERA DELAR AV EN DISC GENOM PATCH METOD
export const updateDisc = async (
    req: Request<IdParams, {}, {}, IUpdateDiscBody>,
    res: Response<ApiResponse<IDisc>>
): Promise<void> => {
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
                message: null
            });

            return;
        }

        res.status(200).json({
            success: true,
            data: getDisc,
            error: null,
            message: `Disc med ID${id} uppdaterades!`
        });

    } catch (err) {
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

// TA BORT DISC
export const deleteDisc = async (
    req: Request<IdParams>,
    res: Response
): Promise<void> => {
    try {

        const { id } = req.params;

        const deleteDisc: IDisc | null = await Disc.findByIdAndDelete(id);

        if (!deleteDisc) {
            res.status(404).json({
                success: false,
                data: null,
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

    } catch (err) {
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