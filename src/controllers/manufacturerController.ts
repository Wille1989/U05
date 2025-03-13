import { Request, Response } from "express";
import manufacturer, { Imanufacturer } from "../models/manufacturer";
import Disc from "../models/disc";

export const createManufacturer = async (req:Request, res: Response): Promise <void> => {
    try {
        const { name, country } = req.body;

        if (!name || !country) {
            res.status(404).json({error: "båda fälten för tillverkare måste vara ifyllda!"});
            return;
        }

        const newManufacturer: Imanufacturer = await manufacturer.create ({
            name,
            country,
        });

        res.status(201).json(newManufacturer)

    } catch (err) {
        console.error(`Fel uppstod vid skapandet av tillverkare`, err)
        res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
}

export const getManufacturer = async (req:Request, res:Response): Promise <void> => {
    
    try {
        const manufacturers: Imanufacturer[] = await manufacturer.find();

        if(!manufacturers){
            res.status(404).json(["Gick inte att hämta tillverkare!"]);
        }

        res.status(200).json(manufacturers);

    } catch (err) {
        console.error(`Gick inte att hämta tillverkare`, err);
        res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
};

export const getManufacturerByID = async (req: Request, res: Response): Promise <void> => {
    try {
        const getManufacturerByID: Imanufacturer | null = await manufacturer.findById(req.params.id);

        if(!getManufacturerByID){
            res.status(404).json([`Tillverkaren kunde inte hittas!`]);
            return;
        }

        res.status(200).json(getManufacturerByID);

    } catch (err) {
        console.error(`Något fick fel vid hämtning av den specifika tillverkaren!
            - ID ${req.params.id}`, 
            "- Felmeddelande:", err);
        res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
}

export const updateManufacturer = async (req: Request, res: Response): Promise <void> => {
    try {
        const manufacturerDocs: Imanufacturer | null = await manufacturer.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true, runValidators: true}
        );

        if(!manufacturerDocs){
            res.status(404).json(["Tillverkaren kunde inte hittas och gick ej att uppdatera!"]);
            return;
        }

        res.status(200).json(manufacturerDocs);

    } catch (err) {
        console.error(`Fel vid uppdatering av tillverkare!
            - ID: ${req.params.id}
            - request body:`, req.body,
            "- Felmeddelande:", err);
        res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});
    }
}

export const deleteManufacturer = async (req: Request, res: Response): Promise <void> => {
    try {
        const deleteManufacturer: Imanufacturer | null = await manufacturer.findById(req.params.id);

        if(!deleteManufacturer) {
            res.status(400).json({error: "Kan inte hitta en tillverkare med detta ID"});
            return;
        }

        await Disc.deleteMany({ manufacturer: deleteManufacturer._id});

        await manufacturer.findByIdAndDelete(req.params.id);
    
        res.status(200).json({ message: "Du har tagit bort tillverkaren och alla tillhörande discar!"});

    } catch (err) {
        console.error(`Fel uppstod vid borttagning av tillverkare!
            - ID: ${req.params.id}`,
            "- Felmeddelande:", err);
        res.status(500).json({error: (err as Error).message});
    }
}