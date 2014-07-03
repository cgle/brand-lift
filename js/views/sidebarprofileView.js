define(['jquery','underscore','backbone','text!templates/sidebar-profilepanel.html'],
	function($,_,Backbone,profilesidebarTemplate){
		var sidebarprofileView = Backbone.View.extend({
			tagName: 'ul',
			el: $("#user-profile-panel"),
			class: function(){return this.model.get("id")},
			initialize: function(){
				this.$el.attr("class","sidebar-"+this.model.get("id"));
				this.render();
			},
			render: function(){
				var compiledtemplate = _.template(profilesidebarTemplate,{user:this.model});
				this.$el.html(compiledtemplate);
				return this;
			},
			show: function(){
				this.$el.show();
			},
			hide: function(){
				this.$el.hide();
			},
			toggle: function(){
				this.$el.toggle();
			}

		});

		return sidebarprofileView;
});