"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    constructor(attributes) {
        this.attributes = attributes;
    }
    get data() {
        return this.attributes;
    }
    update(data) {
        this.attributes = Object.assign(Object.assign(Object.assign({}, this.attributes), data), { updatedAt: new Date() });
    }
    toJSON() {
        return this.attributes;
    }
}
exports.Room = Room;
