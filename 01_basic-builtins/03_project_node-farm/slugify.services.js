const slugify = require('slugify');
const { DATA_JSON } = require('./constants')

function slugifyProduct( productName ){
	return slugify(
		productName,
		{
			lower: true,
			replacement: '-',
			strict: true
		}
	)
}

function isMatchingSlug(originUrl){
	return DATA_JSON.some(
		data => slugifyProduct(data.productName) === originUrl.split('/').at(-1)
	)
}

module.exports = {
	slugifyProduct,
	isMatchingSlug
}