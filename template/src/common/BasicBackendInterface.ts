import { IModelRpcProps, RpcInterface, RpcManager } from "@bentley/imodeljs-common";

export abstract class BasicBackendInterface extends RpcInterface {
    public static readonly interfaceName = "BasicBackendInterface"; // The immutable name of the interface
    public static interfaceVersion = "1.0.0";  // The API version of the interface
    public static getClient() { return RpcManager.getClientForInterface(this); }
    public async getIModelName(_iModelToken: IModelRpcProps): Promise<string> { return this.forward(arguments) }
}