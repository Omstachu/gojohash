import { ItemPropertiesInterface } from "./items-data.interface";
type ItemsDataType = {
    [itemUid: string]: ItemPropertiesInterface<any>[];
};
export default class ItemsDataManager {
    private areAttributesReadOnlyMode;
    private areRendersReadOnlyMode;
    private itemsAttributes;
    private itemsRenders;
    constructor();
    freezeAttributes(): ItemsDataType;
    freezeRenders(): ItemsDataType;
    getAttributes(): ItemsDataManager["itemsAttributes"];
    addManyAttributes(data: ItemsDataType): void;
    addAttributes(itemUid: string, attributes: ItemPropertiesInterface<any>[]): void;
    getRenders(): ItemsDataManager["itemsRenders"];
    addManyRenders(data: ItemsDataType): void;
    addRenders(itemUid: string, renders: ItemPropertiesInterface<any>[]): void;
}
export {};
//# sourceMappingURL=items-data.manager.d.ts.map