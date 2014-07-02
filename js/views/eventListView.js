define(['jquery','underscore','backbone','text!templates/event-list.html','models/outreach-events','views/eventItemView'],
	function($,_,Backbone,eventListTemplate,OutreachEvents,eventItemView){
		var eventListView = Backbone.View.extend({
		el: $("#dashboard"),
		initialize: function(){
			this.$el.html(_.template(eventListTemplate));
			this.outreachevents = new OutreachEvents();
		},
		render: function(){
			var that = this;
			this.outreachevents.fetch({
				success: function(e) {		
					_.each(e.models,function(oe){
						var newItem = new eventItemView({model:oe});
						that.$("#event-list").append(newItem.$el);
					});
				}
			});
		}
		});
		return eventListView;

	});