import ExporterInterface, { ExporterInitPropsInterface } from "../../../common/exporters/exporter.interface";
export declare class SolMetadataExporter implements ExporterInterface {
    private rendersGetter;
    private outputPath;
    private metadataFolder;
    private metadataPath;
    private symbol;
    private sellerFeeBasisPoints;
    private collectionName;
    private collectionFamily;
    private imageUriPrefix;
    private creators;
    constructor(constructorProps?: {
        metadataFolder?: string;
        symbol?: string;
        sellerFeeBasisPoints?: number;
        collectionName?: string;
        collectionFamily?: string;
        imageUriPrefix?: string;
        creators?: {
            address: string;
            share: number;
        }[];
    });
    init(props: ExporterInitPropsInterface): Promise<void>;
    export(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map