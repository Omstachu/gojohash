import InputInterface, { InputInitPropsInterface } from "../../../common/inputs/input.interface";
import ImageLayersInputInterface from "../../../common/inputs/image-layers-input.interface";
export declare const EDGE_CASE_UID_SEPARATOR = "#";
export declare class ImageLayersInput implements InputInterface<ImageLayersInputInterface> {
    private assetsBasePath;
    constructor(constructorProps: {
        assetsBasePath: string;
    });
    init(props: InputInitPropsInterface): Promise<void>;
    load(): Promise<ImageLayersInputInterface>;
    private getParams;
    private getLayersFromFolders;
    private getOptions;
    private readDir;
}
//# sourceMappingURL=index.d.ts.map