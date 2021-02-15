import { Logger, LogLevel } from '@bentley/bentleyjs-core';
import React from 'react';
import ReactDOM from 'react-dom';
import { StarterApp } from './frontend/api/StarterApp';
import App from './frontend/components/App';
import './index.css';

// Setup logging immediately to pick up any logging during BasicViewportApp.startup()
Logger.initializeToConsole();
Logger.setLevelDefault(LogLevel.Warning); // Set all logging to a default of Warning
Logger.setLevel("itwinjsapp-r", LogLevel.Info); // Override the above default and set only App level logging to Info.

(async () => {  // eslint-disable-line @typescript-eslint/no-floating-promises
  // initialize the application
  await StarterApp.startup();

  // when initialization is complete, render
  ReactDOM.render(
    <App />,
    document.getElementById("root") as HTMLElement,
  );
})();
