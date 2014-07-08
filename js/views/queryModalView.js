define(['jquery','underscore','backbone','text!templates/query-lift-modal.html','models/outreach-events'],
	function($,_,Backbone,queryModalTemplate,OutreachEvents){
		var queryModalView = Backbone.View.extend({
			el: $("#query-input"),
			events: {
				'click #submit-query':'submitQuery',
				'click .close-query-modal':'closeModal'
			},
			initialize: function(options){
				this.options = options || {};
				this.render();
			},
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
					max_id: "999999",
					album_id: this.$("input#queryalbumid").val(),
					track_period: this.$("input#querytrackperiod").val(),
					taglist: (this.$("input#querytags").val()).toLowerCase().split(/[ ,]+/)			
				}
				console.log(query);
				if (query.album_id == "" || query.track_period == "" || query.taglist.length == 0) {
					that.$("#form-error").html("Please fill up the query");
					that.$("#form-error").show();					
				} else {
					that.closeModal();
					that.options.event_bus.trigger('QueryLift',query);						
				}
			},

		});

		return queryModalView;
});