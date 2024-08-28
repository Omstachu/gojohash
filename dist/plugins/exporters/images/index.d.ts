import ExporterInterface, { ExporterInitPropsInterface } from "../../../common/exporters/exporter.interface";
export declare class ImagesExporter implements ExporterInterface {
    private rendersGetter;
    private outputPath;
    private imagesFolder;
    private imagesPath;
    constructor(constructorProps?: {
        imagesFolder?: string;
    });
    init(props: ExporterInitPropsInterface): Promise<void>;
    export(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map