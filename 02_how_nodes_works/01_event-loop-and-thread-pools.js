const fs = require('node:fs')

/**
	Event Loop in practice
	Hard to trully replicate
	Refers to ./README > Node process explanations 
 */


/* -------------------------------------------------------------------------- */
/*                                   CASE 1                                   */
/* -------------------------------------------------------------------------- */
// // timing function: phase timer callback 
//  setTimeout(() => { console.log('Timer 1 finished') }, (0));


// // timing function: phase immediate callback 
//  setImmediate(() => {console.log('Immediate 1 finished')})


// // i/o & callback: phase
// fs.readFile('./test-file.txt', 'utf-8', (err, data) => {
// 	console.log('I/O finished')
// })


// // main thread - top level code executed in main thread ( no event loop delegation )
// console.log('0. Top Level Code')
/**
	first: console.log top level
	____________________________
	other 3 are in not particular order -> not in i/o cycle
	--> so not run inside event loop ( not ran inside any cb function )
	Output ( multiple time here / same output ):
		- 0. Top Level Code
		- Timer 1 finished
		- I/O finished
		- Immediate 1 finished
	
 */

//  /* -------------------------------------------------------------------------- */
//  /*                        CASE 2 - EVENT LOOP TRIGGERED                       */
//  /* -------------------------------------------------------------------------- */
// // To make use of event loop: we could move the timer fns to a callback

// setTimeout(() => { console.log('Timer 1 finished')}, (0));

// setImmediate(() => {console.log('Immediate 1 finished')})


// // i/o & callback: phase
// fs.readFile('./test-file.txt', 'utf-8', (err, data) => {
// 	console.log('I/O finished');
// 	console.log('^----------- Not in Event Loop ----------\n');
// 	console.log('------------- In Event Loop ----------v');

// 	/* TIMERS IN CALLBACK --> TRIGGERS EVENT */
// 	// timing function: phase timer callback 
// 	setTimeout(() => { console.log('Timer 2 finished') }, (0));
// 	setTimeout(() => { console.log('Timer 3 finished') }, (3_000));


// 	// timing function: phase immediate callback 
// 	setImmediate(() => {console.log('Immediate 2 finished')})

// })


// // main thread - top level code executed in main thread ( no event loop delegation )
// console.log('0. Top Level Code');

// /**
// 	Output:
// 		0. Top Level Code
// 		Timer 1 finished
// 		I/O finished
// 		^----------- Not in Event Loop ----------

// 		------------- In Event Loop ----------v
// 		Immediate 1 finished
// 		Immediate 2 finished
// 		Timer 2 finished
// 		Timer 3 finished
//  */


/* -------------------------------------------------------------------------- */
/*                        CASE 3 - EVENT LOOP & MICRO TASK                    */
/* -------------------------------------------------------------------------- */

// setTimeout(() => { console.log('Timer 1 finished')}, (0));

// setImmediate(() => {console.log('Immediate 1 finished')})


// // i/o & callback: phase
// fs.readFile('./test-file.txt', 'utf-8', (err, data) => {
// 	console.log('I/O finished');
// 	console.log('^----------- Not in Event Loop ----------\n');
// 	console.log('------------- In Event Loop ----------v');

// 	/* TIMERS IN CALLBACK --> TRIGGERS EVENT */

// 	setTimeout(() => { console.log('Timer 2 finished') }, (0));
// 	setTimeout(() => { console.log('Timer 3 finished') }, (3_000));


// 	setImmediate(() => {console.log('Immediate 2 finished')});

// 	// micro task in between phases
// 	process.nextTick(() => { console.log('Process.nextTick')})

// })


// // main thread - top level code executed in main thread ( no event loop delegation )
// console.log('0. Top Level Code');

// /**
// Observation: next Tick run before the phase of the established phase ( )
// 	Output:
// 		0. Top Level Code
// 		Timer 1 finished
// 		I/O finished
// 		^----------- Not in Event Loop ----------

// 		------------- In Event Loop ----------v
// 		Process.nextTick
// 		Immediate 1 finished
// 		Immediate 2 finished
// 		Timer 2 finished
// 		Timer 3 finished
//  */



/* -------------------------------------------------------------------------- */
/*                        CASE 4 - EVENT LOOP & THREAD POOLS                  */
/* -------------------------------------------------------------------------- */
// Adding crypto to ensure nodes uses threads pool
const crypto = require('node:crypto');
const start = Date.now();

// Playing around with thread pools size
process.env.UV_THREADPOOL_SIZE = 1;


setTimeout(() => { console.log('Timer 1 finished')}, (0));

setImmediate(() => {console.log('Immediate 1 finished')})


fs.readFile('./test-file.txt', 'utf-8', (err, data) => {
	console.log('I/O finished');
	console.log('^----------- Not in Event Loop ----------\n');
	console.log('------------- In Event Loop ----------v');

	/* TIMERS IN CALLBACK --> TRIGGERS EVENT */

	setTimeout(() => { console.log('Timer 2 finished') }, (0));
	setTimeout(() => { console.log('Timer 3 finished') }, (3_000));


	setImmediate(() => {console.log('Immediate 2 finished')});

	process.nextTick(() => { console.log('Process.nextTick')});

	/* THREAD POOL */
	crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
		console.log(Date.now() - start,'ms delta, Password encrypted 1')
	});
	crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
		console.log(Date.now() - start,'ms delta, Password encrypted 2')
	});
	crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
		console.log(Date.now() - start,'ms delta, Password encrypted 3')
	});
	crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
		console.log(Date.now() - start,'ms delta, Password encrypted 4')
	});

})


// main thread - top level code executed in main thread ( no event loop delegation )
console.log('0. Top Level Code');

/**
Observation: manual manage thread pool to acknowledge how much time it could take 
--> Using crypto - by default handled with thread pool by node
--> Using date subtraction to identify how long it could take 
--> Using - to control how many pool should be used
	Output for 1 crypto handle :
		0. Top Level Code
		Timer 1 finished
		I/O finished
		^----------- Not in Event Loop ----------

		------------- In Event Loop ----------v
		Process.nextTick
		Immediate 1 finished
		Immediate 2 finished
		Timer 2 finished
		596 ms delta, Password encrypted 1
		Timer 3 finished



	Output for 4 crypto handles - reminder: 4 default thread pools 
	~~> will take about the same time each as long as:
	- there are no more than 4 operations ( 4 cryptos )
	- there are the default min thread pools configured

		0. Top Level Code
		Timer 1 finished
		I/O finished
		^----------- Not in Event Loop ----------

		------------- In Event Loop ----------v
		Process.nextTick
		Immediate 1 finished
		Immediate 2 finished
		Timer 2 finished
		594 ms delta, Password encrypted 2
		603 ms delta, Password encrypted 4
		625 ms delta, Password encrypted 1
		632 ms delta, Password encrypted 3
		Timer 3 finished
		
		Output for 4 crypto handles - diff number of thread pools 
		Manipulating --> ThreadPoolSize 2
			0. Top Level Code
			Timer 1 finished
			I/O finished
			^----------- Not in Event Loop ----------

			------------- In Event Loop ----------v
			Process.nextTick
			Immediate 1 finished
			Immediate 2 finished
			Timer 2 finished
			561 ms delta, Password encrypted 2 // <-- threadpool 1
			563 ms delta, Password encrypted 1 // <-- threadpool 1
			1115 ms delta, Password encrypted 3 // <-- threadpool 2
			1119 ms delta, Password encrypted 4 // <-- threadpool 2
			Timer 3 finished


		Manipulating --> ThreadPoolSize 3
			0. Top Level Code
			Timer 1 finished
			I/O finished
			^----------- Not in Event Loop ----------

			------------- In Event Loop ----------v
			Process.nextTick
			Immediate 1 finished
			Immediate 2 finished
			Timer 2 finished
			595 ms delta, Password encrypted 2 // <-- one of 3 threads
			601 ms delta, Password encrypted 1 // <-- one of 3 threads
			607 ms delta, Password encrypted 3 // <-- one of 3 threads
			1133 ms delta, Password encrypted 4 //  <-- once threads are available
			Timer 3 finished

		Manipulating --> ThreadPoolSize 1 -> each will take one thread -> most likely keep same order ( ✅ theory confirmed )
			0. Top Level Code
			Timer 1 finished
			I/O finished
			^----------- Not in Event Loop ----------

			------------- In Event Loop ----------v
			Process.nextTick
			Immediate 1 finished
			Immediate 2 finished
			Timer 2 finished
			542 ms delta, Password encrypted 1
			1078 ms delta, Password encrypted 2
			1613 ms delta, Password encrypted 3
			2146 ms delta, Password encrypted 4
			Timer 3 finished
 */