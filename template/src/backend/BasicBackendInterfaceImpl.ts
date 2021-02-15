import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { IModelDb } from "@bentley/imodeljs-backend";
import { IModelRpcProps, RpcInterface } from "@bentley/imodeljs-common";
import { BasicBackendInterface } from "../common/BasicBackendInterface";

export class BasicBackendInterfaceImpl extends RpcInterface implements BasicBackendInterface {
    /**
     * Returns the name of the imodel
     * @param _iModelToken RPC props associated with iModel
     */
    public async getIModelName(_iModelToken: IModelRpcProps): Promise<string>{
        const iModelDb: IModelDb = IModelDb.findByKey(_iModelToken.key);
        return `iModel Name: ${iModelDb.name}`;
    }
}