/**
 * 02 - server http and templates html
 * Meant to dive into the use of templates
	- implemented a custom dynamic routing matching 
	based on template file names
 */

const http 		= require('node:http');
const { responseNotFound, serveTemplatePage } = require('./serve-template.helpers');


const {
	TEMPLATE_FILENAMES,
	DATA_JSON
} = require('./constants'); 
const { isMatchingSlug } = require('./slugify.services');

/* ------------------------------- HTTP SERVER ------------------------------ */
function mountHTTPServer(){

	const server = http.createServer((req, res) => {
		// 
		/**
		 * Routing - based on req.url to parse
		 * - acknowledging URL endpoint based on:  template --> document name
		 */
		const url = req.url;
		const pageName = url.slice(1,).split(/[?|\/]/)[0];
		/** ------------------------------ TEMPLATE URLs ----------------------------- 
		 * Endpoint should have the template html name to be served
		 * - one template to exclude ( card.component )
		 * - endpoint overview -> /overview
		 * - endpoint product -> /product
		 */

		 const shouldExclude = pageName === 'card.component';
		 const page = pageName ? pageName : 'overview';

		 const isEndpointToTemplates = !shouldExclude
		 	&& (
				TEMPLATE_FILENAMES.includes(page)
				|| isMatchingSlug(pageName)
			)

		if( isEndpointToTemplates ) {
			return serveTemplatePage( res, page );
		}

		/** ------------------------- STATIC DATA ROUTES ------------------------- */
		const endpoints = {
			'/api': DATA_JSON,
		}
		const endpointContent = endpoints?.[url];
		if( endpointContent ){
			// route /api - Serving JSON
			res.writeHeader(200, { 'Content-Type': 'application/json' })
			return res.end(JSON.stringify({ data: DATA_JSON }))
		}

		/* ------------------------------- DEFAULT 404 ------------------------------ */
		/** Default - fallback page 404 */
		return responseNotFound(res);

	})



	server.listen(8080, () => {
		console.info(`Server in http://localhost:8080`)
	})
}
mountHTTPServer()