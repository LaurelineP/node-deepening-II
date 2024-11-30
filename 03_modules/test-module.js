
/* -------------------------------------------------------------------------- */
/*                      Exporting one object - Expression                     */
/* -------------------------------------------------------------------------- */
/** Assuming this is the sole export in the file:
	Ex importing this module file from another root file:
	`const Calculator = require('./test-module)`
**/
class Calculator {
	add(a, b) {
		return a + b
	}
	multiply( a, b ){
		return a * b
	}
	divide( a, b ){
		return a / b
	}
}

module.exports = Calculator;

/* -------------------------------------------------------------------------- */
/*                      Exporting one object - Assignment                     */
/* -------------------------------------------------------------------------- */
/** Assuming this is the sole export in the file:
	Ex importing this module file from another root file:
	`const Calculator = require('./test-module)`
**/
module.exports = class Calculator {
	add(a, b) {
		return a + b
	}
	multiply( a, b ){
		return a * b
	}
	divide( a, b ){
		return a / b
	}
}

module.exports = Calculator;

/* -------------------------------------------------------------------------- */
/*               Exporting multiple object using `exports.<obj>`              */
/* -------------------------------------------------------------------------- */
/** Assuming this is the sole export syntax in the file:
	Ex importing this module file from another root file:
	`const { add, multiply, divide } = require('./test-module)`
**/
exports.add = function (a, b) { return a + b }
exports.multiply = function (a, b) { return a + b }
exports.divide = function (a, b) { return a + b }


/* -------------------------------------------------------------------------- */
/*                               Caching export                               */
/* -------------------------------------------------------------------------- */
/** Assuming this is the sole export syntax in the file:
	Ex importing this module file from another root file:
	`require(./test-module.js)()` ( this is cached )
	 if instantiated multiple times
		the console "Private hello on file load'" run once, 
		then multiple times log
		require(./test-module.js)()
		require(./test-module.js)()
		require(./test-module.js)()
	)
	Output would be 
		Private hello on file load
		Hellow 🙌
		Hellow 🙌
		Hellow 🙌
**/
console.log('Private hello on file load')
module.exports = () => console.log('Hellow 🙌')