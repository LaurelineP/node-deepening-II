/**
Version 2 / 3

	Review: meant to build every async deviations for a same code
	once more - reflect all the implementation in index.js
	Practicing repetition for fun
	1. [ callbacks ] dominant callback based
	2. [ callback & promise ] callback and promise with superagent
	3. [ promise ] promised based ( + creation of promise for fs methods )
	4. [ util.promisify ] promised based w/ promisify
	5. [ fs/promises ] promised based w/ fs/promises

	Time - 43min
 */


const fs = require('node:fs');
const superagent = require('superagent')
const { watchError, watchData, watchDone, logValue } = require('../core/logs.utils');
const { useAPI, INPUT_FILE, OUTPUT_FILE } = require('./tools')


/* -------------------------------------------------------------------------- */
/*                                1. CALLBACKS                                */
/* -------------------------------------------------------------------------- */
function runCallbacks (){
	// 1st level callback
	fs.readFile(INPUT_FILE, 'utf-8', (err, breed ) => {
		watchError(err)
		watchData(breed)

		// 2nd level callback
		superagent(
			useAPI(breed),
			(err, res) => {
				watchError(err)
				watchData(res.body.message)
				const imageURL = res.body.message

				// 3rd level callback
				fs.writeFile(OUTPUT_FILE, imageURL, watchDone)
				logValue({ breed, imageURL })

		})
	})
	/**
		Error Feedback: No Error - Operation was successful! Please Proceed.
		┌─────────┬─────────────┐
		│ (index) │    data     │
		├─────────┼─────────────┤
		│  value  │ 'retriever' │
		└─────────┴─────────────┘

		Error Feedback: No Error - Operation was successful! Please Proceed.
		┌─────────┬─────────────────────────────────────────────────────────────────────┐
		│ (index) │                                data                                 │
		├─────────┼─────────────────────────────────────────────────────────────────────┤
		│  value  │ 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5132.jpg' │
		└─────────┴─────────────────────────────────────────────────────────────────────┘
		┌─────────┬─────────────┬─────────────────────────────────────────────────────────────────────┐
		│ (index) │    breed    │                              imageURL                               │
		├─────────┼─────────────┼─────────────────────────────────────────────────────────────────────┤
		│  value  │ 'retriever' │ 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5132.jpg' │
		└─────────┴─────────────┴─────────────────────────────────────────────────────────────────────┘
		Task completed.
	 */
}
// runCallbacks()




/* -------------------------------------------------------------------------- */
/*                            2. CALLBACK X PROMISE                           */
/* -------------------------------------------------------------------------- */
function runCallbacksAndPromise(){
	// callback use
	fs.readFile(INPUT_FILE, 'utf-8', (err, breed) => {
		watchError(err)
		watchData(breed)

		// promise use
		superagent
			.get(useAPI(breed))
			.catch(watchError)
			.then(res => res.body.message)
			.then( imageURL => {
				watchData(imageURL)
				
				// callback use
				fs.writeFile(OUTPUT_FILE, imageURL, watchDone)
				logValue({ breed, imageURL })
			})
	})
	/**
		Error Feedback: No Error - Operation was successful! Please Proceed.
		┌─────────┬─────────────┐
		│ (index) │    data     │
		├─────────┼─────────────┤
		│  value  │ 'retriever' │
		└─────────┴─────────────┘
		┌─────────┬────────────────────────────────────────────────────────────────────┐
		│ (index) │                                data                                │
		├─────────┼────────────────────────────────────────────────────────────────────┤
		│  value  │ 'https://images.dog.ceo/breeds/retriever-curly/n02099429_2936.jpg' │
		└─────────┴────────────────────────────────────────────────────────────────────┘
		┌─────────┬─────────────┬────────────────────────────────────────────────────────────────────┐
		│ (index) │    breed    │                              imageURL                              │
		├─────────┼─────────────┼────────────────────────────────────────────────────────────────────┤
		│  value  │ 'retriever' │ 'https://images.dog.ceo/breeds/retriever-curly/n02099429_2936.jpg' │
		└─────────┴─────────────┴────────────────────────────────────────────────────────────────────┘
		Task completed.
	 */
}
// runCallbacksAndPromise()



/**
	FOR ALL FOLLOWING PROMISED BASED IMPLEMENTATION
	CAN BE IMPROVED USING FLAT CHAINING INSTEAD OF NESTED CHAINING 
	- good to understand how nested can be not comfortable to read
	-> but there is another way to handle ( ./01_callbacks-to-promise.refacto)
*/
/* -------------------------------------------------------------------------- */
/*                          3. PROMISES - NEW PROMISE                         */
/* -------------------------------------------------------------------------- */
const readFilePromise = (file) => new Promise((resolve, reject) => {
	fs.readFile(file, 'utf-8', (err, data) => {
		if( err ) return reject( err )
		return resolve( data )
	})
})
const writeFilePromise =( file, content )=> new Promise(( resolve, reject ) => {
	fs.writeFile(OUTPUT_FILE, content, err => {
		err ? reject(err) : resolve(content)
	})
})
function runWithNewPromise(){
	readFilePromise(INPUT_FILE)
		.catch(watchError)
		.then(watchData)
		.then( breed => {
			superagent.get(useAPI(breed))
				.catch(watchError)
				.then( res =>  {
					watchData(res.body.message)
					const imageURL = res.body.message
					writeFilePromise(OUTPUT_FILE, imageURL)
					logValue({ breed, imageURL })
				})
		})
		/**
			┌─────────┬─────────────┐
			│ (index) │    data     │
			├─────────┼─────────────┤
			│  value  │ 'retriever' │
			└─────────┴─────────────┘
			┌─────────┬────────────────────────────────────────────────────────────────────────┐
			│ (index) │                                  data                                  │
			├─────────┼────────────────────────────────────────────────────────────────────────┤
			│  value  │ 'https://images.dog.ceo/breeds/retriever-chesapeake/n02099849_264.jpg' │
			└─────────┴────────────────────────────────────────────────────────────────────────┘
			┌─────────┬─────────────┬────────────────────────────────────────────────────────────────────────┐
			│ (index) │    breed    │                                imageURL                                │
			├─────────┼─────────────┼────────────────────────────────────────────────────────────────────────┤
			│  value  │ 'retriever' │ 'https://images.dog.ceo/breeds/retriever-chesapeake/n02099849_264.jpg' │
			└─────────┴─────────────┴────────────────────────────────────────────────────────────────────────┘
			Task completed.
		 */
}
// runWithNewPromise()



/* -------------------------------------------------------------------------- */
/*                           4. PROMISES - PROMISIFY                          */
/* -------------------------------------------------------------------------- */
const promisify = require('util').promisify
const readFilePromisify = promisify(fs.readFile)
const writeFilePromisify = promisify(fs.writeFile)

function runPromisified(){
	readFilePromisify(INPUT_FILE, 'utf-8')
		.catch(watchError)
		.then(watchData)
		.then( breed => {
			superagent.get(useAPI(breed))
				.catch(watchError)
				.then( res => {
					watchData(res.body.message)
					const imageURL = res.body.message
					writeFilePromisify(OUTPUT_FILE, imageURL )
					logValue({ breed, imageURL })
				})
		})
	/**
		┌─────────┬─────────────┐
		│ (index) │    data     │
		├─────────┼─────────────┤
		│  value  │ 'retriever' │
		└─────────┴─────────────┘
		┌─────────┬─────────────────────────────────────────────────────────────────────────┐
		│ (index) │                                  data                                   │
		├─────────┼─────────────────────────────────────────────────────────────────────────┤
		│  value  │ 'https://images.dog.ceo/breeds/retriever-chesapeake/n02099849_3736.jpg' │
		└─────────┴─────────────────────────────────────────────────────────────────────────┘
		┌─────────┬─────────────┬─────────────────────────────────────────────────────────────────────────┐
		│ (index) │    breed    │                                imageURL                                 │
		├─────────┼─────────────┼─────────────────────────────────────────────────────────────────────────┤
		│  value  │ 'retriever' │ 'https://images.dog.ceo/breeds/retriever-chesapeake/n02099849_3736.jpg' │
		└─────────┴─────────────┴─────────────────────────────────────────────────────────────────────────┘
		Task completed.
	 */
}
// runPromisified()


/* -------------------------------------------------------------------------- */
/*                          5. PROMISES - FS/PROMISES                         */
/* -------------------------------------------------------------------------- */
const { writeFile, readFile } = require('node:fs/promises')

function runFSPromises (){
	// 1st level
	readFile(INPUT_FILE, 'utf-8')
		.catch(watchError)
		.then(breed => {
			watchData(breed)

			// 2nd level
			superagent.get( useAPI(breed) )
				.catch( watchError )
				.then(res => {
					const imageURL = res.body.message
					watchData(imageURL)

					// 3rd level
					writeFile(OUTPUT_FILE, imageURL)
						.catch( watchError )

					logValue({ breed, imageURL })

				})
		})
		/** 
			┌─────────┬─────────────┐
			│ (index) │    data     │
			├─────────┼─────────────┤
			│  value  │ 'retriever' │
			└─────────┴─────────────┘
			┌─────────┬─────────────────────────────────────────────────────────────────────┐
			│ (index) │                                data                                 │
			├─────────┼─────────────────────────────────────────────────────────────────────┤
			│  value  │ 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5736.jpg' │
			└─────────┴─────────────────────────────────────────────────────────────────────┘
			┌─────────┬─────────────┬─────────────────────────────────────────────────────────────────────┐
			│ (index) │    breed    │                              imageURL                               │
			├─────────┼─────────────┼─────────────────────────────────────────────────────────────────────┤
			│  value  │ 'retriever' │ 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5736.jpg' │
			└─────────┴─────────────┴─────────────────────────────────────────────────────────────────────┘
		 */
}
runFSPromises()