MainApp.AppView = Ember.View.extend({
	didInsertElement:function(){
		this._adjustContentFrameHeight();
		$(window).on("resize", this._adjustContentFrameHeight);
	},
	willDestroyElement: function(){
		$(window).off("resize", this._adjustContentFrameHeight)
	},
	_adjustContentFrameHeight: function() {
        var $contentFrame = this.$('#_contentFrame_');
        if ($contentFrame.length>0){
            $contentFrame.height($(window).height()-70);
        }
    }
});