import InputInterface from "./common/inputs/input.interface";
import GeneratorInterface from "./common/generators/generator.interface";
import RendererInterface from "./common/renderers/renderer.interface";
import ExporterInterface from "./common/exporters/exporter.interface";
type Config = {
    inputs: {
        [key: string]: InputInterface<any>;
    };
    generators: GeneratorInterface<any>[];
    renderers: RendererInterface<any>[];
    exporters: ExporterInterface[];
    cachePath: string;
    outputPath: string;
    useCache: boolean;
};
export default class ArtEngine {
    private config;
    private cacheManager;
    private inputsManager;
    private itemsDataManager;
    private prevConfig;
    private currConfig;
    constructor(config: Config);
    private load;
    private generate;
    private render;
    private export;
    run(): Promise<void>;
    printPerformance(): void;
}
export {};
//# sourceMappingURL=art-engine.d.ts.map