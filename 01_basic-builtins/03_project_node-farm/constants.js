const fs = require('node:fs');

/* -------------------------------------------------------------------------- */
/*                                 STATIC DATA                                */
/* -------------------------------------------------------------------------- */
const DATA_JSON = require('./dev-data/data');



/* -------------------------------------------------------------------------- */
/*                              ENDPOINTS RELATED                             */
/* -------------------------------------------------------------------------- */
const BASE_ENDPOINTS = [
	'/api'
];

const ENDPOINT_EXCEPTIONS = [
	/\/?overview\/?$/,
	/\/?product\/?$/,
];

/* -------------------------------------------------------------------------- */
/*                           FOLDERS & FILES RELATED                          */
/* -------------------------------------------------------------------------- */
const TEMPLATES_FOLDER_PATH = `${__dirname}/templates`;

/** HTML template file names  */
const TEMPLATE_FILENAMES = fs.readdirSync(
	`${TEMPLATES_FOLDER_PATH}`,
	{ recursive: true, encoding: 'utf-8'}
).map( f => f.replace('.html', ''));

// endpoint -> template
const TEMPLATE_PAGE_CONTENTS_MAP = TEMPLATE_FILENAMES
	.reduce(( mapper, filename )=> {
		const content = fs.readFileSync(
			`${TEMPLATES_FOLDER_PATH}/${filename}.html`,
			'utf-8'
		)
		mapper.set( filename, content )
		return mapper;
	}, new Map());

// card component template
const TEMPLATE_COMPONENT_CARD_CONTENT = fs.readFileSync(
	`${TEMPLATES_FOLDER_PATH}/card.component.html`,
	'utf-8'
)

/* -------------------------------------------------------------------------- */
/*                                    OTHER                                   */
/* -------------------------------------------------------------------------- */

const PRODUCT_NAMES = DATA_JSON.map( dataItem => dataItem.productName );

module.exports = {
	DATA_JSON,
	TEMPLATES_FOLDER_PATH,
	TEMPLATE_FILENAMES,
	TEMPLATE_PAGE_CONTENTS_MAP,
	TEMPLATE_COMPONENT_CARD_CONTENT,
	PRODUCT_NAMES,
	BASE_ENDPOINTS,
	ENDPOINT_EXCEPTIONS
}