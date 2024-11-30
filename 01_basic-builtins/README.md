# 01 Basic Built Ins
Node basics sync and async programming dealing with packages ( built-ins mainly )
and tiers ( external ) showing how to work with.

```txt
Folder structure & covered topics 

|__01_sync_async: practice node with sync and async
|__02_server: practice http server and routing
|__03_project: practice http server, routing and templates
```

Starting to work with node involves the terminal.
The terminal in Node is a REPL:
- a `REPL`: read eval print loop 

Workflow:
in terminal:
- `node` will spawn a REPL
- in `REPL` commands and tools:
	- `ctrl + c` kill the REPL
	- `tab`: displays all node available features


## 01 sync and async
Acknowledging sync and sync concepts allowing to identify which should be used
- sync -> blocking event
- async -> non blocking event -> using callbacks

## 02 server
- using `http` built in function
- note server can host thousands of user: need to be careful
on when to use sync and when to use async programming to avoid
impacting the user experience and / or crash app.


## 03 Project - Node Farm
- Using http to create a server and routing
- using templates file to render
	- reading them ( using sync/async prog )
	- injecting data ( custom template render )
	- using tiers package ( how to install packages )


Continuation on:
- writing some js code
- requiring module ( built-in fs )
- program read / write from and to file ( sync async )
- async (blocking) and synchronous (non-blocking) 
	Node being single threaded, blocking code - could impact other users.
	If a process gets too long for user1's request -> all other users
	would wait until it finishes --> this is why it is preferable to use asynchronous

	Non blocking model: callback model present in node due to load process delegation,  
	which is ran in the background and when ready, it call the callback to hook back to the main thread

	--> Callback hell: nested callbacks
	Solutions:
		- ES6 Promises to use
		- or ES8 async await

	- When deciding to deal with sync and async:
	Make sure to know in which scope the code is executed.
	Example:
	- server serving route api - reads the data file in order to provide a response content
		- if it is readFileSync and within the server - this indeed would block the server
		- if it is readFileSync and outside the server: not an issue - it is loaded once then served ( alike cache )

### Practice - Node Farm
*server and templates*

Using http and fs built-in modules: 
- create a server
- align templates with data - js should handle the data "injection"  
- serve templates for each routes
	- overview 
	- unique product
the templates
Acknowledge existing content ( data, html files )
[ http, fs, template, sync, async, module ]

- materials: 
```txt
|___ /dev-data
	|___ data.json
|___ templates
	|___ overview.html
	|___ product.html

```


### Adding tiers library
- involves a package manager ( npm, pnpm, yarn, ...)
- packages versioning: `xx.xx.xx`
	- first `xx`: represents major release that can have breaking changes
	- second `xx`: represents minor release --> new features
	- third `xx`: represents patch releases --> packages fixtures
- install a specific version to project
	```shell
	npm install <package>@<xx.xx.xx>
	pnpm add install <package>@<xx.xx.xx>
	yarn add install <package>@<xx.xx.xx>
	```
- checking updates of packages 
	```npm outdated```
- package.json: stores packaged installed
- deleting a package from project
	```npm uninstall <package-name>```


### Project
