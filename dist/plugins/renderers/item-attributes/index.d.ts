import RendererInterface, { ItemsRenders, RendererInitPropsInterface } from "../../../common/renderers/renderer.interface";
import AttributesRendererInterface from "../../../common/renderers/item-attributes-renderer.interface";
export declare class ItemAttributesRenderer implements RendererInterface<AttributesRendererInterface> {
    private attributesGetter;
    private name;
    private description;
    constructor(constructorProps?: {
        name?: (itemUid: string, attributes: AttributesRendererInterface["attributes"]) => string;
        description?: (attributes: AttributesRendererInterface["attributes"]) => string;
    });
    init(props: RendererInitPropsInterface): Promise<void>;
    render(): Promise<ItemsRenders<AttributesRendererInterface>>;
}
//# sourceMappingURL=index.d.ts.map
