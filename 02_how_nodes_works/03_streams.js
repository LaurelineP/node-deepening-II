const fs = require('node:fs'); 
const server = require('node:http').createServer();

const LOG_FILE_PATH = `${__dirname}/03_streams__server-stream-log.txt`
const LARGE_FILE_PATH = `${__dirname}/test-file.txt`

/* -------------------------------------------------------------------------- */
/*                     PERSONAL IMPLEMENTATION - REQ x LOG                    */
/* -------------------------------------------------------------------------- */
const logContent = (req, res) => {
	if( req.url !== '/favicon.ico'){
		let htmlResponse = `<h1>Request on: ${req.url}</h1>`
		htmlResponse += `<p>Time: ${new Date().toISOString()}</p>`;
		htmlResponse += `<p>User-Agent: ${req.headers['user-agent']}</p>`;
		htmlResponse += `<br>`;

		const textLog = htmlResponse
			.replaceAll(/<\/.+?>/g, '\n') 	// closing tags
			.replace('<br>', '\n\n')		// br tag ( not closing )
			.replaceAll(/<.+>/g, '')		// opening tags

		fs.appendFile(LOG_FILE_PATH, textLog, () => {
			console.log(textLog)
		})
		return htmlResponse;
	} 
}



const handleRequestedRouteResponse = (req, res) => {
	const html = logContent(req, res)
	switch( req.url ){
		case '/':
			return res.end(html)

		case '/read': 
			/* -------------------------------------------------------------------------- */
			/*                       APPROACH 1 - READ FILE AS USUAL                      */
			/* -------------------------------------------------------------------------- */
			/* Course demo 1 - sending fs read data -  can crash when too large */
			// fs.readFile(LARGE_FILE_PATH, 'utf-8', (err, data) => {	
			// 	if(err) res.end(err)			
			// 	return res.end(data.replaceAll('\n', '<br>'))
			// })


			/* -------------------------------------------------------------------------- */
			/*                      APPROACH 2 - READ FILE AS STREAM                      */
			/* -------------------------------------------------------------------------- */
			// Course demo 2 - Using Streams - sending chunk
			// // const readable = fs.createReadStream(LARGE_FILE_PATH + 'h') // with error
			// const readable = fs.createReadStream(LARGE_FILE_PATH) // without error
			// readable
			// 	.on('error', err => {
			// 		// ex: file path with wrong path
			// 		console.error(err)
			// 		res.statusCode = 500
			// 		return res.end('File not found')
			// 	})
			// 	.on('data', chunk => {
			// 		return res.write(chunk) // use write method from res stream
			// 	})

			// 	.on('end', () => {
			// 		return res.end('End of file')
			// 	})

			/* -------------------------------------------------------------------------- */
			/*                 APPROACH 3 - READ FILE AS STREAM WITH PIPE                 */
			/* -------------------------------------------------------------------------- */
			const readable = fs.ReadStream(LARGE_FILE_PATH);
			readable.pipe(res)
	}
} 
server.on('request', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	if(req.url === '/favicon.ico'){
		return res.end('No Content to display');
	} else {
		return handleRequestedRouteResponse(req, res)
	}
})




server.listen(8080, 'localhost', () => {
	console.info('Server is listening on: http://localhost:8080')
})