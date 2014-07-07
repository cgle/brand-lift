define(['jquery','underscore','backbone'],
	function($,_,Backbone){
		var Media = Backbone.Model.extend({
			defaults: {
				"id": null,
				"user": {},
				"created_time": "",
				"tags": []
			}
		});

		var MediaList = Backbone.Collection.extend({
			model: Media,
			url: "",
			max_id: "",
			initialize: function(attr,opts){
				this.url = "https://api.instagram.com/v1/users/"+opts.user_id+"/media/recent/?access_token=53175277.5b9e1e6.7b2ae2df2569404580f4b628c6851ddc&min_timestamp="+opts.min_timestamp+"&max_timestamp="+opts.max_timestamp+"&max_id="+opts.max_id
			},
			parse: function(res){
				var that = this;
				if (res.pagination) {
					that.max_id = res.pagination.next_max_id;
				}
				return res.data;
			}
		});

		return MediaList;
	});