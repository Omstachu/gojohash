import ImageProcessorInterface from "../../../common/processors/image-processor.interface";
export declare class SharpImageProcessor implements ImageProcessorInterface {
    createImageWithLayers(createImageWithLayersProps: {
        width: number;
        height: number;
        outputPath: string;
        assets: {
            path: string;
            xOffset: number;
            yOffset: number;
            zOffset: number;
        }[];
    }): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map