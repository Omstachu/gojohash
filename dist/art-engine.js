"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inputs_manager_1 = __importDefault(require("./utils/managers/inputs/inputs.manager"));
const items_data_manager_1 = __importDefault(require("./utils/managers/items-data/items-data.manager"));
const performance_logger_1 = __importDefault(require("./utils/loggers/performance/performance.logger"));
const hero_logger_1 = __importDefault(require("./utils/loggers/hero/hero.logger"));
const cache_manager_1 = __importDefault(require("./utils/managers/cache/cache.manager"));
const cache_constants_1 = require("./utils/managers/cache/cache.constants");
performance_logger_1.default.enable();
hero_logger_1.default.enable();
class ArtEngine {
    config;
    cacheManager;
    inputsManager;
    itemsDataManager;
    prevConfig;
    currConfig;
    constructor(config) {
        this.config = { ...config };
        this.inputsManager = new inputs_manager_1.default();
        this.itemsDataManager = new items_data_manager_1.default();
        this.cacheManager = new cache_manager_1.default(this.config.cachePath);
        hero_logger_1.default.printHero();
        this.cacheManager.init();
        this.prevConfig = this.cacheManager.getDataFromCache(cache_constants_1.CONFIG_CACHE_FILE);
        this.cacheManager.saveDataToCacheFile(cache_constants_1.CONFIG_CACHE_FILE, this.config);
        this.currConfig = this.cacheManager.getDataFromCache(cache_constants_1.CONFIG_CACHE_FILE);
        console.log(this.cacheManager.hashes);
    }
    async load() {
        const timerUid = performance_logger_1.default.trackTask("Loading inputs");
        const cachedData = this.cacheManager.getDataFromCache(cache_constants_1.INPUTS_CACHE_FILE);
        const cacheHashes = this.cacheManager.hashes;
        for (const key in this.config.inputs) {
            const input = this.config.inputs[key];
            if (this.config.useCache &&
                cachedData &&
                this.cacheManager.computeDataHash(this.currConfig?.inputs) ===
                    this.cacheManager.computeDataHash(this.prevConfig?.inputs) &&
                cacheHashes.inputs.curr === cacheHashes.inputs.prev) {
                console.log("Loading from cache...");
                this.inputsManager.set(key, cachedData[key]);
            }
            else {
                console.log("Loading...");
                await input.init({ seed: this.cacheManager.seed });
                this.inputsManager.set(key, await input.load());
            }
        }
        const frozenInputsData = this.inputsManager.freeze();
        this.cacheManager.saveDataToCacheFile(cache_constants_1.INPUTS_CACHE_FILE, frozenInputsData);
        const currInputHash = this.cacheManager.generateCacheFileOrFolderHash(cache_constants_1.INPUTS_CACHE_FILE);
        this.cacheManager.updateCurrCacheHashAtKey("inputs", currInputHash);
        performance_logger_1.default.endTask(timerUid);
    }
    async generate() {
        const timerUid = performance_logger_1.default.trackTask("Generating");
        const cachedData = this.cacheManager.getDataFromCache(cache_constants_1.GENERATORS_CACHE_FILE);
        const cacheHashes = this.cacheManager.hashes;
        for (const generator of this.config.generators) {
            if (this.config.useCache &&
                cachedData &&
                this.cacheManager.computeDataHash(this.currConfig?.generators) ===
                    this.cacheManager.computeDataHash(this.prevConfig?.generators) &&
                cacheHashes.inputs.curr === cacheHashes.inputs.prev &&
                cacheHashes.generators.curr === cacheHashes.generators.prev) {
                console.log("Generating from cache...");
                this.itemsDataManager.addManyAttributes(cachedData);
            }
            else {
                console.log("Generating...");
                await generator.init({
                    seed: this.cacheManager.seed,
                    inputsManager: this.inputsManager,
                });
                const itemsAttributes = await generator.generate();
                for (const itemUid in itemsAttributes) {
                    this.itemsDataManager.addAttributes(itemUid, itemsAttributes[itemUid]);
                }
            }
        }
        const frozenAttributesData = this.itemsDataManager.freezeAttributes();
        this.cacheManager.saveDataToCacheFile(cache_constants_1.GENERATORS_CACHE_FILE, frozenAttributesData);
        const currHash = this.cacheManager.generateCacheFileOrFolderHash(cache_constants_1.GENERATORS_CACHE_FILE);
        this.cacheManager.updateCurrCacheHashAtKey("generators", currHash);
        performance_logger_1.default.endTask(timerUid);
    }
    async render() {
        const timerUid = performance_logger_1.default.trackTask("Rendering");
        const cachedData = this.cacheManager.getDataFromCache(cache_constants_1.RENDERERS_CACHE_FILE);
        const cacheHashes = this.cacheManager.hashes;
        for (const renderer of this.config.renderers) {
            if (this.config.useCache &&
                cachedData &&
                this.cacheManager.computeDataHash(this.currConfig?.renderers) ===
                    this.cacheManager.computeDataHash(this.prevConfig?.renderers) &&
                cacheHashes.generators.curr === cacheHashes.generators.prev &&
                cacheHashes.renderers.curr === cacheHashes.renderers.prev &&
                cacheHashes.renderers_temp.curr === cacheHashes.renderers_temp.prev) {
                console.log("Rendering from cache...");
                this.itemsDataManager.addManyRenders(cachedData);
            }
            else {
                console.log("Rendering...");
                await renderer.init({
                    seed: this.cacheManager.seed,
                    cachePath: this.config.cachePath,
                    attributesGetter: () => this.itemsDataManager.getAttributes(),
                });
                const itemsRenders = await renderer.render();
                for (const itemUid in itemsRenders) {
                    this.itemsDataManager.addRenders(itemUid, itemsRenders[itemUid]);
                }
            }
        }
        const frozenRendersData = this.itemsDataManager.freezeRenders();
        this.cacheManager.saveDataToCacheFile(cache_constants_1.RENDERERS_CACHE_FILE, frozenRendersData);
        const currHash = this.cacheManager.generateCacheFileOrFolderHash(cache_constants_1.RENDERERS_CACHE_FILE);
        const currTempHash = this.cacheManager.generateCacheFileOrFolderHash(cache_constants_1.RENDERERS_TEMP_CACHE_DIR);
        this.cacheManager.updateCurrCacheHashAtKey("renderers", currHash);
        this.cacheManager.updateCurrCacheHashAtKey("renderers_temp", currTempHash);
        performance_logger_1.default.endTask(timerUid);
    }
    async export() {
        const timerUid = performance_logger_1.default.trackTask("Exporting");
        for (const exporter of this.config.exporters) {
            console.log("Exporting...");
            await exporter.init({
                seed: this.cacheManager.seed,
                outputPath: this.config.outputPath,
                rendersGetter: () => this.itemsDataManager.getRenders(),
            });
            await exporter.export();
        }
        performance_logger_1.default.endTask(timerUid);
    }
    async run() {
        await this.load();
        await this.generate();
        await this.render();
        await this.export();
        this.cacheManager.syncCacheHashes();
        this.cacheManager.saveDataToCacheFile(cache_constants_1.PREV_HASHES_CACHE_FILE, this.cacheManager.hashes);
        console.log("Done");
    }
    printPerformance() {
        performance_logger_1.default.printRecap();
        performance_logger_1.default.printIncompleteTasks();
    }
}
exports.default = ArtEngine;
