define(['jquery','underscore','backbone','text!templates/event-item.html','models/user','views/liftView','views/sidebarprofileView'],
	function($,_,Backbone,eventItemTemplate,User,liftView, sidebarProfileView){
		var eventItemView = Backbone.View.extend({
			tagName: 'tr',
			events: {
				'click .showLift': 'showLift'
			},
			initialize: function(){
				this.initialReportLoad = false;
				this.reportLoaded = false;
				this.ProfileLoad = false;
				this.render();
			},
			render: function(){
				var compiledtemplate = _.template(eventItemTemplate,{e:this.model});
				this.setElement(compiledtemplate);
				return this;
			},
			showLift: function(e){
				var that = this;
				//bug not fixed: if hide current lift then open new lift 
				//profile panel not load

				var checkSameProfilePanel = $("#user-profile-panel").hasClass("sidebar-" + this.model.get("user_id"));
				if (!checkSameProfilePanel && !that.reportLoaded) {
					that.fetchUserProfile(); 
					that.ProfileLoad = true;
				} else if (checkSameProfilePanel && !that.ProfileLoad && !that.reportLoaded) {
					$(".sidebar-"+that.model.get("user_id")).show();
					that.ProfileLoad = true;
				} else {
					$(".sidebar-"+that.model.get("user_id")).hide();
					that.ProfileLoad = false;
				}

				if (!that.initialReportLoad) {
					that.fetchLiftReport();
					that.initialReportLoad = true;
					that.reportLoaded = true;
				} else if (!that.reportLoaded) {
					that.lift.show();
					that.reportLoaded = true;
				} else {
					that.lift.hide();
					that.reportLoaded = false;
				}
			
				if (that.reportLoaded) {
					$("#liftshow-event-"+that.model.get("event_id")).text('Hide Lift')
				} else {
					$("#liftshow-event-"+that.model.get("event_id")).text('Show Lift')
				}

			},
			fetchUserProfile: function(){
				var that = this;
				var u = new User({},{user_id:this.model.get("user_id")});
				u.fetch({
					dataType: 'jsonp',
					success: function(user){
						that.profilepanel = new sidebarProfileView({model:user});
						that.profilepanel.render();
						$("#loading-sidebar-gif").hide();
						$(".sidebar-"+that.model.get("user_id")).show();
					}
				});				
			},
			fetchLiftReport: function(){
				var that = this;
				that.lift = new liftView({model:this.model});
				$("#lift-event-" + that.model.get("event_id")).html(that.lift.$el);
			}
		});

		return eventItemView;
});