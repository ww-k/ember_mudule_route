MainApp.ApplicationController = Ember.ObjectController.extend({
	curUserName: jQuery.cookie("username"),
	curRepoName: jQuery.cookie("repoName"),
    logout: function(){
        jQuery.cookie('token', null, {
            path: BASE_SYSTEM_URL
        });
        location.href='../login_mgr';
    }
});