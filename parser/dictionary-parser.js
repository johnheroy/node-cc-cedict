// I used this script to generate ../db/cc-cedict.sqlite
// CC-CEDICT version as of October 6, 2014
// see ../src/cc-cedict.txt for more details

var queryable = require( 'queryable' );
var fs = require('fs');
var path = require('path');

var db = queryable.open(path.resolve(__dirname, '../db/cc-cedict.mongo'));

fs.readFile('../src/cc-cedict.txt', 'UTF-8', function(err, data){

	console.log('dictionary loaded, now executing parser');
	var lines = data.toString().split('\n');
	var s = 0;
	var i = 0;

	var addNextRow = function(){

		var line = lines[i];

		// not a comment
		if (line[0] !== '#' && line !== undefined){
			var spaceSplit = line.split(' ');
			var traditional = spaceSplit[0];
			var simplified = spaceSplit[1];

			var regex = /\[(.*?)\]/;
			var pronunciation = line.match(regex)[0].toLowerCase();

			var slashSplit = line.split('/');
			var defs = slashSplit.slice(1, slashSplit.length - 1).join('; ');

			db.insert({
				traditional: traditional,
				simplified: simplified,
				pronunciation: pronunciation,
				definitions: defs
			});
		}

		setTimeout(function(){
			if (i < lines.length){
				i += 1;
				
				if (s === 200) { // Prevents the running proccess from using too much memory. Too much being >200mb.
					db.save();
					s = 0;
				} else {
					s += 1;
				}
				
				addNextRow();
			} else {
				return;
			}
		}, 1);
	};
	addNextRow();
});