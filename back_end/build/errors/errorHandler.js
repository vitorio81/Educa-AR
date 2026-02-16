"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const HttpErrors_1 = require("./HttpErrors");
const errorHandler = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: "Invalid request body",
            details: err.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }
    if (err instanceof HttpErrors_1.HttpError) {
        return res.status(err.status).json({
            error: err.message,
        });
    }
    console.error(err);
    return res.status(500).json({
        error: "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
