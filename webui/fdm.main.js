jQuery.namespace("fdm");
jQuery.namespace("fdm.models");

window.fdm.Application = (function () {
	function Application() {
		_.bindAll(this, "closeAllPopups", "closeAllDialogs", "onSwitchToBackgroundHandler", "onAppCloseHandler", "onClickInSystemAreaHandler");

		this.view_models = {};
		this.collections = {};
		this.controllers = {};
		this.states = {
			ScheduleSelectOpened: false
		};
	}

	Application.prototype = {
		initialize: function () {

			// Uncomment following line to wrap native API
			//fdm.ProxyAPI.wrap(window, window, "fdmApp");

			var fdmApi = window.fdmApp;

			this.controllers.settings = new fdm.controllers.Settings();
			this.controllers.settings.initLocalization();

			//this.popupManager = fdm.popupManager.create();
			this.appViewManager = fdm.appViewManager.create();

			this.controllers.scheduleDialog = new fdm.controllers.ScheduleDialog();
			this.controllers.downloadWizard = new fdm.controllers.DownloadWizard(fdmApi.downloadWizard, fdmApi.system);

			var settings = {
				"main-ask-for-shutdown-type": true,
				"behavior-close-as-minimize": true
			};
			//this.controllers.settings = new fdm.controllers.Settings(fdmApi.settings, this.popupManager);
			this.controllers.tags = new fdm.controllers.Tags(fdmApi.tags);

			this.controllers.downloads = new fdm.controllers.DownloadList(fdmApi.downloads, fdmApi.system,
				this.controllers.downloadWizard,
				function(){
					fdmApi.start();
					window.app.controllers.tags.init();
				}
			);
			this.controllers.customSpeedDialog = new fdm.controllers.CustomSpeedDialog(fdmApi, fdmApi.settings, this.controllers.settings);
			this.controllers.bottomPanel = new fdm.controllers.BottomPanel(fdmApi.downloads, this.controllers.downloads);
			//this.controllers.rightPanel = new fdm.controllers.RightPanel(fdmApi.system);
			this.controllers.tagsManageDialog = new fdm.controllers.TagsManageDialog(fdmApi.tags);

			//this.downloadsViewChange = _.debounce(_.bind(function (model, value) {
			//	//this.controllers.rightPanel.setView(value);
			//	this.controllers.bottomPanel.setView(value);
			//}, this), 0);
			//this.controllers.downloads.model.on('change:viewName', this.downloadsViewChange, this);

			// force fire initializing event
			//this.downloadsViewChange(this.controllers.downloads.model, this.controllers.downloads.model.get("viewName"));

			this.controllers.trafficPanel = new fdm.controllers.TrafficPanel(fdmApi, this.controllers.downloads, this.controllers.settings, this.controllers.bottomPanel);
			this.controllers.menu = new fdm.controllers.Menu(fdmApi.menuManager, fdmApi.system);

			this.controllers.updater = new fdm.controllers.Updater(fdmApi.updater);
			this.controllers.adsModal = new fdm.controllers.AdsModal;
			this.controllers.sharer = new fdm.controllers.Sharer;
			this.controllers.bundles = new fdm.controllers.Bundles;

			this.controllers.simpleDialogs = new fdm.controllers.SimpleDialogs();
			this.controllers.calculateChecksumDialog = new fdm.controllers.CalculateChecksumDialog();

            this.mainFrameInFocus = true;

			fdmApi.onSwitchToBackground = this.onSwitchToBackgroundHandler;
			fdmApi.onClose = this.onAppCloseHandler;
			fdmApi.onClickInSystemArea = this.onClickInSystemAreaHandler;

			var r = parseFloat(fdmApp.system.screenDensityFactor());
			if (r && r > 1){
				fdmApp.screenDensityFactor = r;
			}

			document.addEventListener('dragstart', function (e) {
				stopEventBubble(e);
			});
			document.addEventListener('dragenter', function (e) {
				stopEventBubble(e);
			});
			document.addEventListener('dragover', function (e) {
				stopEventBubble(e);
			});
			document.addEventListener('drop', function (e) {
				stopEventBubble(e);
			});

			//var reloadUITimeout = fdmApi.reloadUITimeout;
			//if(reloadUITimeout){
			//	this.reloadTimerId = setTimeout(this.reload.bind(this), 1000 * reloadUITimeout);
			//}

			fdmApi.system.onWindowHeaderMousedown = function(){


			};

			startReactApp();
		},
		//initializePopupManager: function(){
		//	console.log("init popupManager");
		//	$(document).bind("mousedown", {popupManager: app.popupManager}, function($event) {
		//		$event.data.popupManager.onGlobalMouseDownHandler($event);
		//	});
		//	$(document).bind("keydown", {popupManager: app.popupManager}, function($event) {
		//		$event.data.popupManager.onGlobalKeyDownHandler($event);
		//	});
        //
		//	document.addEventListener('keydown', this.globalKeyDown);
        //
		//},
		closeAllPopups: function(){
			//this.popupManager.closeAllPopups();
		},

		closeAllDialogs: function(){
			this.controllers.settings.cancel();
		},

        onSwitchToBackgroundHandler: function(){
console.log("focus lost");
			this.closeAllPopups();
			this.appViewManager.store();
            this.mainFrameInFocus = false;
            this.controllers.downloads.view_model.onFocusLost();
		},
		onAppCloseHandler: function(){
console.log("app close");
			this.appViewManager.store();
		},
        onClickInSystemAreaHandler: function(){
			this.closeAllPopups();
			this.appViewManager.store();
		},
		dispose: function(){
			this.appViewManager.store();
			// var fdmApi = window.fdmApp;
			// fdmApi.onSwitchToBackground = null;
			// fdmApi.onClose = null;
		},
		reload: function(){
			//clearTimeout(this.reloadTimerId);
			//var dwVM = window.app.controllers.downloadWizard.view_model;
			//var sVM = window.app.controllers.settings.view_model;
            //
			//if(!dwVM.isVisible() && !sVM.isVisible() &&
			//	this.popupManager._currentOpened == null){
			//	document.location.reload(true);
			//}
			//else{
			//	this.reloadTimerId = setTimeout(this.reload.bind(this), 1000 * 60 * 5); // wait 5 minutes
			//}
		},
		globalKeyDown: function(e){

			if (e.keyCode == 9){

				FdmDispatcher.handleViewAction({
					actionType: 'TabButton',
					content: {}
				});
				stopEventBubble(e);
			}
		},
        handleKeydown: function(event){

			var ctrlKey = false;
			if (fdmApp.platform === 'mac')
				ctrlKey = event.metaKey;
			else
				ctrlKey = event.ctrlKey;

            var target_input = event.target.nodeName === 'INPUT';

			if ((event.keyCode === 27
					|| ctrlKey && [13,27,32,33,34,35,36,38,40,46,65,86,97].indexOf(event.keyCode) >= 0 )
				&& event.target && target_input)
				return;

			if (app.controllers.tagsManageDialog.model.get('tagFormOpened'))
				return;

            if (app.controllers.customSpeedDialog.model.get('dialogIsShown')) {
                //app.controllers.customSpeedDialog.view_model.handleKeydown.apply(app.controllers.customSpeedDialog.view_model, [null, event]);
            }

			if (fdmApp.platform === 'win'
				&& (event.keyCode === 93 || event.keyCode === 121 && event.shiftKey)){

				var t = document.elementFromPoint(this.lastMouseX, this.lastMouseY);

				var e = new MouseEvent('mousedown', {
					button: 2,
					bubbles: true,
					cancelable: true
				});
				t.dispatchEvent(e);

				e = new MouseEvent('click', {
					button: 2,
					bubbles: true,
					cancelable: true
				});
				t.dispatchEvent(e);

				e = new MouseEvent('contextmenu', {
					button: 2,
					bubbles: true,
					cancelable: true
				});
				t.dispatchEvent(e);
			}

            //else if (app.controllers.tagsManageDialog.view_model.isManagerTagsOpen) {
            //    app.controllers.tagsManageDialog.view_model.handleKeydown.apply(app.controllers.tagsManageDialog.view_model, [null, event]);
            //}
            else if (app.controllers.downloadWizard.model.get('addSourcePageIsShown') || app.controllers.downloadWizard.model.get('sourceInfoPageIsShown')){
                app.controllers.downloadWizard.handleKeydown(event);
            }
			else if (app.controllers.settings.model.get('opened')){

			}
			else if (app.controllers.tags.model.get('showMoreOpened')){

			}
			else if (app.controllers.tags.model.get('statusFilterOpened')){

			}
			else if (app.controllers.scheduleDialog.model.get('dialogOpened')){

			}
			else if (target_input){

			}
            else{

				if (!app.controllers.downloads.model.get('showDeletePopupDialog'))
                	app.controllers.downloads.view_model.handleKeydown.apply(app.controllers.downloads.view_model, [null, event]);
            }

			FdmDispatcher.handleViewAction({
				actionType: 'GlobalKeyDown',
				content: {
					keyCode: event.keyCode
				}
			});
        },
        handleKeyup: function(event){

			app.controllers.downloads.view_model.handleKeyup.apply(app.controllers.downloads.view_model, [null, event]);
        },

		getActiveWindow: function () {

            if (app.controllers.tagsManageDialog.model.get('tagFormOpened'))
            	return 'tagForm';

			if (app.controllers.customSpeedDialog.model.get('dialogIsShown'))
				return 'customSpeedDialog';

            if (app.controllers.downloadWizard.model.get('addSourcePageIsShown') || app.controllers.downloadWizard.model.get('sourceInfoPageIsShown'))
            	return 'downloadWizard';

            if (app.controllers.settings.model.get('opened'))
            	return 'settings';

            if (app.controllers.tags.model.get('showMoreOpened'))
                return 'tags';

            if (app.controllers.tags.model.get('statusFilterOpened'))
                return 'tagForm';

            if (app.controllers.scheduleDialog.model.get('dialogOpened'))
            	return 'scheduleDialog';

            if (app.controllers.downloads.model.get('showDeletePopupDialog'))
            	return 'deletePopupDialog';

            if (app.controllers.downloads.model.get('changeUrlDialogShown'))
            	return 'changeUrlDialog';

            if (app.controllers.downloads.model.get('changePathDialogShown'))
            	return 'changePathDialog';

            if (app.controllers.menu.model.get('opened'))
            	return 'menu';

            return 'main';
        },

		onWindowFocusLost: function(){

			FdmDispatcher.handleViewAction({
				actionType: 'GlobalOnWindowFocusLost',
				content: {}
			});

			if (app.controllers.menu.model.get('opened')){
				app.controllers.menu.closeMenu();
			}

			if (app.controllers.trafficPanel.model.get('speedDialogOpened')){
				app.controllers.trafficPanel.closeSpeedDialog();
			}
		},

		lastMouseX:0,
		lastMouseY:0,
		globalMouseMove: function(e){

			this.lastMouseX = e.pageX;
			this.lastMouseY = e.pageY;
		}
	};

	return Application;
})();

$(window).load(function () {
	window.app = new fdm.Application();
	app.mainFrameInFocus = true;
	return app.initialize();
});

$(window).unload(function () {
	if(window.app){
		// var controllers = window.app.controllers;
		// for(var prop in controllers){
		// 	if (controllers.hasOwnProperty(prop) && _.isFunction(controllers[prop].dispose)){
		// 		controllers[prop].dispose();
		// 	}
		// }
		app.dispose();
	}
});

window.addEventListener('focus', function(){
	app.mainFrameInFocus = true;
	app.controllers.downloads.view_model.onFocus();

	FdmDispatcher.handleViewAction({
		actionType: 'WindowOnFocus',
		content: {}
	});

});
window.addEventListener('blur', function(){

	app.onWindowFocusLost();
	app.mainFrameInFocus = false;
	app.controllers.downloads.view_model.onFocusLost();
	app.controllers.downloads.view_model.closePopupMenu();
});
document.addEventListener('dragenter', function(){

	app.controllers.downloadWizard.onDragEnter();
});

document.addEventListener('mousemove', function(e){

	app.globalMouseMove(e);
});

