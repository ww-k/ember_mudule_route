//配置关闭模块化路由功能, 默认是启用的。
//Ember.USE_MODULE_ROUTE = true;

//启动应用
var App = Ember.Application.create();

//路由配置
App.Router.map(function() {
	this.route('route1');
	this.route('route2');
	this.route('route3');
});

//配置text库的地址和模板库的地址
Ember.Route.reopen({
	templateLoader: "./libs/text",
	templateDir: "./templates/"
})

//路由
App.IndexRoute = Ember.Route.extend({
	redirect: function(){
		this.transitionTo("route1");
	}
});
App.Route1Route = Ember.Route.extend();
App.Route2Route = Ember.Route.extend({
	dependences: [
		"js/controllers/route2_controller",
		"js/views/route2_view"
	]
});
App.Route3Route = Ember.Route.extend({
	//配置路由依赖的模板
	templateNames: [
		"route1",
		"route2",
		"route3"
	],
	//配置路由依赖的控制器，视图， 组件等。
	dependences: [
		"js/controllers/route2_controller",
		"js/views/route2_view"
	],
	renderTemplate: function(){
		this.render("route3");
		this.render("route1", {
			into: 'route3',
			outlet: 'o1'
		});
		this.render("route2", {
			into: 'route3',
			outlet: 'o2'
		});
	}
});