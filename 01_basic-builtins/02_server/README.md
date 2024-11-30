# 02 server
Server can be done without external dependencies using the `http` or `https` built-in node module.
Using `http`, routing are made based on conditions.

## Server creation
```js
const http = require('http');

const server = http.createServer();

server.listen(8080, () => {
	console.info("Server is listening: http://localhost:8080")
})

```

Different usage explored in routes
- text response to the request on server
- json response to the request on server
- html response to the request on server

```js
// endpoint
const endpoints = {
	'/': 'Root',
	'/home': 'Home',
	'/overview': 'Overview',
	'/api': data
}

//...


// example response as text
if( req.url == '/' ){
	const content = endpoints['/'];
	res.end(content);
}

// example response as html
if( req.url == '/home' ){
	const content = endpoints['/home'];

	res.setHead('Content-Type', 'text/html')
	res.end(content);
}

// example response as json
if( req.url == '/api' ){
	const content = endpoints['/home'];

	res.setHead('Content-Type', 'application/json')
	res.end(content);
}

```