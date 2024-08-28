"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemAttributesRenderer = void 0;
const item_attributes_renderer_interface_1 = require("../../../common/renderers/item-attributes-renderer.interface");
const item_attributes_generator_interface_1 = require("../../../common/generators/item-attributes-generator.interface");
class ItemAttributesRenderer {
    attributesGetter;
    name;
    description;
    constructor(constructorProps = {}) {
        this.name = constructorProps.name ? constructorProps.name : () => "";
        this.description = constructorProps.description
            ? constructorProps.description
            : () => "";
        this.fileName = constructorProps.fileName ? constructorProps.fileName : () => ""
        this.rarity = constructorProps.rarity ? constructorProps.rarity : () => ""
    }
    async init(props) {
        this.attributesGetter = props.attributesGetter;
    }
    async render() {
        const renders = {};
        for (const [itemUid, attributes] of Object.entries(this.attributesGetter())) {
            const supportedAttributes = attributes
                .filter((attribute) => item_attributes_generator_interface_1.ITEM_ATTRIBUTES_GENERATOR_INTERFACE_V1 === attribute.kind)
                .map((attribute) => attribute.data);
            if (supportedAttributes.length < 1) {
                throw new Error(`Couldn't find any supported set of attributes for the current item: ${itemUid}`);
            }
            renders[itemUid] = [
                supportedAttributes.reduce((mergedAttributes, newAttributes) => {
                    mergedAttributes.data.dna.push(newAttributes.dna);
                    mergedAttributes.data.name = this.name(itemUid);
                    mergedAttributes.data.fileName = this.fileName(itemUid);
                    mergedAttributes.data.rarity = this.rarity(itemUid)
                    for (const key in newAttributes.attributes) {
                        if (mergedAttributes.data.attributes[key] === undefined) {
                            mergedAttributes.data.attributes[key] = [];
                        }
                        mergedAttributes.data.attributes[key].push(newAttributes.attributes[key]);
                    }
                    mergedAttributes.data.description = this.description(mergedAttributes.data.attributes);
                    return mergedAttributes;
                }, {
                    kind: item_attributes_renderer_interface_1.ITEM_ATTRIBUTES_RENDERER_INTERFACE_V1,
                    data: {
                        dna: [],
                        name: "",
                        description: "",
                        attributes: {},
                        fileName: "",
                        rarity: ""
                    },
                }),
            ];
        }
        return renders;
    }
}
exports.ItemAttributesRenderer = ItemAttributesRenderer;
