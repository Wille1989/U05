import { Request, Response } from "express";
import Disc, { IDisc } from "../models/disc";
import manufacturer from "../models/manufacturer";


export const createDisc = async (req:Request, res:Response): Promise <void> => {
    try {

        const { title, type, manufacturer, speed, glide, turn, fade } = req.body;

        if(!title || !type || !manufacturer || speed === undefined || glide === undefined || turn === undefined || fade === undefined) {
            res.status(404).json({error: "Alla fält måste vara ifyllda!"});
            return;
        }

        const allowedTypes = ["Distance Driver", "Driver", "Mid-Range", "Putter"];
        if(!allowedTypes.includes(type)) {
            res.status(404).json({error: `Ogiltig disc-typ. Endast ${allowedTypes.join(", ")} är tillåtna`});
            return;
        }

        const newDisc: IDisc = await Disc.create({
            title,
            type,
            manufacturer,
            speed,
            glide,
            turn,
            fade,
        });

        res.status(201).json(newDisc);

    } catch (err){
        console.error("Det gick inte att skapa en ny disc", err);
        res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
};

export const getDisc = async (req: Request, res: Response): Promise <void> => {
  
    try {
        let query: Record <string, unknown> = {};
        const searchTerm = (req.query.search as string)?.trim();

        if(searchTerm) {
            query.$or = [
                { title: {$regex: searchTerm, $options: "i"} },
                { type: {$regex: searchTerm, $options: "i"} }
            ]
        }

        if(searchTerm && !req.query.manufacturer) {
            const manufacturerDocs = await manufacturer.find({
                name: { $regex: searchTerm, $options: "i" },
                country: { $regex: searchTerm, $options: "i" }
            });

            if(!manufacturerDocs){
                throw new Error("Database error: Manufacturer query returned null");
            }

            if(!query.$or){
                query.$or = [] as Record <string, unknown> [];
            }
        
            if(manufacturerDocs.length > 0) {
                (query.$or as Record<string, unknown>[]).push({ manufacturer: { $in: manufacturerDocs.map(m => m._id) }});
            } else {
                throw new Error("Internal server Error: $or should be an array but isn't");
            }
        }
  
        if (req.query.type) query.type = req.query.type as string;
        if (req.query.manufacturer) query.manufacturer = req.query.manufacturer as string;
        
        const numericField: string[] = ["speed", "glide", "turn", "fade"];
        
        numericField.forEach((field: string) => {
            if(req.query[field]){
                const value = req.query[field];

                if (typeof value === "string"){
                    query[field] = Number(value);
                } else if (typeof value === "object" && value !== null) {
                    query[field] = {};

                    for (const operator in value) {
                        if (["gte", "lte", "gt", "lt"].includes(operator)){
                            (query[field] as Record <string, number>)[`$${operator}`] = Number((value as Record <string, string>)[operator]);
                        }
                    }
                }
            }
        });


        let Discs = await Disc.find(query).populate("manufacturer");

        if (Discs.length === 0){
            let fallbackquery: Record <string, unknown> = {};

            numericField.forEach((field) => {
                if (req.query[field]){
                    const requestedValue = Number(req.query[field]);
                    fallbackquery[field] = { $in: [
                        requestedValue - 1,
                        requestedValue - 2,
                        requestedValue - 3,
                        requestedValue + 1,
                        requestedValue + 2,
                        requestedValue + 3,] }
                }
            });

            Discs = await Disc.find(fallbackquery).populate("manufacturer");
        }

        res.status(200).json(Discs);

    } catch(err){
        console.error(`fel för objektID: ${req.params.id}`);
        res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
}

export const getDiscsById = async (req:Request, res:Response): Promise <void> => {
    try {

        const getDisc: IDisc | null = await Disc.findById(req.params.id).populate("manufacturer");
        if(!getDisc) {
            res.status(404).json({error: "Discen finns inte i vårat sortiment!"});
            return; 
        }

        res.status(200).json(getDisc);

    } catch (err){
        console.error("fel vid hämtning av discs:", err);
        res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
}

export const updateDisc = async (req:Request, res:Response): Promise <void> => {
    try {
        const getDisc: IDisc | null = await Disc.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true });

        if (!getDisc) {
            res.status(404).json({error: `Disc med ID: ${req.params.id} går inte att hitta`});
            return;
        }

        res.status(200).json(getDisc);
        
    } catch (err){
        console.error(`Ett fel uppstod när: ${req.params.id} skulle uppdateras och körningen avbröts!`, err);
        res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
}

export const deleteDisc = async (req:Request, res:Response): Promise <void> => {
    try {
        const deleteDisc: IDisc | null = await Disc.findByIdAndDelete(req.params.id);

        if(!deleteDisc) {
            res.status(404).json({error: `ID:t ${req.params.id} kan ej hittas!`});
            return;
        }

        res.status(200).json({ message: "Du har tagit bort discen" });

    } catch (err){
        console.error("Fel vid borttagning av disc:", err);
        res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
}