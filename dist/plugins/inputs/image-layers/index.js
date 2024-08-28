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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageLayersInput = exports.EDGE_CASE_UID_SEPARATOR = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
exports.EDGE_CASE_UID_SEPARATOR = "#";
class ImageLayersInput {
    assetsBasePath;
    constructor(constructorProps) {
        this.assetsBasePath = constructorProps.assetsBasePath;
    }
    async init(props) { }
    async load() {
        let layers = this.getLayersFromFolders(this.assetsBasePath);
        return { basePath: this.assetsBasePath, layers: layers };
    }
    getParams(fileName) {
        const [name, ...rawParamsArray] = fileName.split(".")[0].split("__");
        const rawParamsMap = new Map();
        for (const param of rawParamsArray) {
            const type = param.charAt(0);
            const value = param.slice(1);
            rawParamsMap.set(type, value);
        }
        const rawWeight = rawParamsMap.get("w");
        const normalizedParams = {
            name: name,
            x: parseInt(rawParamsMap.get("x") ?? "0"),
            y: parseInt(rawParamsMap.get("y") ?? "0"),
            z: parseInt(rawParamsMap.get("z") ?? "0"),
            w: rawWeight === undefined ? undefined : parseInt(rawWeight),
            t: rawParamsMap.get("t"),
            v: rawParamsMap.get("v"),
        };
        if (!Number.isFinite(normalizedParams.x)) {
            throw new Error(`Invalid X offset value "${normalizedParams.x}" found in "${fileName}".`);
        }
        if (!Number.isFinite(normalizedParams.y)) {
            throw new Error(`Invalid Y offset value "${normalizedParams.y}" found in "${fileName}".`);
        }
        if (!Number.isFinite(normalizedParams.z)) {
            throw new Error(`Invalid Z offset value "${normalizedParams.z}" found in "${fileName}".`);
        }
        if (normalizedParams.w !== undefined &&
            (!Number.isFinite(normalizedParams.w) || normalizedParams.w <= 0)) {
            throw new Error(`Invalid weight value "${normalizedParams.w}" found in "${fileName}".`);
        }
        return normalizedParams;
    }
    getLayersFromFolders(dir) {
        const layers = {};
        this.readDir(dir).forEach((fileName) => {
            const currentFilePath = path.join(dir, fileName);
            if (!fs.statSync(currentFilePath).isDirectory()) {
                return;
            }
            const params = this.getParams(fileName);
            layers[params.name] = {
                name: params.name,
                baseXOffset: params.x,
                baseYOffset: params.y,
                baseZOffset: params.z,
                options: this.getOptions(currentFilePath, fileName),
            };
        });
        return layers;
    }
    getOptions(dir, layerName) {
        const options = {};
        for (const fileName of this.readDir(dir)) {
            const currentFilePath = path.join(dir, fileName);
            if (!fs.statSync(currentFilePath).isFile()) {
                continue;
            }
            const params = this.getParams(fileName);
            const filePath = path.join(dir, fileName);
            const stats = fs.statSync(filePath);
            if (options[params.name] === undefined) {
                options[params.name] = {
                    name: params.name,
                    weight: 1,
                    assets: [],
                    edgeCases: {},
                };
            }
            if (params.w !== undefined) {
                // TODO: Distinguish between default values and explicit ones...
                if (options[params.name].weight !== 1) {
                    throw new Error(`You can specify the weight on a group of options only once: "${params.name}" (${layerName})`);
                }
                options[params.name].weight = params.w;
            }
            options[params.name].assets.push({
                path: path.join(layerName, fileName),
                relativeXOffset: params.x,
                relativeYOffset: params.y,
                relativeZOffset: params.z,
                lastModifiedTime: stats.mtime.getTime(),
                size: stats.size,
            });
        }
        if (Object.keys(options).length < 1) {
            throw new Error(`Could not find any options for the current layer: "${layerName}"`);
        }
        // Process edge-cases
        const edgeCasesPath = path.join(dir, "edge-cases");
        if (fs.existsSync(edgeCasesPath)) {
            for (const fileName of this.readDir(edgeCasesPath)) {
                const currentFilePath = path.join(edgeCasesPath, fileName);
                if (!fs.statSync(currentFilePath).isFile()) {
                    continue;
                }
                const params = this.getParams(fileName);
                const stats = fs.statSync(currentFilePath);
                const edgeCaseUid = `${params.t}${exports.EDGE_CASE_UID_SEPARATOR}${params.v}`;
                if (options[params.name].edgeCases[edgeCaseUid] === undefined) {
                    options[params.name].edgeCases[edgeCaseUid] = {
                        matchingTrait: params.t ?? "",
                        matchingValue: params.v ?? "",
                        assets: [],
                    };
                }
                options[params.name].edgeCases[edgeCaseUid].assets.push({
                    path: path.join(layerName, "edge-cases", fileName),
                    relativeXOffset: params.x,
                    relativeYOffset: params.y,
                    relativeZOffset: params.z,
                    lastModifiedTime: stats.mtime.getTime(),
                    size: stats.size,
                });
            }
        }
        return options;
    }
    readDir(dir) {
        return fs.readdirSync(dir).filter((item) => !/(^|\/)\.[^\/\.]/g.test(item));
    }
}
exports.ImageLayersInput = ImageLayersInput;
