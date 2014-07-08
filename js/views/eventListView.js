define(['jquery','underscore','backbone','bootstrap','text!templates/event-list.html','models/outreach-events','views/eventItemView','views/queryModalView'],
	function($,_,Backbone,bootstrap,eventListTemplate,OutreachEvents,eventItemView,queryModalView){
		var eventListView = Backbone.View.extend({
		el: $("#dashboard"),
		events: {
			"keypress #search-query": "onkeypressed",
			"keyup #search-query": "search"
		},
		eventlist: [],
		filteredEventList: [],
		UserProviderPair: [],
		initialize: function(){
			var that = this;
			this.render();
			this.fetchEvents("999999","2512962","30",["dasaniwater","dasani","dasanisparkling","sparklewithdasani"]);
			this.event_bus = _({}).extend(Backbone.Events);
			var queryModal = new queryModalView({event_bus:this.event_bus});
			queryModal.render();				
		},
		render: function(){
			this.$el.html(_.template(eventListTemplate));
			return this;
		},
		fetchEvents: function(max_id,album_id,track_period,taglist){
			var that = this;
			var outreachevents = new OutreachEvents.collection({},{
				max_id:max_id,
				album_id:album_id,
				track_period:track_period,
				taglist:taglist
			});
			outreachevents.fetch({
				headers: {
					"Authorization": "Bearer 5521e561a7bc194bf22a3814e9e5beba8749395da7fcf97b6f4cbb5498d18b01"
				},
				success: function(e) {	
				  if (e.models.length != 0) {
				  	that.eventlist = that.eventlist.concat(e.models);
				  	that.fetchEvents(e.max_id,album_id,track_period,taglist);
				  }	else {
				  	that.$("#event-list").html("");
						_.each(that.eventlist,function(oe){
							var pair = {};
							pair[oe.get("username")] = oe.get("provider");
							if (!_.findWhere(that.UserProviderPair,pair)){
								that.UserProviderPair.push(pair);
								var eventString = [
									oe.get("album_id"),
									oe.get("timestamp"),
									oe.get("track_period"),
									oe.get("user_id"),
									oe.get("username"),
									oe.get("provider")
								].join(" ");
								//each event is presented by an event string
								oe.set("event_string",eventString);
								that.filteredEventList.push(oe);
								var newItem = new eventItemView({model:oe});
								that.$("#event-list").append(newItem.$el);
							}
						});
						that.listenTo(that.event_bus,'QueryLift',function(query){
							that.$el.html(_.template(eventListTemplate));
							that.eventlist = [];
							that.filteredEventList = [];
							that.UserProviderPair = [];
							that.fetchEvents(query.max_id,query.album_id,query.track_period,query.taglist);
						});												  	
				  }
				}
			});
		},	
    onkeypress: function (e) {
	    if (event.keyCode === 13) { // enter key pressed
	       event.preventDefault();
	    }
		},
		//fix: not reload even search results once loaded lift
		//to be fixed with exposure integration
		search: function(e){
			var that = this;
			var searchString = this.$("#search-query").val().toLowerCase();
			_.each(that.filteredEventList, function(e){
				var divClass = "." + e.get("username") + "-" + e.get("provider");
				if (e.get("event_string").toLowerCase().indexOf(searchString) == -1) {
					$(divClass).hide();	
				} else {
					$(divClass).show();	
				}
			});
		},

		});
		return eventListView;

	});