"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ItemsDataManager {
    areAttributesReadOnlyMode;
    areRendersReadOnlyMode;
    itemsAttributes;
    itemsRenders;
    constructor() {
        this.areAttributesReadOnlyMode = false;
        this.areRendersReadOnlyMode = false;
        this.itemsAttributes = {};
        this.itemsRenders = {};
    }
    freezeAttributes() {
        this.areAttributesReadOnlyMode = true;
        return this.itemsAttributes;
    }
    freezeRenders() {
        this.areRendersReadOnlyMode = true;
        return this.itemsRenders;
    }
    getAttributes() {
        return this.itemsAttributes;
    }
    addManyAttributes(data) {
        if (this.areAttributesReadOnlyMode) {
            throw new Error(`Trying to add all attributes data on a frozen ItemsDataManager`);
        }
        this.itemsAttributes = { ...this.itemsAttributes, ...data };
    }
    addAttributes(itemUid, attributes) {
        if (this.areAttributesReadOnlyMode) {
            throw new Error(`Trying to add attributes data on a frozen ItemsDataManager (item: "${itemUid}")`);
        }
        this.itemsAttributes[itemUid] = (this.itemsAttributes[itemUid] ?? []).concat(attributes);
    }
    getRenders() {
        return this.itemsRenders;
    }
    addManyRenders(data) {
        if (this.areRendersReadOnlyMode) {
            throw new Error(`Trying to add all renders data on a frozen ItemsDataManager`);
        }
        this.itemsRenders = { ...this.itemsRenders, ...data };
    }
    addRenders(itemUid, renders) {
        if (this.areRendersReadOnlyMode) {
            throw new Error(`Trying to add renders data on a frozen ItemsDataManager (item: "${itemUid}")`);
        }
        this.itemsRenders[itemUid] = (this.itemsRenders[itemUid] ?? []).concat(renders);
    }
}
exports.default = ItemsDataManager;
