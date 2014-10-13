var assert = require('assert');
var cedict = require('../index');

describe('Search CC-CEDICT', function(){

  describe('Search by Chinese', function(){
    
    it('should search by traditional if provided string is traditional', function(done){
      cedict.searchByChinese('強', function(words){
        assert.equal(words.length, 4);
        done();
      });
    });

    it('should search by simplified if provided string is simplified', function(done){
      cedict.searchByChinese('强', function(words){
        assert.equal(words.length, 7);
        done();
      });
    });

  });

});