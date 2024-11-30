/**
 * 02 - Server with HTTP built-in module
 * Meant to dive to:
 * - http server ( without third part library )
 * - handling routes along ( basically conditional checks )
	- could be done with if else ( level 1 )
	- could be done with switch cases ( level 2 )
	- could be done with switch cases ( level 3 - has scaling benefits)
	
 */

const http = require('node:http');
const data = require('./data');
/* ------------------------------- HTTP SERVER ------------------------------ */
function mountHTTPServer(){
	const server = http.createServer((req, res) => {
		// Routing - based on req.url to parse
		const pathname = req.url;

		/* ---------------------- OBJECT ORIENTED DECLINATION ---------------------- */
		const endpoints = {
			'/': 'Root',
			'/home': 'Home',
			'/overview': 'Overview',
			'/api': data
		}
		const pageContent = endpoints?.[pathname]
		if( pageContent ){
			if( typeof(pageContent) !== 'string' ){
				// /api - Serving JSON for
				res.writeHeader(200, { 'Content-Type': 'application/json' })
				return res.end(JSON.stringify({data}))
			}

			// rest of the routes - serving strings
			return res.end(pageContent)
		}
		/** Default */
		res.writeHead(404, { 'Content-Type': 'text/html'})
		return res.end('Page Not Found')

		/* ------------------------ SWITCH CASES DECLINATION ------------------------ */
		// switch(pathname){
		// 	case '/':
		// 		return res.end('Root');
		// 	case '/home':
		// 		return res.end('Home');
		// 	case '/overview':
		// 		return res.end('overview');
		//  default:
		// 		res.writeHead(404, {'Content-Type': 'txt/html'})
		//		return res.end('Not Found')
		// }



	})



	server.listen(8080, () => {
		console.info(`Server in http://localhost:8080`)
	})
}
mountHTTPServer()

