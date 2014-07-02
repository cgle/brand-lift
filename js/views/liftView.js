define(['jquery','underscore','backbone','d3','c3','dateformat','models/lift-data','models/medialist','text!templates/lift-report.html'],
	function($,_,Backbone,d3,c3,dateformat,Lift,MediaList,liftTemplate){
		var liftView = Backbone.View.extend({
			tagName: "div",
			medialist: [],
			events: {"click .export-data": "exportData"},
			initialize: function(){
				this.fetchMediaList("");
				this.render();
				this.delegateEvents();				
			},
			
			render: function(){
				var compiledtemplate = _.template(liftTemplate,{model:this.model,_:_});
				this.setElement(compiledtemplate);
				return this;
			},

			fetchMediaList: function(max_id){
				var that = this;
				var timeperiod = parseInt(this.model.get("track_period"))*24*60*60*1000;
				var mintime = parseInt(this.model.get("timestamp"))*1000 - timeperiod;
				var maxtime = parseInt(this.model.get("timestamp"))*1000 + timeperiod;
				var m = new MediaList({},{user_id:this.model.get("user_id"),min_timestamp:(mintime/1000).toString(),max_timestamp:(maxtime/1000).toString(),max_id:max_id});
				m.fetch({
					dataType: 'jsonp', 
					success: function(media){
						that.medialist = that.medialist.concat(media.models);
						if (m.max_id) {that.fetchMediaList(m.max_id)}
						else 
							{
								that.analyze(that.medialist);
							}
					}
				});
			},
			
			analyze: function(mlist){
				this.setupLifts(mlist);
				this.graphLift(this.handleLift(this.lifts));
			},

			handleLift: function(lifts){
				var data = {};
				_.each(lifts,function(l){
					var count = {};
					_.each(l.get("normalized_time"),function(t){
						var dt = new Date(parseInt(t)*1000);
						dt = dt.format("yyyy-mm-dd");
						if (!count[dt]) {count[dt]=1;} else {count[dt]++}
					});
					data[l.get("tag_name")] = count;
				});
				return data;
			},

			graphLift: function(data){
				//data: {"tag_name": {"timestamp1":count_1,"timestamp2":count_2}}
				var tags = Object.keys(data);
				var counts = {};
				_.each(data,function(v,k){
					counts[k]=[["timestamp-"+k],[k]];
					_.each(v,function(c,t){
						counts[k][1].push(c);
						counts[k][0].push(t);
					});
				});

				//counts["tag_name"] = [["timestamp",t1,t2],["tag_name",count1,count2]]

				//initiate inputs for c3 chart
	    		var xs = {};
	    		var columns = [];
	    		_.each(counts, function(v,k){
	    			xs[k]=v[0][0];
	    			columns.push(v[0]);
	    			columns.push(v[1]);
	    		});

				var chartContainer = '#lift-chart-'+this.model.get("event_id");
				var chart = c3.generate({
				    bindto: chartContainer,
				    data: {
				    	xs: xs,
				    	columns: columns,

				    },
				    axis: {
				        x: {
				            type: 'timeseries',
				            format: '%Y-%m-%d'
				        },
				    }				    
				});
			},

			setupLifts: function(mlist){
				var that = this;
				var lifts = new Lift.collection();
				_.each(mlist,function(media){
					var tags = media.get("tags");
					var timestamp = that.parseDate(media.get("created_time"));
					_.each(tags, function(tag){
						if (_.contains(that.model.get("tags"),tag)){
							if (lifts.where({"tag_name":tag.toLowerCase()}).length==0){
								var newlift = new Lift.model({"tag_name":tag.toLowerCase(),"raw_time":[media.get("created_time")],"normalized_time":[timestamp]});
								lifts.add([newlift]);
							}
							else {
								var l = lifts.findWhere({"tag_name":tag.toLowerCase()});
								l.set("raw_time",l.get("raw_time").concat([media.get("created_time")]));
								l.set("normalized_time",l.get("normalized_time").concat([timestamp]));
							}
						}
					});
				});
				that.lifts = lifts.models;
			},

			parseDate: function(timestamp){
				var d = new Date(parseInt(timestamp)*1000);
				var newD = Date.parse(new Date(d.getFullYear(),d.getMonth(),d.getDate()));
				return (Date.parse(new Date(d.getFullYear(),d.getMonth(),d.getDate()))/1000).toString();
			},

			exportData: function(){
				//pending
			},
			hide: function(){
				this.$el.hide();
			},
			show: function(){
				this.$el.show();
			}	
		});
		return liftView;
});