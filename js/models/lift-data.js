define(['jquery','underscore','backbone'],
	function($,_,Backbone){
		var Lift = Backbone.Model.extend({
			defaults: {
				"tag_name": "",
				"normalized_time": [],
				"raw_time": []
			},
		});

		var Lifts = Backbone.Collection.extend({
			model: Lift
		});

		return {model:Lift,collection:Lifts};
	});