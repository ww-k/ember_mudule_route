/*
	动态加载路由所需的模版以及组件
*/
(function() {
	var get = Ember.get,
		set = Ember.set;

	var renderPromises = Ember.A([]);
	var renderFuns = Ember.A([]);
	//由于renderTemplate,加入了异步的机制,而该行为必须按顺序执行,
	//所以此处维护一个队列来确保该方法顺序执行.

	function _runRenderTemplateQueue() {
		Ember.RSVP.all(renderPromises).then(function() {
			renderFuns.forEach(function(funObj) {
				var route = funObj.context;
				if(!route._abortRender){
					funObj.fn.apply(route, funObj.args);
				}
			});
			renderPromises.length = 0;
			renderFuns.length = 0;
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
			@default "broada/base/text"
			@instance
		*/
		templateLoader: "broada/base/text",
		/**
			模版文件的目录
			@memberof Ember.Route
			@default "./templates/"
			@instance
		*/
		templateDir: "./templates/",
		/**
			该路由需要从templateDir目录下请求的模版名数组,如果只有一个,可以是字符串.
			如不指定该属性, 只会将与路由名对应的模板加入请求列表.
			如果指定了该属性, 则只会请求该属性指定的模版.
			所以,可以将该属性设置为空数组[], 则不会请求任何模版.
			@memberof Ember.Route
			@default null
			@instance
		*/
		templateNames: null,
		/**
			该路由需要用到的组件类.
			@memberof Ember.Route
			@default null
			@instance
		*/
		templateViews: null,
		exit: function() {
			this._abortRender = true;
			this._super();
		},
		setup: function(context) {
			this._abortRender = false;
			var controllerName = this.controllerName || this.routeName,
				controller = this.controllerFor(controllerName, true);
			if (!controller) {
				controller =  this.generateController(controllerName, context);
			}

			this.controller = controller;

			//由于是新项目..弃用方法判断也去掉了
			this.setupController(controller, context);

			var renderPromise = this._renderTemplate();
			renderPromises.push(renderPromise);
			renderFuns.push({
				fn: this.renderTemplate,
				args: [controller, context],
				context: this
			});
			Ember.run.once(null, _runRenderTemplateQueue);
		},
		//加入动态加载逻辑
		_renderTemplate: function() {
			var route = this;
			return new Ember.RSVP.Promise(function(resolve, reject) {
				var routeName,
					TEMPLATES,
					templateLoader,
					templateDir,
					tplNames,
					tplViews,
					depsViews,
					depsTplNames,
					depsTplUrls,
					deps,
					args;
				if (route.constructor != "Ember.Route") {
					routeName = route.routeName.replace(/\./g, '/');
				}
				TEMPLATES = Ember.TEMPLATES;
				templateLoader = route.templateLoader;
				templateDir = route.templateDir;
				tplNames = route.templateNames || routeName || [];
				tplNames = typeof tplNames == "string" ? [tplNames] : [].concat(tplNames);
				tplViews = route.templateViews || [];
				tplViews = typeof tplViews == "string" ? [tplViews] : [].concat(tplViews);
				depsTplNames = [];
				depsTplUrls = [];
				args = [].slice.call(arguments);

				//将原生数组转变为Ember.Array
				Ember.A(tplNames);
				Ember.A(tplViews);
				Ember.A(depsTplNames);

				tplNames.forEach(function(tplName, i, self) {
					if (!TEMPLATES.hasOwnProperty(tplName)) {
						depsTplNames.push(tplName);
						depsTplUrls.push(templateLoader + "!" + templateDir +
							tplName.replace(/\//g, '_') + ".hbs");
					}
				});
				depsViews = tplViews.map(function(tplView, i, self) {
					return tplView.replace(/\./g, '/').toLowerCase();
				});
				deps = [].concat(depsTplUrls, depsViews);

				require(deps, function() {
					var modules = arguments;
					depsTplNames.forEach(function(tplName, i) {
						TEMPLATES[tplName] = Ember.Handlebars.compile(modules[i]);
					});
					Ember.run(null, resolve, args);
				});
			});
		}
	});
})();