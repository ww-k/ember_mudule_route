//路由配置
MainApp.Router.map(function() {
	this.route('route1');
	this.route('route2');
	this.route('route3');
	this.route('route4');
});
Ember.Route.reopen({
	templateLoader: "./libs/text",
	templateDir: "./templates/"
})
//路由
MainApp.IndexRoute = Ember.Route.extend({
	redirect: function(){
		this.transitionTo("route1");
	}
});
MainApp.Route1Route = Ember.Route.extend({
});
MainApp.Route2Route = Ember.Route.extend({
});