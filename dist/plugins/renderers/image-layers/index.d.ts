import RendererInterface, { ItemsRenders, RendererInitPropsInterface } from "../../../common/renderers/renderer.interface";
import StaticLayeredImagesRendererInterface from "../../../common/renderers/static-layered-images-renderer.interface";
import ImageProcessorInterface from "../../../common/processors/image-processor.interface";
export declare class ImageLayersRenderer implements RendererInterface<StaticLayeredImagesRendererInterface> {
    private attributesGetter;
    private tempRenderDir;
    private imageProcessor;
    private width;
    private height;
    constructor(constructorProps: {
        width: number;
        height: number;
        imageProcessor?: ImageProcessorInterface;
    });
    init(props: RendererInitPropsInterface): Promise<void>;
    render(): Promise<ItemsRenders<StaticLayeredImagesRendererInterface>>;
}
//# sourceMappingURL=index.d.ts.map