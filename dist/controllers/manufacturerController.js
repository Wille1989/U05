"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManufacturerByID = exports.updateManufacturer = exports.getManufacturerByID = exports.getManufacturer = exports.createManufacturer = void 0;
// MAIN
const mongoose_1 = __importDefault(require("mongoose"));
// MODELS
const manufacturer_1 = __importDefault(require("../models/manufacturer"));
const disc_1 = __importDefault(require("../models/disc"));
// SKAPA TILLVERKARE
const createManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingManufacturer = yield manufacturer_1.default.findOne({ name });
        if (existingManufacturer) {
            res.status(409).json({
                success: false,
                data: null,
                error: "Tillverkaren finns redan, sök efter specifik tillverkare för ID",
                message: null
            });
            return;
        }
        // Skapa ny tillverkare
        const newManufacturer = yield manufacturer_1.default.create({
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
    }
    catch (err) {
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
});
exports.createManufacturer = createManufacturer;
// HÄMTA ALLA TILLVERKARE
const getManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manufacturers = yield manufacturer_1.default.find();
        if (manufacturers.length === 0) {
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
    }
    catch (err) {
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
});
exports.getManufacturer = getManufacturer;
// HÄMTA SPECIFIK TILLVERKARE
const getManufacturerByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getManufacturerByID = yield manufacturer_1.default.findById(id);
        if (!getManufacturerByID) {
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
    }
    catch (err) {
        console.error(`Fel uppstod vid hämtning av specifik tillverkare`, {
            id: req.params.id || "Ej tillgängligt",
            error: err
        });
        if (err instanceof mongoose_1.default.Error.CastError) {
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
});
exports.getManufacturerByID = getManufacturerByID;
// HÄMTA OCH UPPDATERA BEFINTLIG TILLVERKARE
const updateManufacturer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!updateData.name && !updateData.country) {
            res.status(400).json({
                success: false,
                data: null,
                error: "Fälten kan inte vara tomma!",
                message: null
            });
            return;
        }
        const manufacturerDocs = yield manufacturer_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!manufacturerDocs) {
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
            message: `Uppdatering av ${updateData} gjord!`
        });
    }
    catch (err) {
        console.error(`Fel uppstod vid uppdatering av specifik tillverkare`, {
            id: req.params.id || "Ej tillgängligt",
            requestbody: req.body,
            error: err
        });
        if (err instanceof mongoose_1.default.Error.CastError) {
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
});
exports.updateManufacturer = updateManufacturer;
// TA BORT TILLVERKARE
const deleteManufacturerByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Ett ID måste anges!" });
            return;
        }
        const deleteManufacturer = yield manufacturer_1.default.findById(id);
        if (!deleteManufacturer) {
            res.status(400).json({ error: "Kan inte hitta en tillverkare med detta ID" });
            return;
        }
        yield disc_1.default.deleteMany({ manufacturer: deleteManufacturer._id });
        yield manufacturer_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Du har tagit bort tillverkaren och alla tillhörande discar!" });
    }
    catch (err) {
        console.error(`Fel uppstod när tillverkaren skulle tas bort`, {
            id: req.params.id || "Ej tillgängligt",
            error: err
        });
        res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
        return;
    }
});
exports.deleteManufacturerByID = deleteManufacturerByID;
