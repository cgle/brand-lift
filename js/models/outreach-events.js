define(['jquery','underscore','backbone'],
	function($,_,Backbone){
		var OutreachEvent = Backbone.Model.extend({
			defaults: {
				"event_id": "",
				"user_id": "",
				"timestamp": "",
				"track_period": "",
				"tags": []
			}
		});

		var OutreachEvents = Backbone.Collection.extend({
			model: OutreachEvent,
			url: "query.json",
			parse: function(res){
				return res.outreach_events;
			}
		});

		return {model:OutreachEvent,collection:OutreachEvents};
	});