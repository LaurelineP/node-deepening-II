# MEN
MongoDB Express Node

## Resources
- [Slides](https://github.com/jonasschmedtmann/complete-node-bootcamp/blob/master/theory-lectures.pdf)
- [Materials](https://github.com/jonasschmedtmann/complete-node-bootcamp)

## Install playwright 
Personal needs:
- practice playwright on any web page / app
- during refacto, having an early feedbacks on 
breaking changes to iterate right away

## Issue with playwright
pn exec playwright test "./01/tests/example.spec.js"

will work on v22 of node / and should use command pn:
need to install if needed once the node version is changed


<details>
	<summary>📌 NODE AND NPM</summary>

[✏️ Need to update this Readme Section?](./00_node-and-npm/README.md)

# Node and NPM
JS is in the backend ( node ) and frontend ( browsers )
## Introduction
### What
Runtime for JS development on backend ( embedding V8 )

### Why
- great for web
- single thread based on event driven,non blocking I/O model

### When
Good for:
- API & DB behind it ( preferably NoSQL)
- data streaming ( video streaming )
- real time chat app
- server side web app
- writing same code for backend and frontend
- npm : packages for node
- widely used ( big community )
Not good for:
- app w/ heavy server-side processing(CPU intensive) -> better for php, python

</details>
<details>
	<summary>📌 BASIC BUILTINS</summary>

[✏️ Need to update this Readme Section?](./01_basic-builtins/README.md)

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


</details>
<details>
	<summary>📌 HOW NODES WORKS</summary>

[✏️ Need to update this Readme Section?](./02_how_nodes_works/README.md)

# How Node is working

## Event Loop and Thread Pools
Libuv allowed Node to have event loop and thread pools 
- Node process
	- | Single thread ( where the code is executed ) - sequence of instruction 
		1. | intialize program
		2. | execute top level code
		3. | require modules
		4. | register event callbacks
		5. --> Start event loop
		
		_____________________________________________________________________________________
		|																					|
		|			Node.JS Process															|
		|	_____________________________________											|
		|	|									|											|
		|	|			Single Thread			|											|
		|	|	_____________________________	|		--------- Thread Pool ----------	|
		|	|	|							|	|		|								|	|
		|	|	|		Event Loop 			|___________|	Thread #1		Thread#2	|	|
		|	|	|							|	|		|								|	|
		|	|	|___________________________|	|		|	Thread #3		Thread#4	|	|
		|	|___________________________________|		|_______________________________|	|
		|___________________________________________________________________________________|	

Note: heavy tasks ( not correctly handle in Event Loop ) are delegated to 
other threads called threads pools

Event Loop can offload work there:
- automatically done behind the scene for known works
	- file system APIs ( manipulating content in disk )
	- cryptography ( require computation ~ encryption )
	- compression
	- DNS lookups
- Default number of thread: 4 ( can be more: 128 )

Event Loop execution scope:
	- code within callback function ( non top-top level code )
	- is Event Driven Architecture
		- event are emitted
		- event loop picks them up
		- callback are called when done
	- is built around callback 
	- code within callback function
	- does the orchestration

Event Loop has multiple phases
|--> Each phases has a CallBack Queues
		1. phase for timer callbacks ( setTimeout )
		2. phase for i/o polling & callbacks 
		3. phase setImmediate callbacks
		4. phase for close callback
		-----------------------------------------------------
		5. phase for `process.nextTick()` queue
		6. phase for other microTasks queue ( resolved promises )
	If any callback in one of these phases: they will be   
	executed right after the current phase of the event loop finishes  
	( instead of waiting for the whole event loops to finish ) 

Powerful:
- same thread used for x users -> event loop and its thread delegation   
are great for scalability ( whereas apache / php as a thread per user -> CPU work load )

Dangers to acknowledge:
- single thread must not be blocked
( don't use sync versions of function in `fs`, `crypto`, `zlib` modules in our callbacks )
- no complex calculations ( loops in loops )
- be careful with large json objects
- don't use too complex regular expression ( nested quantifiers )

During phase polling: Event loop is awaiting for things to happen in poll phase:  
- schedule a cb with setImmediate -> the callback will be executed right away 
Pausing the polling phase to handle this/


Reminder - Misleadings:
Acknowledging "tick" is actually an entire loop
- process.nextTick --> process **before** next loop phases
- setImmediate --> process **once per tick** 


### Thread Pools
Certain modules will be natively offloaded by node to a thread pool ( ex: crypto )
There are by default 4 threads pools than can be changed re-assigning the desired size
with the following:
In the code practice -> observe the 4 crypto operation changing the number of thread pools
( ex 1 to 4 ) --> we will observe operation delegated between the number of thread :
- similar delta times groups
- and/or noticeable delta time in ms
`process.env.UV_THREADPOOL_SIZE = 1`

--> when 1 thread: output printing in terminal for crypto operation are
printed - 1 by 1

--> when 2 threads: output printing in terminal for crypto operation are
printed - 2 by 2

--> when 3 threads: output printing in terminal for crypto operation are
printed - a group of 3 at once / then the last one

--> when 4 threads: output printing in terminal for crypto operation are
printed - all 4 print at once

Working with the sync version ( blocking ) -> the work will not be offloaded in thread loop
but processed in main thread



### Events
With Emitters from events ( Observable patterns ) we
can create one or more events listenners.
- Emitter.emit -> trigger the event
- Emitter.on -> listen for the event ( react )
Great to use within a class


### Streams
Used to process ( read and write ) data piece by piece ( chunks )
- without completing the whole read or write operation
- without keeping all the data in memory
Great to process large set of data

#### Type of streams:
Streams used everywhere in Node
Streams are instances of EventEmitter Class
- readable streams: 
	- description: read / consume data
	- examples: http req, fs read streams
	- events: `data` on consume, `end` on ending reading
	- important functions: `pipe()` and `read()`
- writable streams:
	- description: write data
	- examples: http response, fs.write
	- events: `drain` on data chunk and `finish`
	- important functions:  `pipe()` and `write()`
- duplex streams 
	- description: readable and writable streams at the same time
	- examples: websocket
	- events: ❌
	- important functions: ❌
- transform streams 
	- description: stream transforming data as it is red or written
	- examples: zlib gzip creation
	- events: ❌
	- important functions: ❌


In `./03-streams.js`

The route read will encapsulate all approaches: commend / un-comment the one you want
- approach 1: reading file 
- approach 2: reading file as stream
- approach 3: reading file as stream and pipe data


The application of reading stream and using the response stream
- Approach 1: Reading File
	Cannot handle the whole large file at once which can lead to crash the server


- Approach 2: Reading File Stream
	Stream to read file on disk are fast -> the Response Stream can struggle 
	|--> can lead to **overwhelming** the Response Stream ( res.write ) not being able
	to handle incoming data that fast

	--> Known problem called "Back Pressure" : cannot send data nearly as fast  
	as received from file

- Approach 3: Reading File Stream + Pipe operator
	`pipe(<what>)` is available to all readable stream
	fixing the back pressure issue - handling the speed of incoming and out-coming data  
	acting as a controller
	`<what>` can be any be a readable, duplex, transform stream
Definitely more elegant, the pipe handles everything and resolve back pressure problem

Question: can browser create streams too ? 
Yes
```js
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello, world!');
    controller.close();
  }
});

const reader = readableStream.getReader();
reader.read().then(({ done, value }) => {
  if (!done) {
    console.log(value); // Output: Hello, world!
  }
});
```

Ex - case for BLE - is stream ok ? 
```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
  .then(device => device.gatt.connect())
  .then(server => server.getPrimaryService('battery_service'))
  .then(service => service.getCharacteristic('battery_level'))
  .then(characteristic => {
    const readableStream = new ReadableStream({
      start(controller) {
        characteristic.startNotifications().then(() => {
          characteristic.addEventListener('characteristicvaluechanged', event => {
            const value = event.target.value;
            controller.enqueue(value);
          });
        });
      },
      cancel() {
        characteristic.stopNotifications();
      }
    });
const reader = readableStream.getReader();
    reader.read().then(function process({ done, value }) {
      if (done) {
        console.log('Stream complete');
        return;
      }
      console.log('Received BLE data:', value);
      reader.read().then(process);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
```
Ex - FE stream with BLE + piping to request to backend
```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
  .then(device => device.gatt.connect())
  .then(server => server.getPrimaryService('battery_service'))
  .then(service => service.getCharacteristic('battery_level'))
  .then(characteristic => {
    const readableStream = new ReadableStream({
      start(controller) {
        characteristic.startNotifications().then(() => {
          characteristic.addEventListener('characteristicvaluechanged', event => {
            const value = event.target.value;
            controller.enqueue(value);
          });
        });
      },
      cancel() {
        characteristic.stopNotifications();
      }
    });

    const writableStream = new WritableStream({
      write(chunk) {
        fetch('https://your-backend-endpoint', {
          method: 'POST',
          body: chunk,
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        }).then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        }).then(data => {
          console.log('Successfully sent data to backend:', data);
        }).catch(error => {
          console.error('Error sending data to backend:', error);
        });
      },
      close() {
        console.log('Stream complete');
      },
      abort(err) {
        console.error('Stream error:', err);
      }
    });

    readableStream.pipeTo(writableStream)
      .then(() => console.log('Piping complete'))
      .catch(error => console.error('Piping error:', error));
  })
  .catch(error => {
    console.error('Error:', error);
  });


  // backend 
  app.post('/upload', (req, res) => {
  const writableStream = fs.createWriteStream('output.bin');

  req.pipe(writableStream);

  writableStream.on('finish', () => {
    res.status(200).send('File written successfully');
  });

  writableStream.on('error', (err) => {
    console.error('Error writing file:', err);
    res.status(500).send('Error writing file');
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
  ```

</details>
<details>
	<summary>📌 MODULES</summary>

[✏️ Need to update this Readme Section?](./03_modules/README.md)

# Modules
In node, each file is considered to be a separate module
- in commonJS: 
	- `require()` to import 
	- `exports` or `module.exports = {}` to exports
- in esNext: `import`/`export`
- es module file: `.mjs`

## Require behind the scene
1. resolving and loading module
2. wrapping process around the module
3. module code is executed
4. returning module exports
5. entire module is cached

### Resolving / Loading modules
Node recognizes 4 types of modules on importation
Checking with the following steps
1. native built-in core modules load 
2. local/developer module
3. external modules

Path resolving process
1. check with core modules
2. if relative path --> this is a developer modules
3. if no found file --> check for an `index.js` file
4. else -> go within the node module to find the module

### Wrapping
Encapsulate the code so it does not impact other code
Using IFFE - keeping the module private
```js
	(function( exports, require, module, __filename,  __dirname){});

```

### Execution
REPL function execution

### Returning exports
- require function returns exports on the required module
- module.exports is the returned object
- use module.exports to export one single variable ( one class / one function )
- use exports when exporting multiple elements ` exports.add = <fn>`

### Caching
Code is served from caching

### Demo
- `arguments` is a built in variable - by logging we are verifying   
modules are indeed encapsulated
```js

[Arguments] {
  '0': {}, // corresponds to exported content from the module file 
  '1': [Function: require] {
    resolve: [Function: resolve] { paths: [Function: paths] },
    main: {
      id: '.',
      path: '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules',
      exports: {},
      filename: '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js',
      loaded: false,
      children: [],
      paths: [Array]
    },
    extensions: [Object: null prototype] {
      '.js': [Function (anonymous)],
      '.json': [Function (anonymous)],
      '.node': [Function (anonymous)]
    },
    cache: [Object: null prototype] {
      '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js': [Object]
    }
  },
  '2': {
    id: '.',
    path: '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules',
    exports: {},
    filename: '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js',
    loaded: false,
    children: [],
    paths: [
      '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/node_modules',
      '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/node_modules',
      '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/node_modules',
      '/Users/Lowla/Desktop/CODE/UDEMY/node_modules',
      '/Users/Lowla/Desktop/CODE/node_modules',
      '/Users/Lowla/Desktop/node_modules',
      '/Users/Lowla/node_modules',
      '/Users/node_modules',
      '/node_modules'
    ]
  },
  '3': '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js',
  '4': '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules'
}

```

</details>
<details>
	<summary>📌 ASYNC PROMISE AND ASYNC AWAIT</summary>

[✏️ Need to update this Readme Section?](./04_async_promise-and-async-await/README.md)

# Asynchronous JS: Promises and Async Await
Avoiding callback hell

Fetching API 
- api: `https://dog.cee/api/breed/hound/images/random`
- superagent library module to download

## Key takeaways
- Asynchronous code execution will never return a value to the main thread synchronously.
  - All caught data can be used within its asynchronous function execution or promise resolution.
- In promises, instead of nesting promises within promises, they can be flattened by returning the promise. This improves readability and avoids callback hell.
- All asynchronous function signatures will always return a promise.

- Node.js async 1st implementation introduced the **callbacks model**, allowing operations to proceed based on the resolution of the async operation.
- Node.js async 2nd iteration introduced the new `Promise` constructor, providing a leaner way to handle asynchronous returned values by chaining them using `.then` and `.catch`.
- Node.js async 3rd alternative to promises was `util.promisify`.
- Node.js async 4th iteration introduced a better built-in proposition with the `fs/promises` module.
- Node.js async 5th iteration (ES8) introduced the `async`/`await` keywords.
It avoids the use of promise.catch and promise.then 
It encourages to wrap the whole logic with a `try` / `catch` statement
It behave alike synchronous syntax implementation when using `await`: it
pauses the context execution util an rejection or resolution is made, then
pass to the next line
- promise error from an `async` defined function to be caught should mark the promise as rejected = un-resolved,  
this is done only if in the defined <Promise>.catch we `throw` an error

</details>
