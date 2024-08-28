import ExporterInterface, { ExporterInitPropsInterface } from "../../../common/exporters/exporter.interface";
export declare class Erc721MetadataExporter implements ExporterInterface {
    private rendersGetter;
    private outputPath;
    private metadataFolder;
    private metadataPath;
    private imageUriPrefix;
    constructor(constructorProps?: {
        metadataFolder?: string;
        imageUriPrefix?: string;
    });
    init(props: ExporterInitPropsInterface): Promise<void>;
    export(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map