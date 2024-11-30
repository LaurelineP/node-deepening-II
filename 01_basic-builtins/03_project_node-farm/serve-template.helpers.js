const {
	DATA_JSON,
	TEMPLATE_PAGE_CONTENTS_MAP,
	ENDPOINT_EXCEPTIONS,
} = require('./constants'); 
const { slugifyProduct, isMatchingSlug } = require('./slugify.services');




/* --------------------------------- HELPERS -------------------------------- */
function responseNotFound (res) {
	res.writeHead(404, {'Content-Type': 'text/html'})
	return res.end('Page Not Found');
}


/**
 * Serve html
 * - route interfacing with templates folder
 * - replace all {%VARIABLE_LIKE%} patterns by concerned item
 */
function serveTemplatePage( res, endpointName ){

	const originUrl = res.req.url;
	let pageContent = TEMPLATE_PAGE_CONTENTS_MAP.get(endpointName);

	/* ------------- PREVENT MATCHING TEMPLATES FOR SPECIFIC ROUTES ------------- */
	const shouldNotServeTemplate = ENDPOINT_EXCEPTIONS.some(
		pattern => pattern.test(originUrl) && originUrl !== '/'
	)
	if(shouldNotServeTemplate) return responseNotFound(res);


	// serve page "/" as overview 
	if(originUrl === '/'){
		// render list with template card component
		const product_list = DATA_JSON.map( dataItem => replaceTemplate(
			dataItem,
			TEMPLATE_PAGE_CONTENTS_MAP.get('card.component') 
		)).join('')

		pageContent = pageContent.replace('{%PRODUCT_LIST%}', product_list );
	}


	// serves product with query or product with slug
	if( /\/product\?id=\d/.test(originUrl) || isMatchingSlug(originUrl)){
		const productId = originUrl.split('=')[1];
		const slug = originUrl.split('/').at(-1);


		const dataItem = DATA_JSON.find(p => p.id == productId || slugifyProduct(p.productName) === slug)
		pageContent = replaceTemplate( dataItem, pageContent )
	}
	
	res.writeHeader(200, {'Content-Type': 'text/html' });
	return res.end(pageContent);
}

function replaceTemplate( dataItem, strContent ){
	return strContent.replaceAll("{%PRODUCT_NAME%}", dataItem.productName )
		.replaceAll("{%PRODUCT_EMOTE%}", dataItem.image )
		.replaceAll("{%PRODUCT_FROM%}", dataItem.from )
		.replaceAll("{%PRODUCT_NUTRIENTS%}", dataItem.nutrients )
		.replaceAll("{%PRODUCT_QTY%}", dataItem.quantity )
		.replaceAll("{%PRODUCT_PRICE%}", dataItem.price )
		.replaceAll("{%PRODUCT_DESCRIPTION%}", dataItem.description )
		.replaceAll("{%PRODUCT_ID%}", dataItem.id )
		.replaceAll("{%PRODUCT_SLUG%}", slugifyProduct(dataItem.productName) )
		.replaceAll("{%PRODUCT_ORGANIC_CLASS%}", dataItem.organic ? '' : 'not-organic' )
}

module.exports = {
	serveTemplatePage,
	responseNotFound
}