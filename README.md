#IoT Node.js Application


The [docs folder](docs/index.md) contains detailed documentation on how to extend the generated code, for example: how to listen to device events or respond to HTTP requests.
 

File structure (selected files and folders)


* app.js: Express application initialization

* package.json: npm packages handling (see: https://docs.npmjs.com/files/package.json)

* main.js: A stub file loaded after server is running (for user code)

* _debug.js: Edit this file to configure debug environment for local execution

* manifest.yml: Manifest for cloudfoundry/Bluemix deployment

* public: statically served files to client

* views: ejs page templates (see: http://www.embeddedjs.com/)

* routes: HTTP routers generated from IoT-Workbench (see: http://expressjs.com/en/guide/routing.html)

* watsonIoT: IBM Watson IoT platform client, see usage below

* workbenchLib: Library elements generated from IoT-Workbench. 
	