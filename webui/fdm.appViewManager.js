jQuery.namespace("fdm");

fdm.appViewManager = {
	version: 1,
	create: function(){
		var result = _.clone(this);
		result.init();

		return result;
	},
	getDefaultView: function() {
			return {
				version: this.version,
				tagsPanel: {
					visible: true,
					expanded: true,
					selectedTagId: null,
					viewTagId: null
				},
				sharer:{
                    doNotShowAgain: false
				},
				downloads: {
					sortOptions: {
						id: 1,
						sortProp: "createdDate",
						descending: false
					},
					deleteDialogChoice: fdm.models.deleteDialogChoice.notSave,
					deleteDialogCheckbox: 0,
					scheduleTipAlreadyShown: false
				},
				downloadWizard: {
					showTutorial: true,
					notShowTutorialAgainFlag: true,
					basicAuthSaveFlag: true,
					linkCatchingMsgShown: false
					//useBasicAuth: false,
					//basicAuthLogin: '',
					//basicAuthPass: '',
				},
				bottomPanel: {
					height: fdm.viewModels.BottomPanel_MinHeight,
					visible: true,
					tabs: [
						{
							id: fdm.views.BottomPanelTab.General,
							columns: []
						},
						{
							id: fdm.views.BottomPanelTab.Files,
							columns: [
								{id: ".file-name", width: 400},
								{id: ".file-size", width: 120},
								{id: ".file-progress", width: 197},
								{id: ".file-priority", width: 151}
							]
						},
						{
							id: fdm.views.BottomPanelTab.Trackers,
							columns: [
								{id: ".tracker-name", width: 350},
								{id: ".tracker-status", width: 235},
								{id: ".tracker-update-in", width: 145}
							]
						},
						{
							id: fdm.views.BottomPanelTab.Peers,
							columns: [
								{id: ".peer-ip", width: 152},
								{id: ".peer-client", width: 136},
								{id: ".peer-flags", width: 99},
								{id: ".peer-percents", width: 50},
								{id: ".peer-down-speed", width: 101},
								{id: ".peer-up-speed", width: 101},
								{id: ".peer-reqs", width: 50},
								{id: ".peer-downloaded", width: 115},
								{id: ".peer-uploaded", width: 115}
							]
						},
						{
							id: fdm.views.BottomPanelTab.Log,
							columns: [
								{id: ".log-date", width: 103},
								{id: ".log-time", width: 70},
								{id: ".log-information", width: 400}
							]
						}
					]
				},
				speedDialog: {
					downloadSpeedUnit: fdm.models.SizeUnit.Mb,
					uploadSpeedUnit: fdm.models.SizeUnit.Mb
				}
			}
	},
	init: function(){
		var vs = window.fdmApp.readViewState();

		if (vs != null && vs != ""){
			try {

				this._viewState = this.checkViewState(vs);
			}
			catch(e) {
				console.error("fdm.appViewManager.init: "+e);
				this._viewState = this.getDefaultView();
			}
		}
		else{ // set default view settings
			this._viewState = this.getDefaultView();
		}
	},

	checkViewState: function(vs){

		var dvs = this.getDefaultView();

		for (var k in dvs){

			var v = dvs[k];
			if (typeof vs[k] == 'undefined')
				vs[k] = v;
			else{
				for (var i in v){
					if (typeof vs[k][i] == 'undefined')
						vs[k][i] = v[i];
				}
			}
		}

		return vs;
	},

	changesTimeout: 0,
	hasChanges: function(){
		if (this.changesTimeout > 0)
			clearTimeout(this.changesTimeout);

		this.changesTimeout = setTimeout(
			this.store.bind(this),
			1000
		);
	},

	store: function(){
		if(!this._viewState){
			console.error("fdm.appViewManager.store: this._viewState is null.");
			return;
		}

		this.setTagsPanelState();
		this.setDownloadsState();
		this.setSpeedDialogState();

		var vsString = this._viewState;
		if(vsString == null || vsString == ""){
			console.error("fdm.appViewManager.store: this._viewState is null or empty.");
			return;
		}
		window.fdmApp.writeViewState(vsString);
		//localStorage.setItem("viewState", vsString);
	},

	getTagsPanelState: function(){
		return this._viewState.tagsPanel;
	},

	setTagsPanelState: function(){

		this._viewState.tagsPanel.viewTagId = null;
		var view_tag =  app.controllers.tags.model.get('viewTag');
		if (view_tag){
			this._viewState.tagsPanel.viewTagId = view_tag.id;
		}
	},

	getDownloadsState: function(){
		return this._viewState.downloads;
	},

	getDownloadsWizardState: function(){
		return this._viewState.downloadWizard;
	},

	setDownloadsState: function(){

		this._viewState.downloads.sortOptions = window.app.controllers.downloads.model.get('sortOptions');
		this._viewState.downloads.deleteDialogChoice = window.app.controllers.downloads.model.get('deleteDialogChoice');
		this._viewState.downloads.deleteDialogCheckbox = window.app.controllers.downloads.model.get('deleteDialogCheckbox');

	},

	setDownloadsStateOne: function(key, value){

		if (this._viewState.downloads.hasOwnProperty(key))
			this._viewState.downloads[key] = value;

		this.hasChanges();
	},

	getSharerState: function(){

        return this._viewState.sharer;
	},
	setSharerState: function(key, value){

		if (this._viewState.sharer.hasOwnProperty(key))
			this._viewState.sharer[key] = value;

		this.hasChanges();
	},

	getSpeedDialogState: function(){
		return this._viewState.speedDialog;
	},

	setSpeedDialogState: function(){

		//var sdm = window.app.controllers.customSpeedDialog.model;
        //
		//this._viewState.speedDialog = {
		//	downloadSpeedUnit: sdm.get('downloadSpeedUnit'),
		//	uploadSpeedUnit: sdm.get('uploadSpeedUnit')
		//}
	},

	getBottomPanelState: function(){
		return this._viewState.bottomPanel;
	},

	setDownloadsWizardState: function(key, value){

		if (this._viewState.downloadWizard.hasOwnProperty(key))
			this._viewState.downloadWizard[key] = value;

		this.hasChanges();
	},

	setBottomPanelState: function(key, value){

		if (this._viewState.bottomPanel.hasOwnProperty(key))
			this._viewState.bottomPanel[key] = value;

		this.hasChanges();
	}
};