
var Execute = require('../../lib/execute');

describe('Execute', function(){

	it('Debe devolver alguna cadena de texto al ejecutar el comando "pwd".', function(){
		new Execute('pwd', function(response){
			response.should.not.be.empty;
		});
	});

});

