/**
 * Version 3 / 3
 * Callback hell and Flat promise chains
 */

const fs = require('node:fs')
const superagent = require('superagent')
const { watchError, watchData } = require('../core/logs.utils')

const { useAPI, INPUT_FILE, OUTPUT_FILE } = require('./tools')


/* -------------------------------------------------------------------------- */
/*                                CALLBACK HELL                               */
/* -------------------------------------------------------------------------- */
function runCallbackHell () {

	// 1st callback level
	fs.readFile(INPUT_FILE, 'utf-8', (err, breed) => {
		watchError(err)
		watchData(breed)

		// 2nd callback level 
		superagent( useAPI( breed ), (err, res) => {
			watchError(err)
			const imageURL = res.body.message
			watchData(imageURL)

			// 3rd callback level
			fs.writeFile(OUTPUT_FILE, imageURL, watchError )
		})
		/**
			Error Feedback: No Error - Operation was successful! Please Proceed.
			┌─────────┬─────────────┐
			│ (index) │    data     │
			├─────────┼─────────────┤
			│  value  │ 'retriever' │
			└─────────┴─────────────┘

			Error Feedback: No Error - Operation was successful! Please Proceed.
			┌─────────┬─────────────────────────────────────────────────────────────────────────┐
			│ (index) │                                  data                                   │
			├─────────┼─────────────────────────────────────────────────────────────────────────┤
			│  value  │ 'https://images.dog.ceo/breeds/retriever-flatcoated/n02099267_4311.jpg' │
			└─────────┴─────────────────────────────────────────────────────────────────────────┘

			Error Feedback: No Error - Operation was successful! Please Proceed.
		 */
		
	})
}
runCallbackHell()



/* -------------------------------------------------------------------------- */
/*                                PROMISE CHAIN                               */
/* -------------------------------------------------------------------------- */

const readPromise = file => {
	return new Promise(( resolve, reject ) => {
		fs.readFile( file, 'utf-8', (err, data) => {
			err ? reject(err) : resolve(data)
		})
		
	})
}

const writePromise = ( file, content ) => {
	return new Promise(( resolve, reject ) => {
		fs.writeFile( file, content, err => {
			err ? reject(err) : resolve(content)
		})
	})
}
function runPromiseChain(){
	readPromise(INPUT_FILE)
		.catch(watchError)
		.then( breed => {
			watchData(breed)
			return superagent.get( useAPI( breed ))
		})
		.then( res => {
			const imageURL = res.body.message
			watchData(imageURL)
			return writePromise(OUTPUT_FILE, imageURL)
		})
	/**
		┌─────────┬─────────────┐
		│ (index) │    data     │
		├─────────┼─────────────┤
		│  value  │ 'retriever' │
		└─────────┴─────────────┘
		┌─────────┬────────────────────────────────────────────────────────────────────────────────┐
		│ (index) │                                      data                                      │
		├─────────┼────────────────────────────────────────────────────────────────────────────────┤
		│  value  │ 'https://images.dog.ceo/breeds/retriever-golden/PXL_20220424_121025943.MP.jpg' │
		└─────────┴────────────────────────────────────────────────────────────────────────────────┘
	 */
}
// runPromiseChain()