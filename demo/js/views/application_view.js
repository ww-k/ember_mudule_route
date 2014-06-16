MainApp.ApplicationView = Ember.View.extend({
	didInsertElement:function(){
		var lis = this.$("#navbar li");
		lis.each(function(i, li){
			var hash = location.hash == "" ? "#" : location.hash;
			if( $(li).find("a").attr("href") == hash ){
				$(li).addClass("active");
			}
		})
		lis.click(function(){
			lis.removeClass("active");
			$(this).addClass("active");
		});
	}
});