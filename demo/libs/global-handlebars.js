define(['require', 'libs/handlebars-v2.0.0'], function(require, Handlebars){
	//使用了amd后, handlebars会定义为amd 模块, 不在是全局的.
	//而ember中只能接收全局的Handlebars, 所以需要将Handlebars变为全局的
	this.Handlebars = Handlebars;
	return Handlebars;
});