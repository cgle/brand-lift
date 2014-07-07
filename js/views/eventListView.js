define(['jquery','underscore','backbone','bootstrap','text!templates/event-list.html','models/outreach-events','views/eventItemView','views/queryModalView'],
	function($,_,Backbone,bootstrap,eventListTemplate,OutreachEvents,eventItemView,queryModalView){
		var eventListView = Backbone.View.extend({
		el: $("#dashboard"),
		initialize: function(){
			this.$el.html(_.template(eventListTemplate));
			this.event_bus = _({}).extend(Backbone.Events);
			var queryModal = new queryModalView({event_bus:this.event_bus});
			queryModal.render();
			this.outreachevents = new OutreachEvents.collection();
		},
		render: function(){
			var that = this;
			this.outreachevents.fetch({
				success: function(e) {		
					_.each(e.models,function(oe){
						var newItem = new eventItemView({model:oe});
						that.$("#event-list").append(newItem.$el);
					});
					that.listenTo(that.event_bus,'QueryLift',function(ev){
						e.add(ev);
						var newItem = new eventItemView({model:ev});
						that.$("#event-list").append(newItem.$el);
					});
				}
			});
		}

		});
		return eventListView;

	});