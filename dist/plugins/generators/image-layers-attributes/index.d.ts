import GeneratorInterface, { GeneratorInitPropsInterface, ItemsAttributes } from "../../../common/generators/generator.interface";
import ImageLayersGeneratorInterface from "../../../common/generators/image-layers-generator.interface";
import AttributesGeneratorInterface from "../../../common/generators/item-attributes-generator.interface";
type GeneratorOutput = ImageLayersGeneratorInterface | AttributesGeneratorInterface;
export declare class ImageLayersAttributesGenerator implements GeneratorInterface<GeneratorOutput> {
    private inputsManager;
    private dataSet;
    private data;
    private startIndex;
    private endIndex;
    private rmg;
    constructor(constructorProps: {
        dataSet: string;
        startIndex: number;
        endIndex: number;
    });
    init(props: GeneratorInitPropsInterface): Promise<void>;
    generate(): Promise<ItemsAttributes<GeneratorOutput>>;
    private calculateDna;
    private selectRandomItemByWeight;
}
export {};
//# sourceMappingURL=index.d.ts.map