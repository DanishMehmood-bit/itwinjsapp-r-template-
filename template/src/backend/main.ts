/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { Logger, LogLevel } from "@bentley/bentleyjs-core";
import { IModelJsExpressServer } from "@bentley/express-server";
import { IModelHost } from "@bentley/imodeljs-backend";
import { BentleyCloudRpcManager, RpcManager } from "@bentley/imodeljs-common";
import { getSupportedRpcs } from "../common/rpcs";
import { Presentation } from "@bentley/presentation-backend";
import { BasicBackendInterface } from "../common/BasicBackendInterface";
import { BasicBackendInterfaceImpl } from "./BasicBackendInterfaceImpl";

// Setup logging immediately to pick up any logging during IModelHost.startup()
Logger.initializeToConsole();
Logger.setLevelDefault(LogLevel.Warning);
Logger.setLevel("basic-viewport-app", LogLevel.Info);

(async () => {  // eslint-disable-line @typescript-eslint/no-floating-promises
  try {
    // Initialize iModelHost
    await IModelHost.startup();

    // Initialize Presentation
    Presentation.initialize();

    // Get RPCs supported by this backend
    const rpcs = getSupportedRpcs();

    //Registering Basic RPC Interface
    RpcManager.registerImpl(BasicBackendInterface, BasicBackendInterfaceImpl);

    // Setup the RPC interfaces and the backend metadata with the BentleyCloudRpcManager
    const rpcConfig = BentleyCloudRpcManager.initializeImpl({ info: { title: "BasicBackendInterface", version: "1.0.0" } }, rpcs);

    // Initialize Web Server backend
    const port = Number(process.env.PORT || 3001);
    const server = new IModelJsExpressServer(rpcConfig.protocol);
    await server.initialize(port);
    Logger.logInfo("basic-viewport-app", `RPC backend for basic-viewport-app listening on port ${port}`);
  } catch (error) {
    Logger.logError("basic-viewport-app", error);
    process.exitCode = 1;
  }

})();