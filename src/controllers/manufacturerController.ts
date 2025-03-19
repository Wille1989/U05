
// MAIN
import mongoose from "mongoose";
import { Request, Response } from "express";

// MODELS
import Manufacturer from "../models/manufacturer";
import Disc from "../models/disc";

// TYPES
import { ICreateManufacturerBody, IUpdateManufacturerBody } from "../types/manufacturer";
import { IManufacturerBody } from "../types/manufacturer";
import { ApiResponse } from "../types/responseTypes";
import { IdParams } from "../types/requestTypes";




// SKAPA TILLVERKARE
export const createManufacturer = async (
    req: Request <{}, {},ICreateManufacturerBody>, 
    res: Response <ApiResponse<ICreateManufacturerBody>>
    ): Promise <void> => {

    try {
        let { name, country } = req.body;

        if (!name || !country) {
            res.status(404).json({
                success: false,
                data: null,
                error: "Ange Namn och Land för tillverkare :)",
                message: null
            });

            return;
        }

        // Check om tillverkaren redan finns i systemet
        name = name.trim().toLowerCase();
        const existingManufacturer = await Manufacturer.findOne ({ name });

        if(existingManufacturer) {
            res.status(409).json({ 
                success: false,
                data: null,
                error: "Tillverkaren finns redan, sök efter specifik tillverkare för ID",
                message: null
            });

            return;
        }

        // Skapa ny tillverkare
        const newManufacturer: IManufacturerBody = await Manufacturer.create ({
            name,
            country,
        });

        res.status(201).json({
            success: true,
            data: newManufacturer,
            error: null,
            message: "Tillvarken tillagd i sortimentet!"
        });

        return;


    } catch (err) {
        console.error(`Fel uppstod vid skapandet av tillverkare`, {
            requestbody: req.body,
            error: err
        });

        res.status(500).json({
            success: false,
            data: null,
            error: "Ett internt serverfel uppstod vid anrop",
            message: null
        });

        return;

    }
}


// HÄMTA ALLA TILLVERKARE
export const getManufacturer = async ( 
    req: Request,
    res: Response<ApiResponse<IManufacturerBody[]>>
    ): Promise<void> => {
    
    try {
        const manufacturers: IManufacturerBody[] = await Manufacturer.find();

        if(manufacturers.length === 0){
            res.status(404).json({
                success: false,
                data: null,
                error: "inga tillverkare hittades!",
                message: null
            });

            return;
        }

        res.status(200).json({
            success: true,
            data: manufacturers,
            error: null,
            message: "Tillverkare hämtad!"
        });

    } catch (err) {
        console.error(`Gick inte att hämta tillverkare`, {
            error: err
        });

        res.status(500).json({
            success: true,
            data: null,
            error: "Ett internt serverfel uppstod när anrop gjordes",
            message: null
        });
        
        return;
    }
};


// HÄMTA SPECIFIK TILLVERKARE MED ID
export const getManufacturerByID = async (
    req: Request<IdParams>, 
    res: Response<ApiResponse<IManufacturerBody>>
    ): Promise <void> => {
    
    try {

        const { id } = req.params;
        const getManufacturerByID: IManufacturerBody | null = await Manufacturer.findById(id);

        if(!getManufacturerByID) {
            res.status(404).json({
                success: false,
                data: null,
                error: "Tillverkaren kunde inte hittas!",
                message: null
            });

            return;
        }

        res.status(200).json({
            success: true,
            data: getManufacturerByID,
            error: null,
            message: `Tillverkaren med ID ${id} hämtad!`
        });

    } catch (err) {
        console.error(`Fel uppstod vid hämtning av specifik tillverkare`, {
            id: req.params.id || "Ej tillgängligt",
            error: err
        });

        if (err instanceof mongoose.Error.CastError) {
            res.status(400).json({
                success: false,
                data: null, 
                error: "Ogiltigt ID-format!",
                message: null
            });

            return;
        }

        res.status(500).json({
            success: false,
            data: null,
            error: "Ett internt serverfel uppstod vid anrop", 
            message: null
        });

        return;

    }
}


// HÄMTA OCH UPPDATERA BEFINTLIG TILLVERKARE MED PATCH METODEN
export const updateManufacturer = async (
    req: Request<IdParams, {}, IUpdateManufacturerBody>, 
    res: Response<ApiResponse<IUpdateManufacturerBody>>
    ): Promise <void> => {
    try {

        const { id } = req.params;
        const updateData: IUpdateManufacturerBody = req.body;

        if(!updateData.name && !updateData.country) {
            res.status(400).json({
                success: false,
                data: null, 
                error: "Fälten kan inte vara tomma!", 
                message: null 
            });

            return;
        }

        const manufacturerDocs: IManufacturerBody | null = await Manufacturer.findByIdAndUpdate(
            id, 
            updateData,
            { new: true, runValidators: true}
        );

        if(!manufacturerDocs){
            res.status(404).json({ 
                success: false, 
                data: null, 
                error: "tillverkare hittades ej och kunde inte uppdateras!", 
                message: null 
            });

            return;
        }

        res.status(200).json({
            success: true, 
            data: manufacturerDocs, 
            error: null, 
            message: `Uppdatering av ${updateData} gjord!`});

    } catch (err) {
        console.error(`Fel uppstod vid uppdatering av specifik tillverkare`, {
            id: req.params.id || "Ej tillgängligt",
            requestbody: req.body,
            error: err
        });

        if(err instanceof mongoose.Error.CastError) {
            res.status(400).json({ 
                success: false, 
                data: null, 
                error: "Ogiltigt ID-format!", 
                message: null 
            });

            return;
        }

        res.status(500).json({
            success: false, 
            data: null, 
            error: "Ett internt serverfel uppstod när anrop gjordes", 
            message: null
        });

        return;
    }
}


// TA BORT TILLVERKARE
export const deleteManufacturerByID = async (req: Request, res: Response): Promise <void> => {
    try {

        const { id } = req.params;

        if (!id) { 
            res.status(400).json({ error: "Ett ID måste anges!" });
            return;
        }

        const deleteManufacturer: IManufacturerBody | null = await Manufacturer.findById(id);

        if(!deleteManufacturer) {
            res.status(400).json({ error: "Kan inte hitta en tillverkare med detta ID" });
            return; 
        }

        await Disc.deleteMany({ manufacturer: deleteManufacturer._id});

        await Manufacturer.findByIdAndDelete(id);
        
        res.status(200).json({ message: "Du har tagit bort tillverkaren och alla tillhörande discar!"});


    } catch (err) {
        console.error(`Fel uppstod när tillverkaren skulle tas bort`, {
            id: req.params.id || "Ej tillgängligt",
            error: err
        });

        res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
        return;

    }
}