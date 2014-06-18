App.Route2Controller = Ember.Controller.extend({
	btnText: "click me",
	actions: {
		sayHello: function(){
			alert("I'm Route2 Controller");
		}
	}
});