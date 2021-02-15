# iModel.js Starter

An iModel.js sample application that demonstrates:
* Getting Authorization
* Openning iModel
* Creating an rpc interface
* Communicating with backend and returning data.

This app serves as a guide on how one can start using iModel.js and get the basics done which leads them to start implementing their own components.

See http://imodeljs.org for comprehensive documentation on the iModel.js API and the various constructs used in this sample.

## Prerequisites

* [Git](https://git-scm.com/)
* [Node](https://nodejs.org/en/): an installation of the latest security patch of Node 10 or 12. The Node installation also includes the **npm** package manager.
* [TypeScript](https://www.typescriptlang.org/): this is listed as a devDependency, so if you're building it from source, you will get it with `npm install`.
* [Visual Studio Code](https://code.visualstudio.com/): an optional dependency, but the repository structure is optimized for its use

> See [supported platforms](https://www.imodeljs.org/learning/supportedplatforms/) for further information.


## Development Setup

1. Register a sample project at (https://www.connect-bentley.com) and create a iModel within it.

2. Edit the `.env.local` file with your created project name and iModel name.

3. Run the command `npm run build` to build the app.

4. Run the command `npm run start` to start both the backend and frontend.

5. Happy Coding :)