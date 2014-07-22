
var Api = require('../../lib/redmine-api');

describe('Api', function(){

	var api,
	options = {};
	
	beforeEach(function(){
		api = new Api("config/config.json");
		options.issue = 43368;
		options.percent = 10;
		options.message = "Mensaje";
		options.estimated = 9;
	});

	it('Debe obtener información de un issue.', function(done){
		api.getIssue(options.issue, function(data){
			done();
		});
	});

	
	
});

