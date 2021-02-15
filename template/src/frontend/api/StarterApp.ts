/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { ClientRequestContext, Config } from "@bentley/bentleyjs-core";
import { BrowserAuthorizationCallbackHandler, BrowserAuthorizationClient, BrowserAuthorizationClientConfiguration } from "@bentley/frontend-authorization-client";
import { BentleyCloudRpcManager } from "@bentley/imodeljs-common";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { UiComponents } from "@bentley/ui-components";
import { getSupportedRpcs } from "../../common/rpcs";

// Boiler plate code
export class StarterApp {

  public static get oidcClient() { return IModelApp.authorizationClient as BrowserAuthorizationClient; }

  public static async startup() {
    await IModelApp.startup({ applicationVersion: "1.0.0" });

    // initialize OIDC
    await StarterApp.initializeOidc();

    // contains various initialization promises which need
    // to be fulfilled before the app is ready
    const initPromises = new Array<Promise<any>>();

    // initialize RPC communication
    initPromises.push(StarterApp.initializeRpc());

    // initialize localization for the app
    initPromises.push(IModelApp.i18n.registerNamespace("itwinjsapp").readFinished);

    // initialize UiComponents
    initPromises.push(UiComponents.initialize(IModelApp.i18n));

    // the app is ready when all initialization promises are fulfilled
    await Promise.all(initPromises);
  }

  private static async initializeRpc(): Promise<void> {
    //Getting the rpc interfaces
    const rpcInterfaces = getSupportedRpcs();
    
    // Initialize the local backend
    let rpcParams = { info: { title: "BasicInterface", version: "1.0.0" }, uriPrefix: "http://localhost:3001" };
    BentleyCloudRpcManager.initializeClient(rpcParams, rpcInterfaces);
  }

  private static async initializeOidc() {
    const clientId = Config.App.getString("imjs_browser_test_client_id");
    const redirectUri = Config.App.getString("imjs_browser_test_redirect_uri");
    const scope = Config.App.getString("imjs_browser_test_scope");
    const responseType = "code";
    const oidcConfig: BrowserAuthorizationClientConfiguration = { clientId, redirectUri, scope, responseType };

    await BrowserAuthorizationCallbackHandler.handleSigninCallback(oidcConfig.redirectUri);
    IModelApp.authorizationClient = new BrowserAuthorizationClient(oidcConfig);

    try {
      await StarterApp.oidcClient.signInSilent(new ClientRequestContext());
    } catch (err) { }
  }
}
