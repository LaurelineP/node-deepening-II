

const fs 			= require('node:fs')
const promisify 	= require('util').promisify
const superagent 	= require('superagent')
const {
	useAPI,
	INPUT_FILE,
	OUTPUT_FILE
} = require('./tools')

const { watchError,
	watchData,
	logValue
} = require('../core/logs.utils')

const readPromise = promisify(fs.readFile)
const writePromise = promisify(fs.writeFile)

async function runAsync (){
	let breed, imageURL;
	try {
		// 1st level
		breed = await readPromise(INPUT_FILE, 'utf-8')
		watchData(breed)

		// 2nd level
		const response = await superagent.get(useAPI(breed))
		imageURL = response.body.message
		watchData(imageURL)

		// 3rd level
		await writePromise(OUTPUT_FILE, imageURL)

		logValue({ breed, imageURL })

	} catch (error) {
		watchError(error)
	}
	return { breed, imageURL }

}
runAsync() // < promise returned
