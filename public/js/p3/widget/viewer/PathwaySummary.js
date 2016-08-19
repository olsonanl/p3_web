define([
	"dojo/_base/declare", "dojo/_base/lang", "dojo/dom-construct", "dojo/topic",
	"dijit/layout/ContentPane",
	"./Base", "../PathwaySummaryGridContainer"
], function(declare, lang, domConstruct, Topic,
			ContentPane,
			ViewerBase, GridContainer){
	return declare([ViewerBase], {
		"disabled": false,
		"query": null,
		apiServiceUrl: window.App.dataAPI,

		onSetState: function(attr, oldVal, state){
//			 console.log("PathwaySummary onSetState", state);

			if(!state){
				return;
			}

			var parts = state.pathname.split("/");
			var params = parts[parts.length - 1];

			state.feature_ids = params.split(",");

			this.viewer.set('visible', true);
			this.viewer.set('state', lang.mixin({},state));
		},

		constructor: function(){

			Topic.subscribe("PathwaySummary", lang.hitch(this, function(){
				// console.log("PathwaySummary:", arguments);
				var key = arguments[0], value = arguments[1];

				switch(key){
					case "updateHeader":
						this.totalCountNode.innerHTML = lang.replace('Out of {summary.total} genes selected, {summary.found} genes found in {summary.pathways} pathways', {summary: value});
						break;
					default:
						break;
				}
			}));
		},

		postCreate: function(){
			if(!this.state){
				this.state = {};
			}

			this.inherited(arguments);

			this.viewer = new GridContainer({
				region: "center",
				state: this.state
			});

			this.viewerHeader = new ContentPane({
				content: "",
				"class": "breadcrumb",
				region: "top"
			});
			var headerContent = domConstruct.create("div", {"class": "PerspectiveHeader"});
			domConstruct.place(headerContent, this.viewerHeader.containerNode, "last");
			domConstruct.create("i", {"class": "fa PerspectiveIcon icon-git-pull-request"}, headerContent);
			domConstruct.create("div", {
				"class": "PerspectiveType",
				innerHTML: "Pathway Summary"
			}, headerContent);

			this.queryNode = domConstruct.create("span", {"class": "PerspectiveQuery"}, headerContent);

			this.totalCountNode = domConstruct.create("span", {
				"class": "PerspectiveTotalCount",
				innerHTML: "( loading... )"
			}, headerContent);

			this.addChild(this.viewerHeader);
			this.addChild(this.viewer);
		}
	});
});
