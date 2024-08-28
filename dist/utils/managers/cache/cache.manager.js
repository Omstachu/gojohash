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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const cache_constants_1 = require("./cache.constants");
class CacheManager {
    cachePath;
    seed;
    hashes;
    constructor(cachePath) {
        this.cachePath = cachePath;
        this.hashes = {
            inputs: {
                curr: this.generateCacheFileOrFolderHash(cache_constants_1.INPUTS_CACHE_FILE),
                prev: "",
            },
            generators: {
                curr: this.generateCacheFileOrFolderHash(cache_constants_1.GENERATORS_CACHE_FILE),
                prev: "",
            },
            renderers: {
                curr: this.generateCacheFileOrFolderHash(cache_constants_1.RENDERERS_CACHE_FILE),
                prev: "",
            },
            renderers_temp: {
                curr: this.generateCacheFileOrFolderHash(cache_constants_1.RENDERERS_TEMP_CACHE_DIR),
                prev: "",
            },
        };
        this.loadCacheHashes();
    }
    init() {
        if (this.seed !== undefined) {
            return;
        }
        if (!fs.existsSync(this.cachePath)) {
            fs.mkdirSync(this.cachePath);
        }
        const seedFilePath = this.getCachePath(cache_constants_1.SEED_CACHE_FILE);
        if (fs.existsSync(seedFilePath)) {
            this.seed = JSON.parse(fs.readFileSync(seedFilePath).toString()).seed;
            return;
        }
        const newSeed = crypto.randomBytes(128).toString("hex");
        const seedFileDir = path.dirname(seedFilePath);
        fs.mkdirSync(seedFileDir, { recursive: true });
        fs.writeFileSync(seedFilePath, JSON.stringify({ seed: newSeed }, null, 2));
        this.seed = newSeed;
    }
    loadCacheHashes() {
        let prevCachePath = this.getCachePath(cache_constants_1.PREV_HASHES_CACHE_FILE);
        if (fs.existsSync(prevCachePath)) {
            const prevHashes = JSON.parse(fs.readFileSync(prevCachePath).toString());
            this.hashes.inputs.prev = prevHashes.inputs?.curr;
            this.hashes.generators.prev = prevHashes.generators?.curr;
            this.hashes.renderers.prev = prevHashes.renderers?.curr;
            this.hashes.renderers_temp.prev = prevHashes.renderers_temp?.curr;
        }
    }
    syncCacheHashes() {
        for (const key in this.hashes) {
            this.hashes[key].prev = this.hashes[key].curr;
        }
    }
    generateCacheFileOrFolderHash(relativePath) {
        let fileOrFolderPath = path.join(this.cachePath, relativePath);
        return this.computeFileOrFolderHash(fileOrFolderPath);
    }
    getCachePath(relativePath) {
        return path.join(this.cachePath, relativePath);
    }
    updateCurrCacheHashAtKey(key, hash) {
        this.hashes[key].curr = hash;
    }
    saveDataToCacheFile(relativePath, data) {
        fs.writeFileSync(this.getCachePath(relativePath), JSON.stringify(data, null, 2));
    }
    computeDataHash(data) {
        const hash = crypto.createHash("sha256");
        hash.update(JSON.stringify(data));
        return hash.digest("hex");
    }
    computeFileHash(filePath) {
        const fileData = fs.readFileSync(filePath);
        const hash = crypto.createHash("sha256");
        hash.update(fileData);
        return hash.digest("hex");
    }
    computeFileOrFolderHash(folderPath) {
        const hash = crypto.createHash("sha256");
        const computeHash = (filePath) => {
            if (!fs.existsSync(filePath)) {
                return "no cache";
            }
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                const fileHash = this.computeFileHash(filePath);
                hash.update(fileHash);
            }
            else if (stats.isDirectory()) {
                const files = fs.readdirSync(filePath);
                files.forEach((file) => {
                    const nestedFilePath = path.join(filePath, file);
                    computeHash(nestedFilePath);
                });
            }
        };
        computeHash(folderPath);
        return hash.digest("hex");
    }
    getDataFromCache(relativePath) {
        let cachePath = this.getCachePath(relativePath);
        if (fs.existsSync(cachePath)) {
            return JSON.parse(fs.readFileSync(cachePath).toString());
        }
    }
}
exports.default = CacheManager;
