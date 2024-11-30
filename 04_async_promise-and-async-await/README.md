# Asynchronous JS: Promises and Async Await
Avoiding callback hell

Fetching API 
- api: `https://dog.cee/api/breed/hound/images/random`
- superagent library module to download

## Key takeaways
- Asynchronous code execution will never return a value to the main thread synchronously.
  - All caught data can be used within its asynchronous function execution or promise resolution.
- In promises, instead of nesting promises within promises, they can be flattened by returning the promise. This improves readability and avoids callback hell.
- All asynchronous function signatures will always return a promise.

- Node.js async 1st implementation introduced the **callbacks model**, allowing operations to proceed based on the resolution of the async operation.
- Node.js async 2nd iteration introduced the new `Promise` constructor, providing a leaner way to handle asynchronous returned values by chaining them using `.then` and `.catch`.
- Node.js async 3rd alternative to promises was `util.promisify`.
- Node.js async 4th iteration introduced a better built-in proposition with the `fs/promises` module.
- Node.js async 5th iteration (ES8) introduced the `async`/`await` keywords.
It avoids the use of promise.catch and promise.then 
It encourages to wrap the whole logic with a `try` / `catch` statement
It behave alike synchronous syntax implementation when using `await`: it
pauses the context execution util an rejection or resolution is made, then
pass to the next line
- promise error from an `async` defined function to be caught should mark the promise as rejected = un-resolved,  
this is done only if in the defined <Promise>.catch we `throw` an error