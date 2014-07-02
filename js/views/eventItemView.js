define(['jquery','underscore','backbone','text!templates/event-item.html','models/user','views/liftView','views/sidebarprofileView'],
	function($,_,Backbone,eventItemTemplate,User,liftView, sidebarProfileView){
		var eventItemView = Backbone.View.extend({
			tagName: 'tr',
			events: {'click .showLift': 'showLift'},
			initialize: function(){
				this.initialReportLoad = false,
				this.loadLift = true;
				this.render();
			},
			render: function(){
				var compiledtemplate = _.template(eventItemTemplate,{e:this.model});
				this.setElement(compiledtemplate);
				return this;
			},
			showLift: function(e){
				var that = this;
				var checkProfilePanelClass = $("#user-profile-panel").hasClass(this.model.get("user_id"));
				if (!checkProfilePanelClass) {that.fetchUserProfile();}
				else 
					if (checkProfilePanelClass && that.loadLift) {that.profilepanel.toggle();that.loadLift = false;}
				else {that.profilepanel.toggle();that.loadLift = true;}
				
				if (!that.initialReportLoad){that.fetchLiftReport();that.initialReportLoad = true;that.reportLoaded = true;}
				else 
					if (!that.reportLoaded) {that.lift.show(); that.profilepanel.show(); that.loadLift = false; that.reportLoaded = true;}
				else {that.lift.hide(); that.profilepanel.hide(); that.loadLift = true; that.reportLoaded = false;}


			},
			fetchUserProfile: function(){
				var that = this;
				var u = new User({},{user_id:this.model.get("user_id")});
				u.fetch({
					dataType: 'jsonp',
					success: function(user){
						that.profilepanel = new sidebarProfileView({model:user});
						that.profilepanel.render();
					}
				});				
			},
			fetchLiftReport: function(){
				var that = this;
				that.lift = new liftView({model:this.model});
				$("#lift-event-"+that.model.get("event_id")).html(that.lift.$el);
			}
		});

		return eventItemView;
});