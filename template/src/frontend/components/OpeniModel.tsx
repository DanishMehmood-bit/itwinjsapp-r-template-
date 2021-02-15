import { Config, OpenMode } from "@bentley/bentleyjs-core";
import { ContextRegistryClient, Project } from "@bentley/context-registry-client";
import { IModelQuery } from "@bentley/imodelhub-client";
import { AuthorizedFrontendRequestContext, IModelApp, IModelConnection, RemoteBriefcaseConnection } from "@bentley/imodeljs-frontend";
import { Spinner, SpinnerSize } from "@bentley/ui-core";
import React from "react";

/** React props for [openIModel] */
interface openIModelProps {
    openedIModel: (iModel: IModelConnection) => void;
}
  
// Class responsible for downloading and opening of iModel
export default class OpeniModel extends React.Component<openIModelProps> {
    public state = { isLoading: true };

    // When component mounts download and open the iModel
    componentDidMount = () => {
        this._downloadAndOpenIModel();
    }

    // Downloading and opening iModel using the name provided in .env.local
    private _downloadAndOpenIModel = async () => {
        const projectName = Config.App.get("imjs_test_project");
        const iModelName = Config.App.get("imjs_test_imodel");

        const requestContext: AuthorizedFrontendRequestContext = await AuthorizedFrontendRequestContext.create();

        const connectClient = new ContextRegistryClient();
        let project: Project;
        
        // Getting connect project using name provided
        try {
            project = await connectClient.getProject(requestContext, { $filter: `Name+eq+'${projectName}'` });
        } catch (e) {
            throw new Error(`Project with name "${projectName}" does not exist`);
        }

        // Getting iModel using the name provided
        const imodelQuery = new IModelQuery();
        imodelQuery.byName(iModelName);
        const imodels = await IModelApp.iModelClient.iModels.get(requestContext, project.wsgId, imodelQuery);
        
        // If we didn't find any iModels inside our CONNECT project
        if (imodels.length === 0)
        throw new Error(`iModel with name "${iModelName}" does not exist in project "${projectName}"`);

        // Downloading and opening iModel
        const openedIModel = await RemoteBriefcaseConnection.open(project.wsgId, imodels[0].wsgId, OpenMode.Readonly);
        this.props.openedIModel(openedIModel);

        // Stopping spinner animation
        this.setState({ isLoading: false });
    }

    // Rendering the spinner and text when downloading and opening the iModel
    public render() {
        return(
        <div className = "SpinnerAndText"> 
            <span>{this.state.isLoading ? <Spinner size={SpinnerSize.Medium} /> : undefined}</span>
            <br></br>
            <span>{IModelApp.i18n.translate("itwinjsapp:AppStarting.Status")}</span>
        </div>
        );
    }
}