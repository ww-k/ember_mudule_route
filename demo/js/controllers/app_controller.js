MainApp.AppController = Ember.ObjectController.extend({
	appUrl: Ember.computed(function(){
		return "../"+this.get("appname");
	}).property("appname")
});