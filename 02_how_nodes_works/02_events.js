const EventEmitter = require('node:events');
const http = require('node:http');

/* ------------------------------ SIMPLE EVENT ------------------------------ */
const myEmitter = new EventEmitter();

myEmitter.on('message', (msg) => {
	let message = "Listener: receiving message"
	if ( msg ){
		message += `: ${msg}`
	}
	console.log(message)
})

myEmitter.emit('message')
myEmitter.emit('message', 'Hello World')


/* ------------------------------- CLASS EVENT ------------------------------ */
class Stock extends EventEmitter {
	constructor(){
		super(); // inherit all from extended class
	}
}
const stock = new Stock();
stock.on('stock', (qty) => {
	console.log('Stock event:', qty)
})
stock.emit('stock', 2)
stock.emit('stock', 4)


/* ----------------- HTTP BEING AN EVENT EMITTER -> EXAMPLE ----------------- */
/**
 * How to test:
	- server must be mounted - then it will not close
	- from browser make a request ( hit the url )
	- from browser close the connection ( will hit the close event );
 */
const server = http.createServer();
server.on('request', (req, res) => {
	console.log('Request made on:', req.url);

	res.end('Request Received.')
})

server.listen(8080, 'localhost', () => {
	console.log('\nServer on http://localhost:8080 \nAwaiting for request...')
})