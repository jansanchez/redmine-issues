
var Api = require('../../lib/redmine-api');

describe('Api', function(){

	var api,
	options = {};
	
	beforeEach(function(){
		api = new Api("config/config.json");
		options.issue = 43368;
		options.percent = 16;
		options.message = "Mi progreso es: " + options.percent;
		options.estimated = 0;
		options.limit = 5;
	});

	it.skip('Debe obtener información de un issue.', function(done){
		api.getIssue(options.issue, function(data){
			done();
		});
	});

	it.skip('Debe guardar la información en un issue.', function(done){
		api.getIssue(options.issue, function(data){
			api.updateIssue(options.percent, options.message, options.estimated, function(){
				done();
			});
		});
	});

	it('Debe obtener la lista de issues de un usuario.', function(done){
		api.getIssues({}, function(data){
			done();
		});
	});


});

