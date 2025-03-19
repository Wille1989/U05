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
exports.deleteDisc = exports.updateDisc = exports.getDiscsById = exports.getDisc = exports.createDisc = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// MODELS
const disc_1 = __importDefault(require("../models/disc"));
const manufacturer_1 = __importDefault(require("../models/manufacturer"));
const createDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDisc = new disc_1.default(req.body);
        yield newDisc.save();
        res.status(201).json({
            success: true,
            data: newDisc,
            error: null,
            message: `Discen med ID ${newDisc} sparades!`
        });
    }
    catch (err) {
        console.error("Fel uppstod när disc skulle skapas", {
            error: err,
            requestbody: req.body
        });
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            console.error("Mongooese validation Error:", err);
            console.log("Request Body Received:", req.body);
            res.status(400).json({
                success: false,
                data: null,
                error: "Valideringen misslyckades, försök igen",
                message: null
            });
            return;
        }
        else {
            res.status(500).json({
                success: false,
                data: null,
                error: "Ett internt serverfel uppstod vid anrop",
                message: null
            });
            return;
        }
    }
});
exports.createDisc = createDisc;
// HÄMTA DISC ELLER TILLVERKARE BASERAT PÅ SÖKNINGSFILTER
const getDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let query = {};
        const searchTerm = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
        if (searchTerm) {
            query.$or = query.$or || [];
            query.$or.push({ title: { $regex: `.*${searchTerm}.*`, $options: "i" } });
            query.$or.push({ type: { $regex: `.*${searchTerm}.*`, $options: "i" } });
            const numericValue = Number(searchTerm);
            if (!isNaN(numericValue)) {
                const numericFields = ["speed", "glide", "turn", "fade"];
                numericFields.forEach((field) => {
                    var _a;
                    (_a = query.$or) === null || _a === void 0 ? void 0 : _a.push({ [field]: numericValue });
                });
            }
            const manufacturerDocs = yield manufacturer_1.default.find({
                $or: [
                    { name: { $regex: `.*${searchTerm}.*`, $options: "i" } },
                    { country: { $regex: `.*${searchTerm}.*`, $options: "i" } }
                ]
            });
            console.log("🔍 Tillverkare som hittades:", manufacturerDocs);
            if (manufacturerDocs.length > 0) {
                const manufacturerIds = manufacturerDocs.map(m => new mongoose_1.default.Types.ObjectId(m._id));
                console.log("✅ Manufacturer IDs som ska läggas till i query:", manufacturerIds);
                query.$or = query.$or || [];
                query.$or.push({ manufacturer: { $in: manufacturerIds } });
            }
            if (query.$or && query.$or.length === 0) {
                console.log("⚠️ VARNING: query.$or är tom! Det betyder att vi kanske söker utan filter.");
                delete query.$or;
            }
            console.log("✅ Byggt query för Disc.find():", JSON.stringify(query, null, 2));
            let Discs = yield disc_1.default.find(query).populate("manufacturer").lean();
            res.status(200).json({
                success: true,
                data: Discs,
                error: null,
                message: "Visar resultatet av din sökning!"
            });
        }
    }
    catch (err) {
        console.error(`fel för objektID: `, err);
        res.status(500).json({
            success: false,
            data: null,
            error: "Ett internt serverfel uppstod när anrop gjordes",
            message: null
        });
        return;
    }
});
exports.getDisc = getDisc;
const getDiscsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getDisc = yield disc_1.default.findById(id).populate("manufacturer");
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
    }
    catch (err) {
        console.error("fel vid hämtning av discs:", err, req.params.id);
        res.status(500).json({
            success: false,
            data: null,
            error: "Ett internt serverfel uppstod när anrop gjordes",
            message: null
        });
        return;
    }
});
exports.getDiscsById = getDiscsById;
const updateDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const inputData = req.body;
        const getDisc = yield disc_1.default.findByIdAndUpdate(id, inputData, { new: true, runValidators: true });
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
    }
    catch (err) {
        console.error(`Ett fel uppstod när: ${req.params.id} skulle uppdateras och körningen avbröts!`, err);
        res.status(500).json({
            success: false,
            data: null,
            error: "Ett internt serverfel uppstod när anrop gjordes",
            message: null
        });
        return;
    }
});
exports.updateDisc = updateDisc;
const deleteDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteDisc = yield disc_1.default.findByIdAndDelete(id);
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
    }
    catch (err) {
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
});
exports.deleteDisc = deleteDisc;
