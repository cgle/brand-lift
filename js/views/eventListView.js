define(['jquery','underscore','backbone','bootstrap','text!templates/event-list.html','models/outreach-events','views/eventItemView','views/queryModalView'],
	function($,_,Backbone,bootstrap,eventListTemplate,OutreachEvents,eventItemView,queryModalView){
		var eventListView = Backbone.View.extend({
		el: $("#dashboard"),
		events: {
			"keypress #search-query": "onkeypressed",
			"keyup #search-query": "search"
		},
		initialize: function(){
			this.$el.html(_.template(eventListTemplate));
			this.event_bus = _({}).extend(Backbone.Events);
			var queryModal = new queryModalView({event_bus:this.event_bus});
			queryModal.render();
			this.outreachevents = new OutreachEvents.collection();
		},
    onkeypress: function (e) {
	    if (event.keyCode === 13) { // enter key pressed
	       event.preventDefault();
	    }
		},
		//fix: not reload even search results once loaded lift
		search: function(e){
			this.$("#event-list").html("");
			var searchString = this.$("#search-query").val();
			var outputEvents = new OutreachEvents.collection();
			_.each(this.outreachevents.models, function(m){
				if (m.get("event_string").indexOf(searchString) > -1) {
					outputEvents.add(m);
					var newItem = new eventItemView({model:m});
					this.$("#event-list").append(newItem.$el);
				}
			})
		},
		render: function(){
			var that = this;
			this.outreachevents.fetch({
				success: function(e) {		
					_.each(e.models,function(oe){
						var newItem = new eventItemView({model:oe});
						var eventString = [
							oe.get("event_id"),
							oe.get("timestamp"),
							oe.get("track_period"),
							oe.get("user_id"),
							oe.get("username")
						].join(" ");
						//each event is presented by an event string
						oe.set("event_string",eventString);
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