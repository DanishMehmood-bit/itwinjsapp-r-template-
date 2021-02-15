import { Config } from '@bentley/bentleyjs-core';
import { FrontendRequestContext, IModelApp, IModelConnection } from '@bentley/imodeljs-frontend';
import { SignIn } from '@bentley/ui-components';
import React from 'react';
import { StarterApp } from '../api/StarterApp';
import OpeniModel from './OpeniModel';
import QueryBackendButton from './QuerybackendButton';

/** React state of the App component */
export interface AppState {
  user: {
    isAuthorized: boolean;
    isLoading: boolean;
  };
  queryResult?: string;
  iModel?: IModelConnection;
}

/** A component the renders the itwinjsapp-r UI */
export default class App extends React.Component<{}, AppState> {
  /** Creates an App instance */
  constructor(props?: any) {
    super(props);
    this.state = {
      user: {
        isAuthorized: StarterApp.oidcClient.isAuthorized,
        isLoading: false,
      },
    };
  }

  /**
   * Initialize authorization state, and add listener to changes
   */
  public componentDidMount() {
    StarterApp.oidcClient.onUserStateChanged.addListener(this._onUserStateChanged);
  }

  /**
   * unsubscribe from user state changes
   */
  public componentWillUnmount() {
    StarterApp.oidcClient.onUserStateChanged.removeListener(this._onUserStateChanged);
  }

  /**
   * If user states changes then set the state of user
   */
  private _onUserStateChanged = () => {
    this.setState((prev) => ({ user: { ...prev.user, isAuthorized: StarterApp.oidcClient.isAuthorized, isLoading: false } }));
  };

  /**
   * Splitting the redirectURI and returning it in parts
   */
  private get _signInRedirectUri() {
    const split = (Config.App.get("imjs_browser_test_redirect_uri") as string).split("://");
    return split[split.length - 1];
  }

  /**
   * If user is not signed in then start signing in procedure
   */
  private _onStartSignin = async () => {
    this.setState((prev) => ({ user: { ...prev.user, isLoading: true } }));
    StarterApp.oidcClient.signIn(new FrontendRequestContext());  // eslint-disable-line @typescript-eslint/no-floating-promises
  };

  /**
   * Sets the state to the response recieved from backend
   * @param queryResult result from backend 
   */
  private _queryResult = (queryResult: string) => {
    this.setState({ queryResult });
  }

  /**
   * Sets the state to the iModel if the iModel is opened
   * @param iModel opened iModel
   */
  private _openedIModel = (iModel: IModelConnection) => {
    this.setState({ iModel });
  }

  /** The component's render method */
  public render() {
    let ui: React.ReactNode;

    if (this.state.user.isLoading || window.location.href.includes(this._signInRedirectUri)) {
      // if user is currently being loaded, just tell that
      ui = IModelApp.i18n.translate("itwinjsapp:SigningIn");
    } else if (!this.state.user.isAuthorized) {
      // if user doesn't have and access token, show sign in page
      ui = (<SignIn onSignIn={this._onStartSignin} />);
    } else if(!this.state.iModel){
      // If we don't have the iModel opened yet then open it
      ui = <OpeniModel openedIModel = {this._openedIModel} />
    } else {
      //If iModel is opened then render the button
      ui = (
        <>
          <QueryBackendButton queryResult = {this._queryResult} iModel = {this.state.iModel}/>
          {this.state.queryResult}
        </>
      );
    }

    // render the app
    return (
      <div className="app">
        {ui}
      </div>
    );
  }
}

