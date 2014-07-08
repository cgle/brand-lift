define(['jquery','underscore','backbone'],
	function($,_,Backbone){
		var OutreachEvent = Backbone.Model.extend({
			defaults: {
				"username": "",
				"user_id": "",
				"timestamp": "",
				"track_period": "",
				"tags": []
			}
		});

		var OutreachEvents = Backbone.Collection.extend({
			model: OutreachEvent,
			url: "http://exposure.getchute.com/offers?scope=accepted&album_id=",
			max_id: "",
			initialize: function(attrs,opts){
				this.album_id = opts.album_id;
				this.taglist = opts.taglist;
				this.track_period = opts.track_period;
				this.url = this.url + this.album_id + "&max_id=" + opts.max_id;
			},
			parse: function(res){
				var that = this;
				if (res.length != 0) {
					var output = [];
					_.each(res,function(r){
						var r_asset = r["asset"];
						output.push({
							album_id: that.album_id,
							id: r["id"],
							timestamp: Date.parse(r["created_at"]),
							user_id: r_asset["uid"],
							username: r_asset["username"],
							provider: r_asset["provider"],
							track_period: that.track_period,
							tags: that.taglist
						});	
					});
					this.max_id = output[output.length-1]["id"];
					return output;
				} else {
					return res;
				}
			}
		});

		return {model:OutreachEvent,collection:OutreachEvents};
	});