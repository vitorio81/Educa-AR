import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "./HttpErrors";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid request body",
      details: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    error: "Internal Server Error",
  });
};
