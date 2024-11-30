/**
	Resolving multiple promises at once can be done using `Promise.all`
	- Using superagent promise based, we will get x images
 */
const { readFile } = require('node:fs/promises')
const superagent = require('superagent')
const { useAPI, INPUT_FILE } = require('./tools')
const { watchError } = require('../core/logs.utils')
 
async function runConcurrentPromises(n = 5){
	try {
		const breed = await readFile(INPUT_FILE, 'utf-8')

		// Generate x promises
		const promises = []
		for( n >= 0; n--;){
			promises.push(superagent.get(useAPI(breed + 9)))
		}

		// Promises array to work with concurrently 
		let results = await Promise.all(promises)

		// Handle each resolution to get the value payload
		results = results.map( res => res.body.message)

		return results
	} catch( err ) {
		return 'ERROR🔥'
	}
}

runConcurrentPromises()
	.then( console.table )
	.catch(watchError)
