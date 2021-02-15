import { IModelApp, IModelConnection } from "@bentley/imodeljs-frontend";
import { Button, ButtonSize, ButtonType, Spinner, SpinnerSize } from "@bentley/ui-core";
import React from "react";
import { BasicBackendInterface } from "../../common/BasicBackendInterface";

/** React props for [QueryBackendButton] */
interface QueryBackendButtonProps {
    queryResult: (response: string) => void;
    iModel: IModelConnection;
}

export default class QueryBackendButton extends React.PureComponent<QueryBackendButtonProps> {
    public state = { isLoading: false };

    //Method invokes when click on QueryBackend button
    private _onClick = async () => {
        this.setState({ isLoading: true });

        const backendResponse = await BasicBackendInterface.getClient().getIModelName(this.props.iModel.getRpcProps());
        this.props.queryResult(backendResponse);
        this.setState({ isLoading: false });
    }

    /** Rendering Query Backend button */
    public render() {
        return (
        <div>
            <Button size={ButtonSize.Large} buttonType={ButtonType.Primary} className="button-open-imodel" onClick={this._onClick}>
            <span>{IModelApp.i18n.translate("itwinjsapp:Buttons.QueryBackend")}</span>
            {this.state.isLoading ? <span style={{ marginLeft: "8px" }}><Spinner size={SpinnerSize.Small} /></span> : undefined}
            </Button>
        </div>
        );
    }
}

