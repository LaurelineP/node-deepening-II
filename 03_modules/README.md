# Modules
In node, each file is considered to be a separate module
- in commonJS: 
	- `require()` to import 
	- `exports` or `module.exports = {}` to exports
- in esNext: `import`/`export`
- es module file: `.mjs`

## Require behind the scene
1. resolving and loading module
2. wrapping process around the module
3. module code is executed
4. returning module exports
5. entire module is cached

### Resolving / Loading modules
Node recognizes 4 types of modules on importation
Checking with the following steps
1. native built-in core modules load 
2. local/developer module
3. external modules

Path resolving process
1. check with core modules
2. if relative path --> this is a developer modules
3. if no found file --> check for an `index.js` file
4. else -> go within the node module to find the module

### Wrapping
Encapsulate the code so it does not impact other code
Using IFFE - keeping the module private
```js
	(function( exports, require, module, __filename,  __dirname){});

```

### Execution
REPL function execution

### Returning exports
- require function returns exports on the required module
- module.exports is the returned object
- use module.exports to export one single variable ( one class / one function )
- use exports when exporting multiple elements ` exports.add = <fn>`

### Caching
Code is served from caching

### Demo
- `arguments` is a built in variable - by logging we are verifying   
modules are indeed encapsulated
```js

[Arguments] {
  '0': {}, // corresponds to exported content from the module file 
  '1': [Function: require] {
    resolve: [Function: resolve] { paths: [Function: paths] },
    main: {
      id: '.',
      path: '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules',
      exports: {},
      filename: '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js',
      loaded: false,
      children: [],
      paths: [Array]
    },
    extensions: [Object: null prototype] {
      '.js': [Function (anonymous)],
      '.json': [Function (anonymous)],
      '.node': [Function (anonymous)]
    },
    cache: [Object: null prototype] {
      '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js': [Object]
    }
  },
  '2': {
    id: '.',
    path: '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules',
    exports: {},
    filename: '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js',
    loaded: false,
    children: [],
    paths: [
      '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/node_modules',
      '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/node_modules',
      '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/node_modules',
      '/Users/Lowla/Desktop/CODE/UDEMY/node_modules',
      '/Users/Lowla/Desktop/CODE/node_modules',
      '/Users/Lowla/Desktop/node_modules',
      '/Users/Lowla/node_modules',
      '/Users/node_modules',
      '/node_modules'
    ]
  },
  '3': '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js',
  '4': '/Users/Lowla/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules'
}

```