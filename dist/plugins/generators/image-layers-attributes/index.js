"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageLayersAttributesGenerator = void 0;
const path = __importStar(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const image_layers_generator_interface_1 = require("../../../common/generators/image-layers-generator.interface");
const item_attributes_generator_interface_1 = require("../../../common/generators/item-attributes-generator.interface");
const image_layers_1 = require("../../inputs/image-layers");
const random_seed_1 = __importDefault(require("random-seed"));
class ImageLayersAttributesGenerator {
    inputsManager;
    dataSet;
    data;
    startIndex;
    endIndex;
    rmg;
    constructor(constructorProps) {
        this.dataSet = constructorProps.dataSet;
        this.startIndex = constructorProps.startIndex;
        this.endIndex = constructorProps.endIndex;
        if (this.endIndex < this.startIndex ||
            this.startIndex + this.endIndex < 1) {
            throw new Error(`The startIndex property needs to be less than the endIndex property`);
        }
    }
    async init(props) {
        this.inputsManager = props.inputsManager;
        this.data = this.inputsManager.get(this.dataSet);
        this.rmg = random_seed_1.default.create(this.dataSet + this.constructor.name + props.seed);
        // TODO: add support for "kind"
    }
    async generate() {
        const items = {};
        const dnas = new Set();
        let uid = this.startIndex;
        while (uid <= this.endIndex) {
            const itemAttributes = {};
            let itemAssets = [];
            // Compute attributes
            for (let layer of Object.values(this.data.layers)) {
                itemAttributes[layer.name] = this.selectRandomItemByWeight(layer.options);
            }
            // Compute DNA
            const itemDna = this.calculateDna(itemAttributes);
            if (dnas.has(itemDna)) {
                console.log(`Duplicate DNA entry, generating one more...`);
                continue;
            }
            dnas.add(itemDna);
            // Compute assets
            for (const attributeName of Object.keys(itemAttributes)) {
                const layer = this.data.layers[attributeName];
                const option = layer.options[itemAttributes[attributeName]];
                let assets = [];
                for (const edgeCaseUid of Object.keys(option.edgeCases)) {
                    const [matchingTrait, matchingValue] = edgeCaseUid.split(image_layers_1.EDGE_CASE_UID_SEPARATOR);
                    if (matchingValue === itemAttributes[matchingTrait]) {
                        assets = assets.concat(option.edgeCases[edgeCaseUid].assets);
                        break;
                    }
                }
                if (assets.length === 0) {
                    assets = assets.concat(option.assets);
                }
                itemAssets = itemAssets.concat(assets.map((asset) => ({
                    path: path.join(this.data.basePath, asset.path),
                    xOffset: layer.baseXOffset + asset.relativeXOffset,
                    yOffset: layer.baseYOffset + asset.relativeYOffset,
                    zOffset: layer.baseZOffset + asset.relativeZOffset,
                })));
            }
            items[uid.toString()] = [
                {
                    kind: item_attributes_generator_interface_1.ITEM_ATTRIBUTES_GENERATOR_INTERFACE_V1,
                    data: {
                        dna: itemDna,
                        attributes: itemAttributes,
                    },
                },
                {
                    kind: image_layers_generator_interface_1.IMAGE_LAYERS_GENERATOR_INTERFACE_V1,
                    data: {
                        assets: itemAssets,
                    },
                },
            ];
            uid++;
        }
        return items;
    }
    calculateDna(attributes) {
        const dnaSource = Object.keys(attributes)
            .map((key) => [key, attributes[key]])
            .sort((a, b) => {
            const nameA = a[0].toUpperCase();
            const nameB = b[0].toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
        return crypto_1.default
            .createHash("sha1")
            .update(JSON.stringify(dnaSource))
            .digest("hex");
    }
    selectRandomItemByWeight(options) {
        const totalWeight = Object.values(options).reduce((accumulator, currentValue) => accumulator + currentValue.weight, 0);
        let randomNumber = this.rmg.random() * totalWeight;
        for (const key of Object.keys(options)) {
            if (randomNumber < options[key].weight) {
                return key;
            }
            randomNumber -= options[key].weight;
        }
        throw new Error("Couldn't pick any random option...");
    }
}
exports.ImageLayersAttributesGenerator = ImageLayersAttributesGenerator;
