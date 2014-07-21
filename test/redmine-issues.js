
var Execute = require('../lib/execute');

describe('Execute', function(){
	it('Debe devolver el nombre de la rama actual', function(){
		new Execute('git rev-parse --abbrev-ref HEAD', function(response){
			response.should.equal("master");
		});
	});
});

