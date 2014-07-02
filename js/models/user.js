define(['jquery','underscore','backbone'],
	function($,_,Backbone){
		var User = Backbone.Model.extend({
			urlRoot: "",
			defaults:{
				"id": null,
				"bio": "",
				"counts": {},
				"website": "",
				"username": "",
				"profile_picture": "",
				"events": []
			},
			initialize: function(attr,opts) {
				this.urlRoot = "https://api.instagram.com/v1/users/"+opts.user_id+"/?client_id=76796b12bd5b48f1a34bfd9dcf3b8cc9"
				//this.urlRoot = "test-user-data.json";
			},
			parse: function(res){
				return res.data;
			}
		});

		return User;
	});