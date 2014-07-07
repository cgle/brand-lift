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
				this.urlRoot = "https://api.instagram.com/v1/users/"+opts.user_id+"/?access_token=53175277.5b9e1e6.7b2ae2df2569404580f4b628c6851ddc"
				//this.urlRoot = "test-user-data.json";
			},
			parse: function(res){
				return res.data;
			}
		});

		return User;
	});