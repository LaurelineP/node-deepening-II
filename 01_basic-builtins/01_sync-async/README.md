# 01 sync and async
Synchronous and Asynchronous programming can be used with Node JS.
Node is great to handle asynchronous programming especially thanks
to its event loop mechanism

## Using fs built-in feature
`fs` short for `file system` is a built-in tool dealing with file and folder
Here, it will cover reading and writing files

Do x using sync:
You need to acknowledge the blocking behavior synchronous programming is doing.
Nodes handle synchronous behavior but block the execution until it the process is done.
The down sides:
- a user has to wait
- multiple tons of user have to wait the server dealt with all the other user process
( if any ) before handling the last one
The up sides:
- out-scoping sync results -> could enhance experience
The resources is loaded once and stored, when needed can be re-used 


Do x using async:
Natively handle with node tools using callbacks ( function passed as argument )
On stacking event in even loop -> node can do its process without having to block
the user.
A process is made and once done, it will trigger the callback to return the result in the main thread
Callbacks in Node has 2 arguments: error as first argument, then data as second argument

This folder:
Exploring those with sync / async read and writing file using `fs`