// I used this script to generate ../db/cc-cedict.sqlite
// CC-CEDICT version as of July 26, 2016
// see ../src/cc-cedict.txt for more details

var Sequelize = require('sequelize');
var sqlite = require('sqlite3');
var fs = require('fs');
var path = require("path");

// defined db config
var sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: path.join(__dirname, '../db/', 'cc-cedict.sqlite')
});

// create a sqlite database with every entry
var Word = sequelize.define('word', {
  traditional: {
    type: Sequelize.STRING
  },
  simplified: {
    type: Sequelize.STRING
  },
  pronunciation: {
    type: Sequelize.STRING
  },
  definitions: {
    type: Sequelize.STRING
  }
});

// sync up the schema
sequelize
  .sync({ force: true }) // drop the table if it already exists
  .then(function () {
    console.log('It worked!');
  }, function (err) {
    console.log('An error occurred while creating the table:', err);
  });

fs.readFile(path.join(__dirname, '../src/', 'cc-cedict.txt'), 'UTF-8', function (err, data) {
  console.log('Dictionary loaded, now executing parser.');
  var lines = data.toString().split('\n');
  var i = 0;

  var addNextRow = function () {
    var line = lines[i];

    // not a comment
    if (line[0] !== '#') {
      var spaceSplit = line.split(' ');
      var traditional = spaceSplit[0];
      var simplified = spaceSplit[1];

      var regex = /\[(.*?)\]/;
      var pronunciation = line.match(regex)[0];

      var slashSplit = line.split('/');
      var defs = slashSplit.slice(1, slashSplit.length - 1).join('; ');

      var word = Word.create({
        traditional: traditional,
        simplified: simplified,
        pronunciation: pronunciation,
        definitions: defs
      });
    }

    setTimeout(function () {
      if (i < lines.length) {
        i += 1;
        addNextRow();
      } else {
        return;
      }
    }, 50);
  };
  addNextRow();
});
