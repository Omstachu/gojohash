"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InputsManager {
    isReadOnlyMode;
    inputsData;
    constructor() {
        this.isReadOnlyMode = false;
        this.inputsData = {};
    }
    freeze() {
        this.isReadOnlyMode = true;
        return this.inputsData;
    }
    get(key) {
        if (!(key in this.inputsData)) {
            throw new Error(`Getting a request for unknown input: "${key}"`);
        }
        return this.inputsData[key];
    }
    set(key, data) {
        if (this.isReadOnlyMode) {
            throw new Error(`Trying to update data on a frozen InputManager (key: "${key}")`);
        }
        if (key in this.inputsData) {
            throw new Error(`Trying to overwrite input date for an existing key: "${key}"`);
        }
        this.inputsData[key] = data;
    }
}
exports.default = InputsManager;
