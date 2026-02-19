"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectRa = void 0;
class ObjectRa {
    constructor(attributes) {
        this.attributes = attributes;
    }
    get data() {
        return this.attributes;
    }
    toJSON() {
        return this.attributes;
    }
}
exports.ObjectRa = ObjectRa;
