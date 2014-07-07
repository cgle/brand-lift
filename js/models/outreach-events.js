define(['jquery','underscore','backbone'],
	function($,_,Backbone){
		var OutreachEvent = Backbone.Model.extend({
			defaults: {
				"event_id": "",
				"user_id": "",
				"timestamp": "",
				"track_period": "",
				"tags": []
			},
			validate: function(attrs){
				if (attrs.event_id == "" || attrs.user_id == "" || attrs.timestamp == "" || attrs.track_period == "" || attrs.tags == []){
					return "Need input data for query";
				}
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