define(['jquery','underscore','backbone','text!templates/query-lift-modal.html','models/outreach-events'],
	function($,_,Backbone,queryModalTemplate,OutreachEvents){
		var queryModalView = Backbone.View.extend({
			el: $("#query-input"),
			events: {'click #submit-query':'submitQuery'},
			initialize: function(options){this.options = options || {};this.render();},
			render: function(){
				var compiledtemplate = _.template(queryModalTemplate);
				this.$el.html(compiledtemplate);
				this.delegateEvents();
				return this;
			},
			submitQuery: function(){
				var queryEventID = this.$("input#queryeventid").val();
				var queryUserID = this.$("input#queryuserid").val();
				var queryTimestamp = this.$("input#querytimestamp").val();
				var queryTrackperiod = this.$("input#querytrackperiod").val();
				//need fix for trailing comma
				var queryTags = (this.$("input#querytags").val()).toLowerCase().split(/[ ,]+/);
				var newEvent = new OutreachEvents.model({
					event_id:queryEventID,
					user_id:queryUserID,
					timestamp:queryTimestamp,
					track_period:queryTrackperiod,
					tags:queryTags,
				});
				this.options.event_bus.trigger('QueryLift',newEvent);
				$("#query-input").modal('hide');
			}
		});

		return queryModalView;
});