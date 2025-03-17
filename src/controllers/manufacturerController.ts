
// MAIN
import mongoose from "mongoose";
import { Request, Response } from "express";

// MODELS
import manufacturer from "../models/manufacturer";
import Disc from "../models/disc";

// TYPES
import { ICreateManufacturerBody, IUpdateManufacturerBody } from "../types/manufacturer";
import { IManufacturerBody } from "../types/manufacturer";
import { ApiError }from "../types/responseTypes";
import { IdParams } from "../types/requestTypes";




// SKAPA TILLVERKARE
export const createManufacturer = async (
    req: Request <{}, {},ICreateManufacturerBody>, 
    res: Response <IManufacturerBody | ApiError>
    ): Promise <Response <IManufacturerBody | ApiError>> => {

    try {
        let { name, country } = req.body;

        if (!name || !country) {
            return res.status(404).json({ error: "Namn och Land är obligatoriska fält!" });
        }

        name = name.trim().toLowerCase();

        const existingManufacturer = await manufacturer.findOne ({ name });
        if(existingManufacturer) {
            return res.status(409).json({ error: "Tillverkaren finns redan, hämta alla tillverkare istället!" });
        }

        const newManufacturer: IManufacturerBody = await manufacturer.create ({
            name,
            country,
        });

        return res.status(201).json(newManufacturer)

    } catch (err) {
        console.error(`Fel uppstod vid skapandet av tillverkare`, {
            requestbody: req.body,
            error: err
        });

        return res.status(500).json({error: "Ett internt serverfel uppstod vid anrop"});

    }
}


// HÄMTA ALLA TILLVERKARE
export const getManufacturer = async (
    res: Response<IManufacturerBody[] | ApiError>
    ): Promise<Response<IManufacturerBody[] | ApiError>> => {
    
    try {
        const manufacturers: IManufacturerBody[] = await manufacturer.find();

        if(manufacturers.length === 0){
            return res.status(404).json({ error: "inga tillverkare hittades!" });
        }

        return res.status(200).json(manufacturers);

    } catch (err) {
        console.error(`Gick inte att hämta tillverkare`, {
            error: err
        });

        return res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});

    }
};


// HÄMTA SPECIFIK TILLVERKARE
export const getManufacturerByID = async (
    req: Request<IdParams>, 
    res: Response<IManufacturerBody | ApiError>
    ): Promise <Response<IManufacturerBody | ApiError>> => {
    
    try {

        const { id } = req.params;
        const getManufacturerByID: IManufacturerBody | null = await manufacturer.findById(id);

        if(!getManufacturerByID){
            return res.status(404).json({ error: "Tillverkaren kunde inte hittas!" });
        }

        return res.status(200).json(getManufacturerByID);

    } catch (err) {
        console.error(`Fel uppstod vid hämtning av specifik tillverkare`, {
            id: req.params.id || "Ej tillgängligt",
            error: err
        });

        if (err instanceof mongoose.Error.CastError) {
            return res.status(400).json({ error: "Ogiltigt ID-format!"});
        }

        return res.status(500).json({error: "Ett internt serverfel uppstod vid anrop"});

    }
}


// HÄMTA OCH UPPDATERA BEFINTLIG TILLVERKARE
export const updateManufacturer = async (
    req: Request<IdParams, {}, IUpdateManufacturerBody>, 
    res: Response<IManufacturerBody | ApiError>
    ): Promise <Response<IManufacturerBody | ApiError>> => {
    try {

        const { id } = req.params;
        const updateData: IUpdateManufacturerBody = req.body;

        if(!updateData.name && !updateData.country) {
            return res.status(400).json({ error: "Fälten kan inte vara tomma!" });
        }

        const manufacturerDocs: IManufacturerBody | null = await manufacturer.findByIdAndUpdate(
            id, 
            updateData,
            { new: true, runValidators: true}
        );

        if(!manufacturerDocs){
            return res.status(404).json({ error: "tillverkare hittades ej och kunde inte uppdateras!" });
        }

        return res.status(200).json(manufacturerDocs);

    } catch (err) {
        console.error(`Fel uppstod vid uppdatering av specifik tillverkare`, {
            id: req.params.id || "Ej tillgängligt",
            requestbody: req.body,
            error: err
        });

        if(err instanceof mongoose.Error.CastError) {
            return res.status(400).json({ error: "Ogiltigt ID-format!" });
        }

        return res.status(500).json({error: "Ett internt serverfel uppstod när anrop gjordes"});

    }
}


// TA BORT TILLVERKARE
export const deleteManufacturer = async (
    req: Request<IdParams>, 
    res: Response
    ): Promise <Response<IManufacturerBody | ApiError>> => {
    try {

        const { id } = req.params;

        if (!id) { 
            return res.status(400).json({ error: "Ett ID måste anges!" });
        }

        const deleteManufacturer: IManufacturerBody | null = await manufacturer.findById(id);

        if(!deleteManufacturer) {
            return res.status(400).json({ error: "Kan inte hitta en tillverkare med detta ID" });

        }

        await Disc.deleteMany({ manufacturer: deleteManufacturer._id});

        await manufacturer.findByIdAndDelete(id);
    
        return res.status(200).json({ message: "Du har tagit bort tillverkaren och alla tillhörande discar!"});

    } catch (err) {
        console.error(`Fel uppstod när tillverkaren skulle tas bort`, {
            id: req.params.id || "Ej tillgängligt",
            error: err
        });

        return res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });

    }
}