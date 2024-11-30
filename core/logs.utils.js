/** Logs helper - for a given value, log display a table  */
exports.logValue = (value) => {
	let logger = console.table
	if(
		value instanceof Object
		&& Object
			.values(value)
			.some(v => v instanceof Object)
	){
		logger = console.log
	}
	logger({ value })
	return value
}

/** Error callback logger - logs error or logs No Error Feedback 
	=> if (err) console.error(err)
*/
exports.watchError = err => {
	if(err) {
		console.error('❌ [ CAUGHT ERROR ]', err.message )
		return err
	}
	console.info('\nError Feedback: No Error - Operation was successful! Please Proceed.')
}
/** Success callback logger - logs and returns data 
	=> if (err) console.error(err)

*/
exports.watchData = data => {
	if(data){
		this.logValue({ data })
		return data
	}
}

exports.watchResponse = (err, data) => {
	this.watchError(err)
	this.watchData(data)
}

/** Empty callback logger  */
exports.watchDone = () => {
	console.info('Task completed.')
}