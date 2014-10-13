# node-cc-cedict [![Build Status](https://travis-ci.org/johnheroy/node-cc-cedict.svg)](https://travis-ci.org/johnheroy/node-cc-cedict)

node-cc-cedict provides a convenient asynchronous JavaScript API for the popular [CC-CEDICT](http://cc-cedict.org/) Chinese-English dictionary. This is a 'batteries-included' library and comes with a premade SQLite conversion of the entire dictionary.

## Usage

```
var cedict = require('node-cc-cedict');

cedict.searchByChinese('你好', function(words){
  console.log(words);
});

```

## License

MIT