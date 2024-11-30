# How Node is working

## Event Loop and Thread Pools
Libuv allowed Node to have event loop and thread pools 
- Node process
	- | Single thread ( where the code is executed ) - sequence of instruction 
		1. | intialize program
		2. | execute top level code
		3. | require modules
		4. | register event callbacks
		5. --> Start event loop
		
		_____________________________________________________________________________________
		|																					|
		|			Node.JS Process															|
		|	_____________________________________											|
		|	|									|											|
		|	|			Single Thread			|											|
		|	|	_____________________________	|		--------- Thread Pool ----------	|
		|	|	|							|	|		|								|	|
		|	|	|		Event Loop 			|___________|	Thread #1		Thread#2	|	|
		|	|	|							|	|		|								|	|
		|	|	|___________________________|	|		|	Thread #3		Thread#4	|	|
		|	|___________________________________|		|_______________________________|	|
		|___________________________________________________________________________________|	

Note: heavy tasks ( not correctly handle in Event Loop ) are delegated to 
other threads called threads pools

Event Loop can offload work there:
- automatically done behind the scene for known works
	- file system APIs ( manipulating content in disk )
	- cryptography ( require computation ~ encryption )
	- compression
	- DNS lookups
- Default number of thread: 4 ( can be more: 128 )

Event Loop execution scope:
	- code within callback function ( non top-top level code )
	- is Event Driven Architecture
		- event are emitted
		- event loop picks them up
		- callback are called when done
	- is built around callback 
	- code within callback function
	- does the orchestration

Event Loop has multiple phases
|--> Each phases has a CallBack Queues
		1. phase for timer callbacks ( setTimeout )
		2. phase for i/o polling & callbacks 
		3. phase setImmediate callbacks
		4. phase for close callback
		-----------------------------------------------------
		5. phase for `process.nextTick()` queue
		6. phase for other microTasks queue ( resolved promises )
	If any callback in one of these phases: they will be   
	executed right after the current phase of the event loop finishes  
	( instead of waiting for the whole event loops to finish ) 

Powerful:
- same thread used for x users -> event loop and its thread delegation   
are great for scalability ( whereas apache / php as a thread per user -> CPU work load )

Dangers to acknowledge:
- single thread must not be blocked
( don't use sync versions of function in `fs`, `crypto`, `zlib` modules in our callbacks )
- no complex calculations ( loops in loops )
- be careful with large json objects
- don't use too complex regular expression ( nested quantifiers )

During phase polling: Event loop is awaiting for things to happen in poll phase:  
- schedule a cb with setImmediate -> the callback will be executed right away 
Pausing the polling phase to handle this/


Reminder - Misleadings:
Acknowledging "tick" is actually an entire loop
- process.nextTick --> process **before** next loop phases
- setImmediate --> process **once per tick** 


### Thread Pools
Certain modules will be natively offloaded by node to a thread pool ( ex: crypto )
There are by default 4 threads pools than can be changed re-assigning the desired size
with the following:
In the code practice -> observe the 4 crypto operation changing the number of thread pools
( ex 1 to 4 ) --> we will observe operation delegated between the number of thread :
- similar delta times groups
- and/or noticeable delta time in ms
`process.env.UV_THREADPOOL_SIZE = 1`

--> when 1 thread: output printing in terminal for crypto operation are
printed - 1 by 1

--> when 2 threads: output printing in terminal for crypto operation are
printed - 2 by 2

--> when 3 threads: output printing in terminal for crypto operation are
printed - a group of 3 at once / then the last one

--> when 4 threads: output printing in terminal for crypto operation are
printed - all 4 print at once

Working with the sync version ( blocking ) -> the work will not be offloaded in thread loop
but processed in main thread



### Events
With Emitters from events ( Observable patterns ) we
can create one or more events listenners.
- Emitter.emit -> trigger the event
- Emitter.on -> listen for the event ( react )
Great to use within a class


### Streams
Used to process ( read and write ) data piece by piece ( chunks )
- without completing the whole read or write operation
- without keeping all the data in memory
Great to process large set of data

#### Type of streams:
Streams used everywhere in Node
Streams are instances of EventEmitter Class
- readable streams: 
	- description: read / consume data
	- examples: http req, fs read streams
	- events: `data` on consume, `end` on ending reading
	- important functions: `pipe()` and `read()`
- writable streams:
	- description: write data
	- examples: http response, fs.write
	- events: `drain` on data chunk and `finish`
	- important functions:  `pipe()` and `write()`
- duplex streams 
	- description: readable and writable streams at the same time
	- examples: websocket
	- events: ❌
	- important functions: ❌
- transform streams 
	- description: stream transforming data as it is red or written
	- examples: zlib gzip creation
	- events: ❌
	- important functions: ❌


In `./03-streams.js`

The route read will encapsulate all approaches: commend / un-comment the one you want
- approach 1: reading file 
- approach 2: reading file as stream
- approach 3: reading file as stream and pipe data


The application of reading stream and using the response stream
- Approach 1: Reading File
	Cannot handle the whole large file at once which can lead to crash the server


- Approach 2: Reading File Stream
	Stream to read file on disk are fast -> the Response Stream can struggle 
	|--> can lead to **overwhelming** the Response Stream ( res.write ) not being able
	to handle incoming data that fast

	--> Known problem called "Back Pressure" : cannot send data nearly as fast  
	as received from file

- Approach 3: Reading File Stream + Pipe operator
	`pipe(<what>)` is available to all readable stream
	fixing the back pressure issue - handling the speed of incoming and out-coming data  
	acting as a controller
	`<what>` can be any be a readable, duplex, transform stream
Definitely more elegant, the pipe handles everything and resolve back pressure problem

Question: can browser create streams too ? 
Yes
```js
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello, world!');
    controller.close();
  }
});

const reader = readableStream.getReader();
reader.read().then(({ done, value }) => {
  if (!done) {
    console.log(value); // Output: Hello, world!
  }
});
```

Ex - case for BLE - is stream ok ? 
```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
  .then(device => device.gatt.connect())
  .then(server => server.getPrimaryService('battery_service'))
  .then(service => service.getCharacteristic('battery_level'))
  .then(characteristic => {
    const readableStream = new ReadableStream({
      start(controller) {
        characteristic.startNotifications().then(() => {
          characteristic.addEventListener('characteristicvaluechanged', event => {
            const value = event.target.value;
            controller.enqueue(value);
          });
        });
      },
      cancel() {
        characteristic.stopNotifications();
      }
    });
const reader = readableStream.getReader();
    reader.read().then(function process({ done, value }) {
      if (done) {
        console.log('Stream complete');
        return;
      }
      console.log('Received BLE data:', value);
      reader.read().then(process);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
```
Ex - FE stream with BLE + piping to request to backend
```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
  .then(device => device.gatt.connect())
  .then(server => server.getPrimaryService('battery_service'))
  .then(service => service.getCharacteristic('battery_level'))
  .then(characteristic => {
    const readableStream = new ReadableStream({
      start(controller) {
        characteristic.startNotifications().then(() => {
          characteristic.addEventListener('characteristicvaluechanged', event => {
            const value = event.target.value;
            controller.enqueue(value);
          });
        });
      },
      cancel() {
        characteristic.stopNotifications();
      }
    });

    const writableStream = new WritableStream({
      write(chunk) {
        fetch('https://your-backend-endpoint', {
          method: 'POST',
          body: chunk,
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        }).then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        }).then(data => {
          console.log('Successfully sent data to backend:', data);
        }).catch(error => {
          console.error('Error sending data to backend:', error);
        });
      },
      close() {
        console.log('Stream complete');
      },
      abort(err) {
        console.error('Stream error:', err);
      }
    });

    readableStream.pipeTo(writableStream)
      .then(() => console.log('Piping complete'))
      .catch(error => console.error('Piping error:', error));
  })
  .catch(error => {
    console.error('Error:', error);
  });


  // backend 
  app.post('/upload', (req, res) => {
  const writableStream = fs.createWriteStream('output.bin');

  req.pipe(writableStream);

  writableStream.on('finish', () => {
    res.status(200).send('File written successfully');
  });

  writableStream.on('error', (err) => {
    console.error('Error writing file:', err);
    res.status(500).send('Error writing file');
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
  ```