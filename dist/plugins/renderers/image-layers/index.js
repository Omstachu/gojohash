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
exports.ImageLayersRenderer = void 0;
const static_layered_images_renderer_interface_1 = require("../../../common/renderers/static-layered-images-renderer.interface");
const image_layers_generator_interface_1 = require("../../../common/generators/image-layers-generator.interface");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const performance_logger_1 = __importDefault(require("../../../utils/loggers/performance/performance.logger"));
const sharp_1 = require("../../../utils/processors/sharp");
const cache_constants_1 = require("../../../utils/managers/cache/cache.constants");
class ImageLayersRenderer {
    attributesGetter;
    tempRenderDir;
    imageProcessor;
    width;
    height;
    constructor(constructorProps) {
        this.width = constructorProps.width;
        this.height = constructorProps.height;
        this.imageProcessor =
            constructorProps.imageProcessor ?? new sharp_1.SharpImageProcessor();
    }
    async init(props) {
        this.attributesGetter = props.attributesGetter;
        this.tempRenderDir = path.join(props.cachePath, cache_constants_1.RENDERERS_TEMP_CACHE_DIR);
    }
    async render() {
        const renders = {};
        for (const [itemUid, attributes] of Object.entries(this.attributesGetter())) {
            const timerUid = performance_logger_1.default.trackTask("Image render", `Item ${itemUid}`);
            if (!fs.existsSync(this.tempRenderDir)) {
                fs.mkdirSync(this.tempRenderDir);
            }
            const supportedAssets = attributes
                .filter((attribute) => image_layers_generator_interface_1.IMAGE_LAYERS_GENERATOR_INTERFACE_V1 === attribute.kind)
                .reduce((mergedAttributes, newAttributes) => mergedAttributes.concat(newAttributes.data.assets), []);
            if (supportedAssets.length < 1) {
                throw new Error(`Couldn't find any supported set of attributes for the current item: ${itemUid}`);
            }
            //TODO Check timestamp
            let assets = supportedAssets.sort((a, b) => a.zOffset - b.zOffset);
            const outputPath = path.join(this.tempRenderDir, `${itemUid}.png`);
            await this.imageProcessor.createImageWithLayers({
                width: this.width,
                height: this.height,
                outputPath: outputPath,
                assets: assets,
            });
            const outputStats = fs.statSync(outputPath);
            renders[itemUid] = [
                {
                    kind: static_layered_images_renderer_interface_1.STATIC_LAYERED_IMAGES_RENDERER_INTERFACE_V1,
                    data: {
                        path: outputPath,
                    },
                },
            ];
            performance_logger_1.default.endTask(timerUid);
        }
        return renders;
    }
}
exports.ImageLayersRenderer = ImageLayersRenderer;
