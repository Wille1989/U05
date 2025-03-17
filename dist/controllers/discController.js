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
        return res.status(201).json(newDisc);
    }
    catch (err) {
        console.error("Fel uppstod när disc skulle skapas", {
            error: err,
            requestbody: req.body
        });
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json({ error: err.message });
        }
        else {
            return res.status(500).json({ error: "Ett internt serverfel uppstod vid anrop" });
        }
    }
});
exports.createDisc = createDisc;
const getDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let query = {};
        const searchTerm = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
        if (searchTerm) {
            query.$or = query.$or || [];
            query.$or.push({ title: { $regex: searchTerm, $options: "i" } });
            query.$or.push({ type: { $regex: searchTerm, $options: "i" } });
            if (!req.query.manufacturer) {
                const manufacturerDocs = yield manufacturer_1.default.find({
                    name: { $regex: searchTerm, $options: "i" },
                    country: { $regex: searchTerm, $options: "i" }
                });
                if (!manufacturerDocs || manufacturerDocs.length === 0) {
                    return res.status(manufacturerDocs ? 404 : 500).json({ error: "Inga tillverkare hittades!" });
                }
                const manufacturerIds = manufacturerDocs.map(m => new mongoose_1.default.Types.ObjectId(m._id));
                query.$or.push({ manufacturer: { $in: manufacturerIds } });
            }
        }
        const numericFields = ["speed", "glide", "turn", "fade"];
        numericFields.forEach((field) => {
            if (req.query[field]) {
                const numericValue = Number(req.query[field]);
                if (!isNaN(numericValue)) {
                    query[field] = numericValue;
                }
            }
        });
        if (query.$or && query.$or.length === 0) {
            delete query.$or;
        }
        let Discs = yield disc_1.default.find(query).populate("manufacturer");
        return res.status(200).json(Discs);
    }
    catch (err) {
        console.error(`fel för objektID: `, err);
        return res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.getDisc = getDisc;
const getDiscsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getDisc = yield disc_1.default.findById(id).populate("manufacturer");
        if (!getDisc) {
            return res.status(404).json({ error: "Discen kunde inte hittas!" });
        }
        return res.status(200).json(getDisc);
    }
    catch (err) {
        console.error("fel vid hämtning av discs:", err, req.params.id);
        return res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.getDiscsById = getDiscsById;
const updateDisc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const inputData = req.body;
        const getDisc = yield disc_1.default.findByIdAndUpdate(id, inputData, { new: true, runValidators: true });
        if (!getDisc) {
            return res.status(404).json({ error: `Disc med ID: ${id} går inte att hitta` });
        }
        return res.status(200).json(getDisc);
    }
    catch (err) {
        console.error(`Ett fel uppstod när: ${req.params.id} skulle uppdateras och körningen avbröts!`, err);
        return res.status(500).json({ error: "Ett internt serverfel uppstod när anrop gjordes" });
    }
});
exports.updateDisc = updateDisc;
const deleteDisc = (req, res) => {
    console.log("DELETE-funktion anropad med ID:", req.params.id);
    return res.status(200).json({ message: "DELETE lyckades!" });
};
exports.deleteDisc = deleteDisc;
/*
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
}*/ 
