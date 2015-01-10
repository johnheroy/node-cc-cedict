var _ = require('underscore');
var path = require('path');
var queryable = require( 'queryable' );
var db = queryable.open(path.resolve(__dirname, './db/cc-cedict.mongo'));

// convert between traditional and simplified
var cnchars = require('cn-chars');
// prettify the pinyin default (letters + numbers) in CC-CEDICT
var pinyin = require('prettify-pinyin');

module.exports.searchByChinese = function(str, cb){
  var simplified = str.slice().split('');
  var traditional = str.slice().split('');
  for (var i = 0; i < str.length; i++){
    simplified[i] = cnchars.toSimplifiedChar(str[i]);
    traditional[i] = cnchars.toTraditionalChar(str[i]);
  }
  simplified = simplified.join('');
  traditional = traditional.join('');

  // default search is simplified unless input string is traditional
  var query = {
    where: {simplified: simplified}
  };
  if (traditional === str){
    query.where = {traditional: traditional};
  }

	db.find(query.where, function(result) {
		var results = [];
		_.each(result.rows, function(word){
			var pronunciation = word.pronunciation;
			var prettified = pinyin.prettify(pronunciation.slice(1, pronunciation.length - 1).replace(/u\:/g, "v"));
			results.push({
				traditional: word.traditional,
				simplified: word.simplified,
				pronunciation: prettified,
				definitions: word.definitions
			});
		});
		cb(results);
	});
};

module.exports.searchByPinyin = function(str, cb) {
	
	// Catches dead-tones or 5th tone
	var parts = str.split(" ");
	var newStr = [];
	_.each(parts, function(part) {
		var numeric = part.replace(/\D/g,'');
		
		// Convert ü/v to u: as used in dictionary
		var newPart = [];
		var umlat = false;
		_.each(part.split(""), function(char) {
			if (char === "ü" || char === "v") {
				newPart.push("u");
				newPart.push(":");
				umlat = true;
			} else {
				newPart.push(char);
			}
		});
		if (umlat)
			newStr.push(newPart.join(""));
		
		if (numeric === "") {
			part += "5";
			newStr.push(part);
		} else if (!umlat) {
			newStr.push(part);
		}
	});
	
	str = "[" + newStr.join(" ") + "]";
	
	db.find({pronunciation: str}, function(result) {
		var results = [];
		_.each(result.rows, function(word){
			var pronunciation = word.pronunciation;
			var prettified = pinyin.prettify(pronunciation.slice(1, pronunciation.length - 1).replace(/u\:/g, "v"));
			results.push({
				traditional: word.traditional,
				simplified: word.simplified,
				pronunciation: prettified,
				definitions: word.definitions
			});
		});
		cb(results);
	});
}

module.exports.searchByEnglish = function(str, cb){
  // TODO
};
