define(["ember", "route"], function(){

	Ember.RSVP.configure('onerror', function(error) {
		Ember.Logger.assert(false, error);
	});
	Ember.run.backburner.DEBUG = true;
	Ember.USE_MODULE_ROUTE = true;

	//启动应用
	var App = window.App = Ember.Application.create();

	//路由配置
	App.Router.map(function() {
		this.route('route1');
		this.route('route2');
		this.route('route3');
	});
	Ember.Route.reopen({
		templateLoader: "text",
		templateDir: "./templates/"
	})
	//路由
	App.IndexRoute = Ember.Route.extend({
		redirect: function(){
			this.transitionTo("route1");
		}
	});
	App.Route1Route = Ember.Route.extend({
		dependences: [
			"js/controllers/route1_controller"
		]
	});
	App.Route2Route = Ember.Route.extend({
		dependences: [
			"js/controllers/route2_controller",
			"js/views/route2_view"
		]
	});
	App.Route3Route = Ember.Route.extend({
		templateNames: [
			"route1",
			"route2",
			"route3"
		],
		dependences: [
			"js/controllers/route1_controller",
			"js/controllers/route2_controller",
			"js/views/route2_view"
		],
		renderTemplate: function(){
			this.render("route1");
			this.render("route2");
			this.render("route3");
		}
	});
});