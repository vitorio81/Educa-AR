"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectRaController = void 0;
const HttpErrors_1 = require("../errors/HttpErrors");
const zod_1 = require("zod");
const StoreSchema = zod_1.z.object({
    codeRoom: zod_1.z.number().int().positive(),
    nameObject: zod_1.z.string().min(1),
    descriptionObject: zod_1.z.string().min(1),
    fileUrlObject: zod_1.z.string().url(),
});
class ObjectRaController {
    constructor(objectRaRepo) {
        this.objectRaRepo = objectRaRepo;
        this.index = (req, res) => {
            const objectsRa = this.objectRaRepo.findAll();
            res.json(objectsRa);
        };
        this.store = (req, res) => {
            const parseBody = StoreSchema.parse(req.body);
            const newObjectRa = this.objectRaRepo.create(parseBody);
            res.status(201).json(newObjectRa);
        };
        this.show = (req, res) => {
            const { id } = req.params;
            const objectRa = this.objectRaRepo.findById(+id);
            if (!objectRa)
                throw new HttpErrors_1.HttpError(404, "Object RA not found");
            return res.status(200).json(objectRa);
        };
        this.update = (req, res) => {
            const { id } = req.params;
            const parseBody = StoreSchema.partial().parse(req.body);
            const objectRa = this.objectRaRepo.findById(+id);
            if (!objectRa)
                throw new HttpErrors_1.HttpError(404, "Object RA not found");
            const updatedObjectRa = this.objectRaRepo.update(+id, parseBody);
            return res.status(200).json(updatedObjectRa);
        };
        this.delete = (req, res) => {
            const { id } = req.params;
            const objectRa = this.objectRaRepo.findById(+id);
            if (!objectRa)
                throw new HttpErrors_1.HttpError(404, "Object RA not found");
            ;
            const objectRaDeleted = this.objectRaRepo.delete(+id);
            return res.status(200).json(objectRaDeleted);
        };
    }
}
exports.ObjectRaController = ObjectRaController;
