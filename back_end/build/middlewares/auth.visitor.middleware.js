"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authVisitorMiddleware = authVisitorMiddleware;
const jwtVisitor_1 = require("../utils/jwtVisitor");
function authVisitorMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader);
    if (!authHeader) {
        return res.status(401).json({
            message: "Token não fornecido",
        });
    }
    const [, token] = authHeader.split(" ");
    try {
        const decoded = (0, jwtVisitor_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (_a) {
        return res.status(401).json({
            message: "Token inválido ou expirado",
        });
    }
}
