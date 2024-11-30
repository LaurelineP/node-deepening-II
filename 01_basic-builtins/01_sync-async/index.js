const fs = require('node:fs')
const fsPromises = require('node:fs/promises')
const path = require('node:path')

const FILE_PATH_INPUT = path.resolve('.', '01', 'txt', 'input.txt')
const FILE_PATH_OUTPUT = path.resolve('.', '01', 'txt', 'output.txt')

let textIn, textOut;


/* ------------------------------- SYNCHRONOUS ------------------------------ */
function readSync() {
	this.textIn = fs.readFileSync(FILE_PATH_INPUT, 'utf-8')
	console.info("--> [ SYNC ] Reading Text from file:\n", this.textIn)
}

function writeSync() {
	this.textOut = `Created on ${Date.now()}\nWhat we know about the "input.txt":\n${this.textIn}`
	fs.writeFileSync(FILE_PATH_OUTPUT, this.textOut)
	console.info('\n--> [ SYNC ] Wrote:\n', this.textOut)
}


/* ------------------------------- ASYNCHRONOUS - REGULAR ------------------------------ */
function readAsync () {
	fs.readFile(FILE_PATH_INPUT, 'utf-8', (err, data) => {
		if(err){ console.error('[ readAsync ] Could not read file' )}
		this.textIn = data
		return;
	})
	console.info('\n--> [ ASYNC ] Reading Text from file:\n', this.textIn)
}
function writeAsync (){
	const text = `Created on ${Date.now()}\nWhat we know about the "input.txt":\n${this.textIn}`
	fs.writeFile(FILE_PATH_OUTPUT, 'utf-8', (err, data) => {
		if(err){ console.error('[ writeAsync ] Could not write to file' )}
		this.textOut = text
		return;
	})
}



/* ----------------------- ASYNCHRONOUS - PROMISE BASE ---------------------- */
async function readAsyncPromise(){
	const text = await fsPromises.readFile(FILE_PATH_INPUT, 'utf-8')
		.catch( err => {
			console.error('[ writeAsyncPromise ] Could not write to file')
			return;
		})
	this.textIn = text
	console.info('\n--> [ ASYNC - PROMISE ] Reading Text from file:\n', this.textIn)
}
async function writeAsyncPromise(){
	const text = `Created on ${Date.now()}\nWhat we know about the "input.txt":\n${this.textIn}`
	const output = await fsPromises.writeFile(FILE_PATH_OUTPUT, text)
		.then(() => text)
		.catch( err => {
			console.error('[ writeAsyncPromise ] Could not write to file')
		})
	this.textOut = output
	console.info('\n--> [ ASYNC - PROMISE ] Wrote :\n', this.textOut)
}




/* ------------------------------------ - ----------------------------------- */
readSync()
writeSync()
readAsync()
writeAsync()
async function executeAsyncPromises (){
	await readAsyncPromise()
	await writeAsyncPromise()
}
executeAsyncPromises()
