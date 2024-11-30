console.log(arguments)
/**

[Arguments] {
  '0': {},
  '1': [Function: require] {
    resolve: [Function: resolve] { paths: [Function: paths] },
    main: {
      id: '.',
      path: '/Users/laurelineparis/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules',
      exports: {},
      filename: '/Users/laurelineparis/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js',
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
      '/Users/laurelineparis/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js': [Object]
    }
  },
  '2': {
    id: '.',
    path: '/Users/laurelineparis/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules',
    exports: {},
    filename: '/Users/laurelineparis/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js',
    loaded: false,
    children: [],
    paths: [
      '/Users/laurelineparis/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/node_modules',
      '/Users/laurelineparis/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/node_modules',
      '/Users/laurelineparis/Desktop/CODE/UDEMY/Jonas-Schmedtmann/node_modules',
      '/Users/laurelineparis/Desktop/CODE/UDEMY/node_modules',
      '/Users/laurelineparis/Desktop/CODE/node_modules',
      '/Users/laurelineparis/Desktop/node_modules',
      '/Users/laurelineparis/node_modules',
      '/Users/node_modules',
      '/node_modules'
    ]
  },
  '3': '/Users/laurelineparis/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules/index.js',
  '4': '/Users/laurelineparis/Desktop/CODE/UDEMY/Jonas-Schmedtmann/MEN/03_modules'
}
 */


 console.log(require('module').wrapper)
 //(function( exports, require, module, __filename,  __dirname){});