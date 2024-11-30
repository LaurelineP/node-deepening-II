/**
First implementation
Version 1 / 3
 *  Ahead Implementations - have the difference declinations written down
 *  1. callback hell with superagent oriented callback
 *  2. callback x promise based use on superagent
 *  3. promise based - with new Promise
 *  4. promise based - with util.promisify
 *  5. promise based - with fs/promises
 */


const fs = require('node:fs');
const superagent = require('superagent');


const { 
	logValue, 	// console.table({ value })
	watchError, // if(err) console.log(err)
	watchData,	// if(data) console.log(data)
	watchDone,	// console.log(Done)
	watchResponse // check both err and/or data
} = require('../core/logs.utils');

const { useAPI, INPUT_FILE, OUTPUT_FILE } = require('./tools')


/* -------------------------------------------------------------------------- */
/*                                1. CALLBACKS                                */
/* -------------------------------------------------------------------------- */
// Callback consummation - on fs and superagent.get()
function runCallbacksBased (){
	// 1st callback level
	fs.readFile(INPUT_FILE, 'utf-8', (err, breed) => {
		watchResponse(err, breed)
		// request made with nested callbacks 1
		superagent(
			useAPI(breed),
			(err, res) => {
				const imageUrl = res.body.message
				watchResponse(err, res.body.message)


				// nested callbacks 2
				fs.writeFile(OUTPUT_FILE, imageUrl, watchDone)
				logValue({ breed, imageUrl })
			}
		)
	})
	/**

	Error Feedback: No Error - Operation was successful! Please Proceed.
	┌─────────┬─────────────┐
	│ (index) │ Values      │
	├─────────┼─────────────┤
	│ value   │ 'retriever' │
	└─────────┴─────────────┘

	Error Feedback: No Error - Operation was successful! Please Proceed.
	┌─────────┬─────────────────────────────────────────────────────────────────────────┐
	│ (index) │ Values                                                                  │
	├─────────┼─────────────────────────────────────────────────────────────────────────┤
	│ value   │ 'https://images.dog.ceo/breeds/retriever-flatcoated/n02099267_3611.jpg' │
	└─────────┴─────────────────────────────────────────────────────────────────────────┘
	┌─────────┬─────────────┬─────────────────────────────────────────────────────────────────────────┐
	│ (index) │ breed       │ imageUrl                                                                │
	├─────────┼─────────────┼─────────────────────────────────────────────────────────────────────────┤
	│ value   │ 'retriever' │ 'https://images.dog.ceo/breeds/retriever-flatcoated/n02099267_3611.jpg' │
	└─────────┴─────────────┴─────────────────────────────────────────────────────────────────────────┘
	Task completed.
 */
}
// runCallbacksBased()



/* -------------------------------------------------------------------------- */
/*                    2. CALLBACK X SUPERAGENT PROMISE CHAIN                  */
/* -------------------------------------------------------------------------- */
// Promises chains consummation - on api superagent
function runPromiseBased(){
	fs.readFile(INPUT_FILE, 'utf-8', (err, breed) => {
		watchResponse(err, breed)
		// promise chains bellow
		superagent
			.get( useAPI( breed ))
			.catch(watchError)
			.then( res => res.body.message )
			.then( watchData )
			.then( imageUrl => {
				fs.writeFile( OUTPUT_FILE, imageUrl, watchDone )
				logValue({ breed, imageUrl })
			})
	})
	/**
		Error Feedback: No Error - Operation was successful! Please Proceed.
		┌─────────┬─────────────┐
		│ (index) │ data        │
		├─────────┼─────────────┤
		│ value   │ 'retriever' │
		└─────────┴─────────────┘
		┌─────────┬───────────────────────────────────────────────────────────────────┐
		│ (index) │ data                                                              │
		├─────────┼───────────────────────────────────────────────────────────────────┤
		│ value   │ 'https://images.dog.ceo/breeds/retriever-curly/n02099429_738.jpg' │
		└─────────┴───────────────────────────────────────────────────────────────────┘
		┌─────────┬─────────────┬───────────────────────────────────────────────────────────────────┐
		│ (index) │ breed       │ imageUrl                                                          │
		├─────────┼─────────────┼───────────────────────────────────────────────────────────────────┤
		│ value   │ 'retriever' │ 'https://images.dog.ceo/breeds/retriever-curly/n02099429_738.jpg' │
		└─────────┴─────────────┴───────────────────────────────────────────────────────────────────┘
		Task completed.
	*/
}
// runPromiseBased()





/**
	FOR ALL FOLLOWING PROMISED BASED IMPLEMENTATION
	CAN BE IMPROVED USING FLAT CHAINING INSTEAD OF NESTED CHAINING 
	- good to understand how nested can be not comfortable to read
	-> but there is another way to handle ( ./01_callbacks-to-promise.refacto)
*/
/* -------------------------------------------------------------------------- */
/*                          3. PROMISE - NEW PROMISE                          */
/* -------------------------------------------------------------------------- */
const readFilePromise = file => {
	return new Promise((resolve, reject) => {
		fs.readFile(
			file,
			'utf-8', 
			( err, data ) =>  err ? reject(err) : resolve(data)
		)
	})
}

const writeFilePromise = (file, content) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, content, err => {
			err ? reject(err) : resolve(content)
		})
	})
}


const runFullCustomPromiseBased = () => {

	// 1st level
	readFilePromise(INPUT_FILE)
		.catch(watchError)
		.then(watchData)

		// 2nd level
		.then(breed => {
			superagent.get(useAPI(breed))
			.catch(watchError)

			// 3rd level
			.then(res => {
				const imageUrl = res.body.message
				writeFilePromise(OUTPUT_FILE, imageUrl)
				logValue({ breed, imageUrl })
			})
		})
	/**
		┌─────────┬─────────────┐
		│ (index) │ data        │
		├─────────┼─────────────┤
		│ value   │ 'retriever' │
		└─────────┴─────────────┘
		┌─────────┬─────────────┬─────────────────────────────────────────────────────────────────────┐
		│ (index) │ breed       │ imageUrl                                                            │
		├─────────┼─────────────┼─────────────────────────────────────────────────────────────────────┤
		│ value   │ 'retriever' │ 'https://images.dog.ceo/breeds/retriever-golden/n02099601_8764.jpg' │
		└─────────┴─────────────┴─────────────────────────────────────────────────────────────────────┘
		Task completed.
	 */
}
runFullCustomPromiseBased()
	

/* -------------------------------------------------------------------------- */
/*                    ASYNC OPERATIONS - FS/PROMISE                   	    */
/* -------------------------------------------------------------------------- */
const promisify = require('node:util').promisify
const fsPromise = promisify(fs.readFile)

function runFullPromiseBased(){

	fsPromise(INPUT_FILE, 'utf-8')
		.catch(watchError)
		.then(watchData)
		.then( breed => {
			superagent.get(useAPI(breed))
				.catch(watchError)
				.then(res => {
					const imageUrl = res.body.message
					
					fs.writeFile(OUTPUT_FILE, imageUrl, watchDone)
					logValue({ breed, imageUrl })
				})
		})
}
runFullPromiseBased()
