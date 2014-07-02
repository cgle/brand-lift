define(['jquery','underscore','backbone','views/eventListView'],
	function($,_,Backbone,eventListView){
		var AppRouter = Backbone.Router.extend({
			routes: {
				"*actions": "defaultAction"
			}

		});

		var initialize = function() {
			var app_router = new AppRouter();
			app_router.on("route:defaultAction", function(actions){
				var dashboard = new eventListView();
				dashboard.render();
			});

			Backbone.history.start();
		}

		return {initialize:initialize};
	});	