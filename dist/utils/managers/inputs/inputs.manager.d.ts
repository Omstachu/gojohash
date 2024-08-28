import InputInterface from "../../../common/inputs/input.interface";
type InputDataType = Awaited<ReturnType<InputInterface<any>["load"]>>;
export default class InputsManager {
    private isReadOnlyMode;
    private inputsData;
    constructor();
    freeze(): {
        [key: string]: InputDataType;
    };
    get(key: string): InputDataType;
    set(key: string, data: InputDataType): void;
}
export {};
//# sourceMappingURL=inputs.manager.d.ts.map