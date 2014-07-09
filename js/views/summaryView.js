define(['jquery','underscore','backbone','text!templates/summary-report.html','text!templates/summary-main.html'],
	function($,_,Backbone,summaryTemplate,summaryMainTemplate){
		var summaryView = Backbone.View.extend({
			el: $("#summary-report"),
			events: {
				'click .runReport': 'runReport'
			},
			reportData: [],
			initialize: function(options){
				this.options = options || {};
				$('#user-profile-sidebar').hide();
				this.$el.hide();

				this.render();
			},
			render: function(){
				var compiledtemplate = _.template(summaryTemplate,{model:this.model});
				this.$el.html(compiledtemplate);
				return this;
			},
			runReport: function(){
				$(".runReport").hide();
				$("#summary-content").show();		
				this.listenTo(this.options.event_bus,'doneIndividualReport',function(d){
					this.reportData.push([d.username,d.data,d.tagcount]);
					if (this.reportData.length >= this.model.data.length) {
						this.handleData(this.reportData);
						$("#loading-summary").remove();
						$("#summary-count").html(_.template(summaryMainTemplate,{
							tagcount: this.tagcount
						}));
					}
				});				
				this.options.event_bus.trigger('startReport');			
			},
			handleData: function(reportdata){
				var that = this;
				this.tagcount = {};
				_.each(reportdata, function(r){
					_.each(r[2], function(count, tag){
						if (that.tagcount[tag] == undefined){
							that.tagcount[tag] = {};
							that.tagcount[tag]['before'] = count['before_count'];
							that.tagcount[tag]['after'] = count['after_count'];
							that.tagcount[tag]['total'] = count['total_count'];
						} else {
							that.tagcount[tag]['before'] = that.tagcount[tag]['before'] + count['before_count'];
							that.tagcount[tag]['after'] = that.tagcount[tag]['after'] + count['after_count'];
							that.tagcount[tag]['total'] = that.tagcount[tag]['total'] + count['total_count'];							
						}
					});
				});
				console.log(that.tagcount);
			}
		});

		return summaryView;
});