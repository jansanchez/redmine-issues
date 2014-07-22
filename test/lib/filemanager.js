
var FileManager = require('../../lib/filemanager');


describe('FileManager', function(){

	var file;
	
	beforeEach(function(){
		file = new FileManager('config/config.template.json', 'config/config.template.json');	
	});

	it.skip('Debe poder restaurar el archivo de configuración.', function(){
		file.restoreConfigFile();
		file.readFileName();

		file.get('domain').should.not.be.empty;
	});

	it('Debe acceder/obtener la información que se encuentra en el archivo.', function(){
		file.get('domain').should.not.be.empty;
	});

	it('Debe obtener información de las cabeceras de tabla desde el archivo.', function(){
		file.getCaption('project').should.be.equal("Project");
	});

	it('Debe salvar/guardar la configuración dentro del archivo.', function(){
		var domain = file.get('domain');
		file.set('domain', domain);
		file.save();
		file.readFileName();

		file.get('domain').should.be.equal(domain);
	});

});

