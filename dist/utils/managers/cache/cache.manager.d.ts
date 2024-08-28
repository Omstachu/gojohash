type HashType = {
    curr: string;
    prev: string;
};
export default class CacheManager {
    private cachePath;
    seed: string;
    hashes: {
        [key: string]: HashType;
    };
    constructor(cachePath: string);
    init(): void;
    private loadCacheHashes;
    syncCacheHashes(): void;
    generateCacheFileOrFolderHash(relativePath: string): string;
    getCachePath(relativePath: string): string;
    updateCurrCacheHashAtKey(key: string, hash: string): void;
    saveDataToCacheFile(relativePath: string, data: any): void;
    computeDataHash(data: any): string;
    private computeFileHash;
    private computeFileOrFolderHash;
    getDataFromCache(relativePath: string): any;
}
export {};
//# sourceMappingURL=cache.manager.d.ts.map