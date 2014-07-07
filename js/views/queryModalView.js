define(['jquery','underscore','backbone','text!templates/query-lift-modal.html','models/outreach-events'],
	function($,_,Backbone,queryModalTemplate,OutreachEvents){
		var queryModalView = Backbone.View.extend({
			el: $("#query-input"),
			events: {
				'click #submit-query':'submitQuery',
				'click .close-query-modal':'closeModal'
			},
			initialize: function(options){this.options = options || {};this.render();},
			render: function(){
				var compiledtemplate = _.template(queryModalTemplate);
				this.$el.html(compiledtemplate);
				this.delegateEvents();
				return this;
			},
			//need fix: click anywhere to reset query form
			closeModal: function(){
				this.render();
				$("#query-input").modal('hide');	
			},
			submitQuery: function(){
				var that = this;
				var query = {
					event_id:this.$("input#queryeventid").val(),
					user_id:this.$("input#queryuserid").val(),
					timestamp:this.$("input#querytimestamp").val(),
					track_period:this.$("input#querytrackperiod").val(),
					tags:(this.$("input#querytags").val()).toLowerCase().split(/[ ,]+/)			
				}

				var newEvent = new OutreachEvents.model(query,{validate:true});
				if (!newEvent.validationError){
					that.options.event_bus.trigger('QueryLift',newEvent);
					that.render();
					$("#query-input").modal('hide');					
				}
				else {
					that.$("#form-error").html(newEvent.validationError);
					that.$("#form-error").show();					
				}
			},

		});

		return queryModalView;
});