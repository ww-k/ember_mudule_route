/*
	动态加载路由所需的模版以及组件
*/
(function() {
	Ember.USE_MODULE_ROUTE = true;
	var get = Ember.get,
		set = Ember.set,
		forEach = Ember.EnumerableUtils.forEach;

	var setupPromises = [];
	var setupFuns = [];
	//由于现在新的setup是异步的,而Ember.Route的setup必须按顺序执行,
	//所以此处维护一个队列来确保Ember.Route的setup方法顺序执行.

	function _runSetupQueue() {
		Ember.RSVP.all(setupPromises).then(function() {
			forEach(setupFuns, function(funObj) {
				var route = funObj.context;
				if(!route._abortRender){
					funObj.fn.apply(route, funObj.args);
				}
			});
			setupPromises.length = 0;
			setupFuns.length = 0;
		});
	}

	/**
		扩展Ember.Route
		{@link http://emberjs.com/guides/routing/defining-your-routes/|详见原始文档}.
		@class Ember.Route
	*/
	Ember.Route.reopen({
		/**
			模版加载器的模块名
			@memberof Ember.Route
			@default "text"
			@instance
		*/
		templateLoader: "text",
		/**
			模版文件的目录
			@memberof Ember.Route
			@default "./templates/"
			@instance
		*/
		templateDir: "./templates/",
		/**
			声明该路由用到的模板名称以及模板路径.
			@memberof Ember.Route
			@default null
			@instance
		*/
		templates: null,
		/**
			该路由需要用到的组件类.
			@memberof Ember.Route
			@default null
			@instance
		*/
		dependences: null,

		routeCls: Ember.computed(function(){
			return "route-" + this.routeName.replace(/\-/g, '/');
		}),

		enter: function() {
			this._super();
			$("body").addClass(this.get("routeCls"));
		},

		exit: function() {
			this._abortSetup = true;
			this._super();
			$("body").removeClass(this.get("routeCls"));
		},

		setup: function() {
			if(!Ember.USE_MODULE_ROUTE ){
				return this._super();
			}
			this._abortSetup = false;
			var setupPromise = this.__setup();
			setupPromises.push(setupPromise);
			setupFuns.push({
				fn: this.__nextSuper,
				args: [].slice.call(arguments),
				context: this
			});
			Ember.run.once(null, _runSetupQueue);
		},

		__setup: function() {
			var route = this;
			return new Ember.RSVP.Promise(function(resolve, reject) {
				var needsTpl = false,
					routeName,
					templates,
					TEMPLATES,
					templateLoader,
					templateDir,
					dependences,
					depsTplNames,
					depsTplUrls;

				if (route.constructor != "Ember.Route") {
					needsTpl = true;
					routeName = route.routeName.replace(/\./g, '/');
				}

				TEMPLATES = Ember.TEMPLATES;
				templateLoader = route.templateLoader;
				templateDir = route.templateDir;

				dependences = route.dependences || [];

				depsTplNames = [];
				depsTplUrls = [];
				if(needsTpl){
					templates = route.templates || [routeName];
					forEach(templates, function(tpl, i, arr) {
						if(Ember.typeOf(tpl) == "string"){
							tpl = {
								name: tpl,
								url: tpl.replace(/\//g, '_') + ".hbs"
							};
							arr[i] = tpl;
						}
						if (!TEMPLATES.hasOwnProperty(tpl.name)) {
							depsTplNames.push(tpl.name);
							depsTplUrls.push(templateLoader + "!" + templateDir + "/" +
								tpl.url);
						}
					});
				}

				dependences = [].concat(depsTplUrls, dependences);

				if(dependences.length == 0){
					Ember.run(null, resolve);
				}else{
					require(dependences, function() {
						var modules = arguments;
						forEach(depsTplNames, function(tplName, i) {
							TEMPLATES[tplName] = Ember.Handlebars.compile(modules[i]);
						});
						Ember.run(null, resolve);
					});
				}
			});
		}
	});
})();