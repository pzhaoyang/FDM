jQuery.namespace("fdm.models");
jQuery.namespace("fdm.controllers");
jQuery.namespace("fdm.viewModels");

fdm.controllers.DownloadWizard = (function () {
    // protected core API to add download
    var _apiWizard;
    var _apiSystem;

    function Class(apiWizard, apiSystem) {
	    _apiWizard = apiWizard;
	    _apiSystem = apiSystem;

	    fdm.models.NewDownload = Backbone.Model.extend({
            defaults: {
				hasDownloadInfo: false,
                id: -1,
                source: "",
				rawSource: "",
				downloadInfoErrorMessage: "",
				addSourcePageIsShown: false,
				sourceInfoPageIsShown: false,
				requestingDownloadInfo: false,
				listLinksIsShown: false,
				//showTutorial: false,
				//showLinkCatchingMsg: false,
				onApiOpened: false,
				//tutorialPage: 1,
				//notShowTutorialAgainFlag: true,
                name: "",
                rootPath: "",
                lastFolders: [],
	            targetFolder: null,
	            targetFolderIsValid: true,
	            targetFolderDiscIsFull: true,
	            targetFolderErrorMessage: "",
                user: "",
                password: "",
                size: 0,
				selectedSizeBytes: 0,
	            filesWithoutFolders: "",
                dateFmt: "",
                type: 0,
                checkedFileIndexes: [],
				filesCount: 0,
				viewType: 'single', // or tree
                startable: false,
                hasNotAllowFiles: false,
                checkedNotAllowFiles: false,
                fileTree: new fdm.models.FileTree({type: 'download_wizard'}),
				diskFreeSpace: null,
				isNameFake: false,

	            //defaultFolderSource: fdm.models.NewDownloadDefaultFolder.LastSelected,

				dragNDropInProgress: false,

				showBasicAuthForm: false,
				//useBasicAuth: false,
				basicAuthLogin: '',
				basicAuthPass: '',
				basicAuthSaveFlag: true,

				autostartSupported: false,
				setCatchLinksCheckbox: false,

                duplicateTrtId: false,
				trackers: [],
				previewId: -1,
				thumbCache: 0,

				enableScheduler: false,
				scheduler: false,
                createSubDirectory: true,

				//coreInt: -1
                suggestEquivalent: false
            },
			getThumbnailUrl:function(){

            	if (this.get('listLinksIsShown')){
					var s = Math.ceil(fdmApp.screenDensityFactor * 60);
					var size = '&width=' + s + '&height=' + s + '&borderless=0';
					return 'http://preview/download/?type=batch'+size+'&cache='+this.get('thumbCache');
				}
				else if (this.get('hasDownloadInfo')){
					var s = Math.ceil(fdmApp.screenDensityFactor * 60);
                    var size = '&width=' + s + '&height=' + s + '&borderless=0';
					return 'http://preview/temp/?id='+this.get('previewId')+size+'&cache='+this.get('thumbCache');
				}
				else
					return false;
			}
        });

        _.bindAll(this, 'onRequestDownloadInfoSuccess', 'onRequestDownloadInfoFail', 'onRequestDownloadBaseInfoGot', 'onValidateFolderResult',
	        'onCreateDownloadSuccess', 'onRequestDownloadInfoCancel', 'onApiOpen', 'onApiClose', 'openFolderCallback', 'newDialog',
			'addListLinks', 'applyFilePreview', 'onDefaultTimetableChanged');

		this.model = new fdm.models.NewDownload;

		this.currentScheduleTimetable = new fdm.models.ScheduleTimetable;

        //this.view_model = new fdm.viewModels.DownloadWizard(this, this.model);

		_apiWizard.onRequestDownloadInfoSuccess = this.onRequestDownloadInfoSuccess;
		_apiWizard.onRequestDownloadBaseInfoGot = this.onRequestDownloadBaseInfoGot;
		_apiWizard.onRequestDownloadInfoFail = this.onRequestDownloadInfoFail;
		_apiWizard.onRequestDownloadInfoCancel = this.onRequestDownloadInfoCancel;
		_apiWizard.onCreateDownloadSuccess = this.onCreateDownloadSuccess;

		_apiWizard.addListLinks = this.addListLinks;

		//_apiWizard.onCreateDownloadFail = this.onCreateDownloadFail;
		_apiWizard.onOpen = this.onApiOpen;
		_apiWizard.onClose = this.onApiClose;

		_apiWizard.newDialog = this.newDialog;
		_apiWizard.onDefaultTimetableChanged = this.onDefaultTimetableChanged;

		_apiWizard.addEventListener("onItemThumbnailChanged", this.applyFilePreview);

		//_apiSystem.addEventListener("onThumbnailGenerated", this.applyFilePreview);
		_apiSystem.addEventListener("openFolderCallback", this.openFolderCallback);

	    this.model.on("change:targetFolder", this.onChangeTargetFolder, this);
	    this.model.on("change:name change:createSubDirectory", this.onChangeName, this);
		//this.model.on('change:source', function () {
        //
		//	var value = this.model.get('source');
        //
		//	if (value != null && value != "") {
		//		this.loadDownloadInfo();
		//	}
		//}, this);

		this.needCreateDownloadWhenRequestIsDone = false;

		this.startApiUrl = {};

		this.dispatcherIndex = FdmDispatcher.register(function(payload) {

			if (payload.source == 'VIEW_ACTION'){
				if (payload.action.actionType == 'WindowOnFocus')
					this.windowOnFocus();
			}

			return true; // No errors. Needed by promise in Dispatcher.
		}.bind(this));
    }

    Class.prototype = {

        updateAllowedFileSizeInterval: 0,

		onDefaultTimetableChanged: function(json_str){

			var json = JSON.parse(json_str);

			if (json.default_timetable)
				this.currentScheduleTimetable.set(json.default_timetable);
		},

		applyFilePreview: function(){

			this.model.set("thumbCache", this.model.get('thumbCache') + 1);
		},

		newDialog: function(download_map, dialog_map){

			var download =JSON.parse(download_map);
			var dialog =JSON.parse(dialog_map);

			if (!download.id || !dialog.type)
				return;

            this.closePopups();

			if (dialog.type == 'error'){

				if ( (this.model.get('addSourcePageIsShown') || this.model.get('sourceInfoPageIsShown'))
					&& download.id != this.model.get('id') ) {

					_apiWizard.cancelCreation(download.id, download.url, false);
					return;
				}

				this.model.set({
					rawSource: download.url,
					coreInt: download.id,
					id: download.id
				});

				this.startApiUrl = {};
				this.startApiUrl[download.id] = 'all';

				this.onRequestDownloadInfoFail(-1, download.error, dialog.authRequired, download.login, download.pass);
			}

			if (dialog.type == 'add_trackers'){

				if ( (this.model.get('addSourcePageIsShown') || this.model.get('sourceInfoPageIsShown'))
					&& download.id != this.model.get('id') ) {

					if (download.id >= 0 && download.duplicateTrtId >= 0 && download_info.trackers)
						_apiWizard.addTrackers(download.id, download.duplicateTrtId, download_info.trackers);

					_apiWizard.cancelCreation(download.id, download.url, false);
					return;
				}

				var download_info = _.extend(download, dialog);

				this.model.set({
					id: download.id,
					source: download.url,
                    duplicateTrtId: download.duplicateTrtId,
					trackers: download_info.trackers,
					sourceInfoPageIsShown: 1
				});
			}
		},

		windowOnFocus: function(){

			if (this.model.get('sourceInfoPageIsShown'))
				this.setValidateAllTimeout();
		},

		onApiOpen: function(url, core_int){

			this.closePopups();

			core_int = parseInt(core_int);

			if (this.model.get('addSourcePageIsShown') && this.model.get('rawSource') == url)
				return;

			//if (this.isVisible() && this.model.set('requestingDownloadInfo'))
			//	return;

			//var view_state = window.app.appViewManager.getDownloadsWizardState();
			this.model.set({
				//showTutorial: view_state.showTutorial,
				//notShowTutorialAgainFlag: view_state.notShowTutorialAgainFlag,
				//tutorialPage: 1,
				onApiOpened: true
			});

			if(!url || url.length == 0){
				console.warn("downloadWizard.onOpen event is called with empty arguments");
			}

			this.startApiUrl = {};
			this.startApiUrl[core_int] = url;

			this.newDownload(url, core_int);
			this.createSource(core_int);
		},
		onApiClose: function(){
			this.cancel();
		},

		onDragEnter: function(){

			if (this.model.get('sourceInfoPageIsShown')
				|| this.model.get('addSourcePageIsShown') && this.model.set('requestingDownloadInfo'))
				return;

			this.model.set({dragNDropInProgress: true});
			this.newDownload("");
		},

		onDragLeave: function(){

			this.model.set({dragNDropInProgress: false});
			this.cancel();
		},

		newDownload: function(rawSource, core_int){

			if (typeof core_int == 'undefined')
				core_int = -1;

			//TODO: external controller call should be removed
			//app.closeAllDialogs();
			app.controllers.customSpeedDialog.close();

			FdmDispatcher.handleViewAction({
				actionType: 'newDownload',
				content: {}
			});

			// reset some internal values
			this.model.set({
					targetFolderDiscIsFull: false,
					targetFolderIsValid: true
				});

			// TODO: Temporary commented because users cannot understand the conception
			if(rawSource == undefined)
			{
				var text = window.fdmApp.system.getClipboardText();
				if(text != undefined)
				{
					var dldType = fdm.urlUtils.getDownloadType(text);
					if (dldType != -1 && (dldType != fdm.models.DownloadType.Trt || fdm.urlUtils.isMagnetLink(text)))
					{
						this.addDownload(text, core_int);
						return;
					}
				}
			}

			this.addDownload(rawSource, core_int);
		},

		addDownload: function(rawSource, core_int){

			if (typeof core_int == 'undefined')
				core_int = -1;

			//this.createDownloadInProgress = false;
			this.needCreateDownloadWhenRequestIsDone = false;

			rawSource = rawSource || "";

			var options = {
				rawSource: rawSource,
				addSourcePageIsShown: true,
				downloadInfoErrorMessage: '',
				//coreInt: core_int
				id: core_int
			};

			options.showBasicAuthForm = false;
			//options.useBasicAuth = false;
			options.basicAuthLogin = '';
			options.basicAuthPass = '';
			options.basicAuthSaveFlag = true;

			this.model.set(options);
			app.controllers.downloads.view_model.onFocusLost();

			_.defer(function(){
				var element = document.getElementById('rawSource');
				if (element){
					element.focus();
					fdm.htmlUtils.setCaretPosition(element, rawSource.length);
				}
			});
		},

        applySource: function () {

			//if (this.model.get('basicAuthSaveFlag')){
			//	app.appViewManager.setDownloadsWizardState('useBasicAuth', this.model.get('useBasicAuth'));
			//	app.appViewManager.setDownloadsWizardState('basicAuthLogin', this.model.get('basicAuthLogin'));
			//	app.appViewManager.setDownloadsWizardState('basicAuthPass', this.model.get('basicAuthPass'));
			//	app.appViewManager.setDownloadsWizardState('basicAuthSaveFlag', true);
			//}
			//else{
			//	app.appViewManager.setDownloadsWizardState('useBasicAuth', false);
			//	app.appViewManager.setDownloadsWizardState('basicAuthLogin', '');
			//	app.appViewManager.setDownloadsWizardState('basicAuthPass', '');
			//	app.appViewManager.setDownloadsWizardState('basicAuthSaveFlag', false);
			//}

			//app.appViewManager.setDownloadsWizardState('showTutorial', false);

			if (this.model.get('requestingDownloadInfo'))
			{
                this.createDownload();
                // if (this.model.get('setCatchLinksCheckbox'))
                 //    app.controllers.settings.saveSetting('monitoring-silent', true);
				//
				// this.createDownloadByEnter();
            }
			else
            	this.createSource();
        },

        createSource: function (core_int) {

			var rawSource = this.model.get('rawSource');

			if (typeof core_int == 'undefined')
				core_int = this.model.get('id');

			if (rawSource != null && rawSource != "") {

				//this.model.set({
				//	source: rawSource,
				//	requestingDownloadInfo: true
				//});

				this.loadDownloadInfo(rawSource, core_int);

				app.controllers.downloads.view_model.onFocusLost();
				if(fdm.urlUtils.isMagnetLink(this.model.get('source')))
				{
					//this.forceLoadFolders(fdm.models.DownloadType.Trt);
					//this.validateAllPromise()
					//	.catch(console.error.bind(console));
				}
			}
        },

		createDownloadByEnter: function(){

			console.error('createDownloadByEnter')

			if ((this.model.get('id') == -1 || this.model.get('name') == '')
				&& (!fdm.urlUtils.isMagnetLink(this.model.get('source'))))
				this.needCreateDownloadWhenRequestIsDone = true;
			if (this.model.get('suggestEquivalent') > 0)
				this.resumeDownload();
			else
				this.createDownloadAfterCheck();
		},

		loadDownloadInfo: function (source, core_int) {

			if (!core_int && core_int !== 0)
				core_int = -1;

			if (false && core_int >= 0 && this.startApiUrl
				&& typeof this.startApiUrl[core_int] != 'undefined'
				&& source != this.startApiUrl[core_int] && this.startApiUrl[core_int] != 'all'){

				core_int = -1;
				_apiWizard.cancelCreation(this.model.get("id"), this.model.get("source"), false);
				this.startApiUrl = {};
			}
			else if (false && core_int >= 0 && (!this.startApiUrl || typeof this.startApiUrl[core_int] == 'undefined')){

				core_int = -1;
			}
			else if(this.model.get("id") != -1){
				// cancel previous request
				console.log("cancelCreation begin. id = %o.", this.model.get("id"));
				//_apiWizard.cancelCreation(this.model.get("id"), this.model.get("source"), true);
			}
			//else{
			//	this.model.set(this.model.defaults, {silent: true});
			//}

			var user = '';
			var pass = '';
			var save = false;
			var showBasicAuthForm = false;
			if (this.model.get('showBasicAuthForm')){
				user = this.model.get('basicAuthLogin');
				pass = this.model.get('basicAuthPass');
				save = this.model.get('basicAuthSaveFlag');
				showBasicAuthForm = true;
			}

	        var id = _apiWizard.requestDownloadInfo(
				source,
				user,
				pass,
				save,
				showBasicAuthForm,
				core_int
	        );
            this.model.set({
				id: id,
				source: source,
				requestingDownloadInfo: true
				//sourceInfoPageIsShown: true
			});
			console.log("requestDownloadInfo end. id after = %o.", this.model.get("id"));
        },

	    onRequestDownloadBaseInfoGot: function (requestId, downloadInfo, preview_id) {

			this.closePopups();

			if (typeof downloadInfo == 'string')
				downloadInfo = JSON.parse(downloadInfo);

			if (downloadInfo.silent){

				this.onCreateDownloadSuccess();
				return;
			}

			downloadInfo.previewId = preview_id;

		    var downloadInfoModel = {};
		    // copy download info to temporary object to avoid deep copy/comparison of complex "files" property.
		    for (var prop in downloadInfo) {
			    if (downloadInfo.hasOwnProperty(prop) && (prop !== "files" && prop !== "autoDetectedFolder")) {
				    downloadInfoModel[prop] = downloadInfo[prop];
			    }
		    }
			downloadInfoModel.addSourcePageIsShown = false;
			downloadInfoModel.sourceInfoPageIsShown = true;
			downloadInfoModel.requestingDownloadInfo = false;
			downloadInfoModel.targetFolder = downloadInfo.autoDetectedFolder;

			downloadInfoModel.startable = true;
			downloadInfoModel.targetFolderIsValid = true;

		    this.model.set(downloadInfoModel);

			//this.forceLoadFolders(fdm.models.DownloadType.Trt);
	    },

		closePopups: function(){

			if (app.controllers.menu.model.get('opened'))
				app.controllers.menu.closeMenu();

            app.controllers.sharer.needClosedDialog();
            app.controllers.bundles.needClosedDialog();
		},

		addListLinks: function(requestId, downloadInfo){

			this.model.set({id: requestId});

			if (typeof downloadInfo == 'string')
				downloadInfo = JSON.parse(downloadInfo);

			downloadInfo.listLinksIsShown = true;
			downloadInfo.filesCount = downloadInfo.files.length;

			this.onRequestDownloadInfoSuccess(requestId, downloadInfo);
		},

	    onRequestDownloadInfoSuccess: function (requestId, downloadInfo, preview_id) {

			this.closePopups();

			if (typeof downloadInfo == 'string')
				downloadInfo = JSON.parse(downloadInfo);

			if (requestId != this.model.get('id') && !(this.model.get('id') < 0 && downloadInfo.suggestEquivalent > 0)) {

				console.error('onRequestDownloadInfoSuccess. Id not match!', requestId, this.model.get('id'));
				return;
			}

			downloadInfo.previewId = preview_id;

			if (downloadInfo.silent){

				this.onCreateDownloadSuccess();
				return;
			}

			var core_autostart = downloadInfo.autostart;

		    var downloadInfoModel = {
				hasDownloadInfo: true,
				downloadInfoErrorMessage: ""
			};
            // copy download info to temporary object to avoid deep copy/comparison of complex "files" property.
            for (var prop in downloadInfo) {
                if (downloadInfo.hasOwnProperty(prop) && (prop !== "files" && prop !== "autoDetectedFolder")) {
                    downloadInfoModel[prop] = downloadInfo[prop];
                }
            }

			downloadInfoModel.addSourcePageIsShown = false;
			downloadInfoModel.sourceInfoPageIsShown = true;
			downloadInfoModel.requestingDownloadInfo = false;
			downloadInfoModel.targetFolder = downloadInfo.autoDetectedFolder;

            this.model.set(downloadInfoModel);

		    // for magnet folder is loaded already
		    //if(!fdm.urlUtils.isMagnetLink(this.model.get("source")))
		    //{
		    //    this.setTargetFolder(downloadInfo.autoDetectedFolder);
		    //}

		    var fileTree = downloadInfo.files;

            var trees = {
                downloadId: requestId,
                name: 'root',
                children: [],
                type: 'download_wizard'
            };

            if (fileTree.length){
                trees.children = fileTree;
            }

			var new_tree;
			if (this.model.get("type") == fdm.models.DownloadType.YouTubeVideo)
				new_tree = new fdm.models.YoutubeFileTree(trees);
			else
				new_tree = new fdm.models.FileTree(trees);
			new_tree.refreshTreeNodeState(new_tree);

			if (new_tree._children.models.length
				&& (new_tree._children.models.length > 1 || new_tree._children.models[0]._children.models.length))
				this.model.set("viewType", 'tree');
			else
				this.model.set("viewType", 'single');

            this.model.set("fileTree", new_tree);

			var filesWithoutFolders = downloadInfo["filesCount"];

			this.model.set("filesWithoutFolders", filesWithoutFolders);

			this.validateAllPromise()
				.then(function(){

					if (core_autostart && !this.model.get('startable'))
						_apiWizard.autostartFailed();

					if ( this.model.get('startable')
						&& (this.needCreateDownloadWhenRequestIsDone == true || core_autostart))
						this.createDownload();

				}.bind(this))
				.catch(console.error.bind(console));

			this.updateAllowedFileSizeInterval = setInterval(function(){

				if (this.model.get('sourceInfoPageIsShown'))
				{
                    this.validateFolderPromise()
                        .then(this.onValidateFolderResult.bind(this));
				}
			}.bind(this), 5000);

        },

        onRequestDownloadInfoFail: function (requestId, errorText, need_basic_auth, login, pass) {

            var source = this.model.get("source");
			if (source == '')
				source = this.model.get("rawSource");
			var core_int = this.model.get("id");

            //this.cancel(false, true);
            //if (this.model.get("id") != -1)
            //	this.cancelCreation(false, true);

			if(this.model.get("id") != -1 && !need_basic_auth){
				// cancel previous request
				console.log("cancelCreation begin. id = %o.", this.model.get("id"));
				//_apiWizard.cancelCreation(this.model.get("id"), this.model.get("source"), true);
			}

			this.addDownload(source);


			var changes = {
				downloadInfoErrorMessage: errorText,
				requestingDownloadInfo: false,
				id: core_int
			};
			if (need_basic_auth){
				changes.showBasicAuthForm = true;

				var view_state = window.app.appViewManager.getDownloadsWizardState();
				changes.basicAuthSaveFlag = view_state.basicAuthSaveFlag;
				changes.basicAuthLogin = login;
				changes.basicAuthPass = pass;
			}

			this.model.set(changes);

			console.error("Download info request is failed. Arguments: %o", arguments);

			if (need_basic_auth){
				_.defer(function(){
					var element = document.getElementById('basic_auth_login');
					if (element){
						element.focus();
						fdm.htmlUtils.setCaretPosition(element, element.value.length);
					}
				});
			}
        },

		onRequestDownloadInfoCancel: function (requestId) {
			if(this.model.get("id") == requestId){
				// if no new requests, release dialog
				this.cancel(false, false);
			}
		},

		//applyFilePreview: function(target, itemId, imagePath, w, h, forced, payload){
		//	if(target !== "downloadWizard") return;
		//	if(typeof payload == "string" && payload != ""){
		//		$("#"+payload).attr('src', imagePath);
		//	};
		//},

	    onValidateFolderResult: function(serialized){

			var isValid = serialized[0];
			var errorMsg = serialized[1];

			var size = this.model.get("size");
			var type = this.model.get("type");
            var selectedSizeBytes = this.model.get("selectedSizeBytes");
			var disk_free_space = 0;
			var disc_is_full = false;
			if(isValid && size > 0){
				var availSize = window.fdmApp.system.calcDiskFreeSpace(this.model.get("targetFolder"));
				if (availSize && (availSize > 0 || availSize < 0)){
					disk_free_space = availSize;
					if(selectedSizeBytes > 0 && selectedSizeBytes > availSize){
						disc_is_full = true;
					}
				}
			}

		    this.model.set({
                targetFolderIsValid: isValid && !disc_is_full,
			    // targetFolderIsValid: isValid,
			    targetFolderErrorMessage: errorMsg,
				diskFreeSpace: disk_free_space,
				targetFolderDiscIsFull: disc_is_full
		    });
	    },

        onMaximumAllowedFileSizeResult: function(maximum_file_size){

            var tree = this.model.get('fileTree');
            tree.setMaxAllowSize.apply(tree, [maximum_file_size]);
            this.updateFilesState().then(function () {
                this.model.trigger('change:fileTree');
            }.bind(this));
	    },

	    validateFolderWithCallback: function (folder, callbackFunction, bCreatePathIfDoesNotExist) {
			_apiSystem.validateFolder(folder, this.model.get("name"), bCreatePathIfDoesNotExist, this.model.get("isNameFake"), function(serialized){
				var args = serialized;
				callbackFunction.apply(this, args);
			}.bind(this));
	    },

		validateFolder: function(folder){
			_apiSystem.validateFolder(folder, this.model.get("name"), false, this.model.get("isNameFake"), function(serialized){
				var args = serialized;
				this.onValidateFolderResult.apply(this, [args]);
			}.bind(this));
		},

		validateFolderPromise: function(){

			var folder = this.model.get("targetFolder");
			var name = this.model.get("name");

			var is_name_fake = this.model.get("isNameFake");

            // if (this.model.get('listLinksIsShown') && !this.model.get('createSubDirectory'))
            // {
            //     name = '';
            //     is_name_fake = true;
            // }

            return new Promise(function(resolve, reject) {

				if (folder === null)
					resolve([false, '']);
				else if (folder === "")
					resolve([false, __('Selected filepath is not valid.')]);
				else{
					_apiSystem.validateFolder(folder, name, false, is_name_fake, function(serialized){
						resolve(serialized);
					}.bind(this));
				}

            });
		},

        calcSizeOnDiskForSelectionPromise: function () {

            var folder = this.model.get("targetFolder");
            var requestId = this.model.get('id');
            var ids = this.getCheckedFileIndexes();

            return new Promise(function(resolve, reject) {

                _apiWizard.calcSizeOnDiskForSelection( {
                    id: requestId,
                    path: folder,
                    ids: ids
				}, function(serialized){
                    resolve(serialized);
                }.bind(this));
            });
			
        },

        getMaximumAllowedFileSize: function(folder){
			_apiSystem.getMaximumAllowedFileSize(folder, function(maximum_file_size){
				this.onMaximumAllowedFileSizeResult.apply(this, [maximum_file_size]);
			}.bind(this));
		},

        getMaximumAllowedFileSizePromise: function(){

			var folder = this.model.get("targetFolder");

            return new Promise(function(resolve, reject) {

                _apiSystem.getMaximumAllowedFileSize(folder, function(maximum_file_size){

                    resolve(maximum_file_size);

                }.bind(this));

            });
		},

        //selectFile: function () {
        //    var filePath = _apiSystem.openFileDialog();
        //    if (filePath && filePath != "") {
        //        this.model.set("source", filePath);
        //    }
        //},

        //setTargetFolder: function (autoDetectedFolder) {
        //
		//	switch (this.model.get("defaultFolderSource")){
		//		case fdm.models.NewDownloadDefaultFolder.NotSet:
		//		case fdm.models.NewDownloadDefaultFolder.AutoDetected:
		//		case fdm.models.NewDownloadDefaultFolder.Monitoring:
		//			if(autoDetectedFolder != null && autoDetectedFolder != ""){
		//				this.model.set("targetFolder", autoDetectedFolder);
		//				break;
		//			}
		//			// by default - set last folder
		//			console.warn("Target folder is not detected automatically for '%o'", this.model.get("source"));
		//		case fdm.models.NewDownloadDefaultFolder.LastSelected:
		//			var lastFolders = this.model.get("lastFolders");
		//			var lastSelectedFolder = lastFolders.length ? lastFolders[0] : "";
		//			if(lastSelectedFolder && lastSelectedFolder != ""){
		//				this.model.set("targetFolder", lastSelectedFolder);
		//				break;
		//			}
		//			// by default - set system folder
		//			console.warn("Last folder is empty for '%o'", this.model.get("source"));
		//		case fdm.models.NewDownloadDefaultFolder.System:
		//			this.model.set("targetFolder", window.fdmApp.system.getDefaultTargetFolder());
		//			break;
		//		default:
		//			console.error("Unknown default folder source in the settings '%o'", this.model.get("defaultFolderSource"));
		//	}
		//},

		validateFolderTimeout: false,

		onChangeTargetFolder: function(model, value){

			this.setValidateAllTimeout();
		},

		onChangeName: function(model, value){

			this.setValidateAllTimeout();
		},

		//closeAutomaticLinkCatchingMsg: function(){
        //
		//	app.appViewManager.setDownloadsWizardState('linkCatchingMsgShown', true);
		//	this.model.set({
		//		onApiOpened: false,
		//		showLinkCatchingMsg: false
		//	});
		//	this.cancel(true, false);
		//},

		addTrackers: function(){

			var dataModel = this.model;
            var requestId = dataModel.get('id');
            var trackers = dataModel.get('trackers');
            var duplicateId = dataModel.get('duplicateTrtId');

			// if (requestId >= 0 && duplicateId >= 0 && trackers.length)
			_apiWizard.addTrackers(requestId, duplicateId, trackers);

			dataModel.set(dataModel.defaults);
			this.close();

            app.controllers.downloads.view_model.doAfterTrackersAdding(duplicateId);
		},

		setValidateAllTimeout: function(){
			if (this.validateFolderTimeout)
				clearTimeout(this.validateFolderTimeout);

			this.validateFolderTimeout = setTimeout(function(){

				this.validateAllPromise();

				//var folder = this.model.get("targetFolder");
				//var name = this.model.get("name");
                //
				//if (folder !== null && name !== null){
				//	this.validateFolder(folder);
				//	this.getMaximumAllowedFileSize(folder);
				//}

			}.bind(this), 1000);
		},

		openFolderDialog: function () {

            _apiSystem.openFolderDialog( this.model.get("targetFolder"), 'download-wizard' );
        },

		openFolderCallback: function (targetFolder, flag) {

			if (flag == 'download-wizard')
			{
				//var prevTargetFolder = this.model.get("targetFolder");
				if (targetFolder == null || targetFolder == "") {
					console.warn("openFolderDialog: openFolderDialog returned '%o'", targetFolder);
					return;
				}
				this.model.set({
					targetFolder: targetFolder,
					targetFolderIsValid: true,
					targetFolderErrorMessage: "",
					targetFolderDiscIsFull: false
				});
				//if ( prevTargetFolder == targetFolder ){
				this.validateFolder( targetFolder );
				this.getMaximumAllowedFileSize(targetFolder);
				//}
			}
        },

		createDownloadInProgress: 0,
		createDownloadAfterCheck: function(){

			var time = (+ new Date);
			if (this.model.get('id') == -1 || this.createDownloadInProgress && time - this.createDownloadInProgress <= 2)
				return;

			this.createDownloadInProgress = time;

			this.validateAllPromise()
				.then(function(){

					this.createDownloadInProgress = false;
					if (this.model.get("startable")){

						this.createDownload();
						if (this.model.get('setCatchLinksCheckbox'))
							app.controllers.settings.saveSetting('monitoring-silent', true);
					}

				}.bind(this))
				.catch(console.error.bind(console));
		},

        resumeDownload: function () {

			var map = {
				requestId: this.model.get('id'),
				downloadId: this.model.get('suggestEquivalent'),
                destinationFolder: this.model.get('targetFolder'),
                filename: this.model.get('name'),
			};

            var time = (+ new Date);
            if (this.model.get('id') == -1 || this.createDownloadInProgress && time - this.createDownloadInProgress <= 2)
                return;

            this.createDownloadInProgress = time;

            this.validateAllPromise()
                .then(function(){

                    this.createDownloadInProgress = false;
                    if (this.model.get("startable")){

                        _apiWizard.resumeDownload(map);
                        this.onCreateDownloadSuccess();
                        app.controllers.downloads.view_model.doAfterTrackersAdding(map.downloadId);
                    }

                }.bind(this))
                .catch(console.error.bind(console));
        },

		validateAllPromise: function(){

			return this.getMaximumAllowedFileSizePromise()
				.then(this.onMaximumAllowedFileSizeResult.bind(this))
				.then(this.validateFolderPromise.bind(this))
				.then(this.onValidateFolderResult.bind(this))
				.then(this.setStartable.bind(this));

		},

		setStartable: function(){

			var startable = true;
			if (!this.model.get('targetFolderIsValid')
				|| this.model.get('downloadInfoErrorMessage').length
				|| this.model.get('type') == fdm.models.DownloadType.Trt
					&& this.model.get('filesCount') > 1
					&& this.model.get('selectedSizeBytes') == 0
			){
				startable = false;
			}

			if (startable && this.model.get("listLinksIsShown")){

				var selected_urls = this.getCheckedFileIndexes();
				if (!selected_urls || !selected_urls.length)
					startable = false;
			}

			this.model.set({startable: startable});
		},

        createDownload: function () {

			app.closeAllDialogs();

			var type = this.model.get("type");
			var list_links = this.model.get("listLinksIsShown");

			var tags = [];

			var name = this.model.get("name");
            // if (this.model.get('listLinksIsShown') && !this.model.get('createSubDirectory'))
            // {
            //     name = '';
            // }

			if (list_links){

				var downloadInfo = {
					autoDetectedFolder: this.model.get("targetFolder"),
					files: this.model.get('fileTree').buildCheckedUrlsData(),
					selectedIds: this.getCheckedFileIndexes(),
					name: name
				};

				if (this.model.get('enableScheduler')){

                    var scheduler_json = this.model.get('scheduler').toJSON();
                    var days = scheduler_json.data.daysEnabled;

                    if ((days[1] + days[2] + days[3] + days[4] + days[5] + days[6] + days[7]) > 0)
						downloadInfo.scheduler = scheduler_json;
				}

				_apiWizard.downloadListLinks(
					this.model.get("id"),
					downloadInfo
				);

				this.onCreateDownloadSuccess();
				return;
			}

            var selectedIds = type == fdm.models.DownloadType.YouTubeVideo ||
							type == fdm.models.DownloadType.FlashVideo ||
							type == fdm.models.DownloadType.Trt || list_links
							? this.getCheckedFileIndexes() : []/*null*/;

			var scheduler = '';
			if (this.model.get('enableScheduler')){

				var scheduler_json = this.model.get('scheduler').toJSON();
				var days = scheduler_json.data.daysEnabled;

				if ((days[1] + days[2] + days[3] + days[4] + days[5] + days[6] + days[7]) > 0)
					scheduler = scheduler_json;
			}

            _apiWizard.createDownload(
				this.model.get("id"),
				this.model.get("source"),
				this.model.get("targetFolder"),
                name,
				tags,
	            selectedIds,
				this.model.get("filesCount") > 0,
				scheduler
	            //_.partial(this.onCreateDownloadSuccess, successFn),
	            //this.onCreateDownloadFail
			);
        },

	    onCreateDownloadSuccess: function (/*successFn*/) {
		    var dataModel = this.model;
		    dataModel.set(dataModel.defaults);
		    //successFn();
			this.close();
	    },

		selectByDragDrop: function (_source) {

            if (_source != null && _source != "") {
                this.model.set("rawSource", _source);
            }
			this.createSource();
        },

        cancelCreation: function (allRequests, stopPropagation) {
			console.log("cancelCreation begin. id = %o", this.model.get("id"));
			if (this.model.get("id") >= 0){
				_apiWizard.cancelCreation(
					this.model.get("id"),
					stopPropagation ? this.model.get("source"): this.model.get("rawSource"),
					stopPropagation);
			}

			this.model.set(this.model.defaults);
            this.close();
        },

        addDownloadFromTrtFile: function (_source) {

			//this.model.set({
			//	showTutorial: false,
			//	notShowTutorialAgainFlag: true,
			//	tutorialPage: 1
			//});

            this.addDownload(_source);
            this.createSource();
        },

		/*
        prepareURL: function(url){
            return _apiWizard.getPreparedURL( url );
        },
        */

	    //forceLoadFolders: function(downloadType){
		 //   var lastFolders = _apiWizard.getLastFolders();
         //   if (typeof lastFolders == 'string')
         //       lastFolders = [lastFolders];
		 //   this.model.set("lastFolders", lastFolders);
		 //   var defaultFolder = _apiWizard.getFolderForDownloadType(downloadType);
		 //   this.setTargetFolder(defaultFolder);
	    //},

		getClipboardText: function(){

		   return _apiSystem.getClipboardText();
	    },

        updateFilesState: function(){
            var file_tree = this.model.get('fileTree');
            var tree_state = file_tree.getCurrentState.apply(file_tree);

            return this.calcSizeOnDiskForSelectionPromise().then(function(result){
                this.model.set({
                    selectedSizeBytes: result,
                    checkedNotAllowFiles: tree_state['checked_not_allowed_size']
                });
			}.bind(this));

            // this.model.set({
				// selectedSizeBytes: tree_state['checked_size'],
				// checkedNotAllowFiles: tree_state['checked_not_allowed_size']
            // });
        },

		close: function () {

			this.model.set({
				addSourcePageIsShown: false,
				sourceInfoPageIsShown: false,
				dragNDropInProgress: false
			});

			app.controllers.downloads.view_model.onFocus();
			//fdm.htmlUtils.lostFocus();// lost focus targetFolder
			_.defer(function(){
				app.controllers.downloads.view_model.onFocus();
				//fdm.htmlUtils.lostFocus();// lost focus targetFolder
			});

            if (this.updateAllowedFileSizeInterval)
            {
                clearInterval(this.updateAllowedFileSizeInterval);
                this.updateAllowedFileSizeInterval = false;
            }

		},

		updateSelectedSize: function(){

			this.updateFilesState();
			//this.validateFolder(this.model.get('targetFolder'));
			return this.updateFilesState()
                .then(this.validateFolderPromise.bind(this))
				.then(this.onValidateFolderResult.bind(this))
				.then(this.setStartable.bind(this));
		},

		toggleChecked: function(file){

			var file_tree = this.model.get('fileTree');
			file_tree.toggleChecked.apply(file_tree, [file, event]);
			this.updateSelectedSize()
				.then(function(){file_tree.trigger('change')})
				.catch(console.error.bind(console));
		},

		setCheck: function(file, check){

			var file_tree = this.model.get('fileTree');
			file_tree.setCheck.apply(file_tree, [file, check]);
			this.updateSelectedSize()
				.then(function(){file_tree.trigger('change')})
				.catch(console.error.bind(console));
		},

		toggleYoutubeChecked: function(file_id){

			var file_tree = this.model.get('fileTree');
			var file = file_tree.findWhere({index: parseInt(file_id)});
			file_tree.setCheck(file_tree, false);
			file_tree.toggleChecked(file);
			this.updateSelectedSize()
				.then(function(){file_tree.trigger('change')})
				.catch(console.error.bind(console));
		},

		isVisible: function(){

			return this.model.get('addSourcePageIsShown') || this.model.get('sourceInfoPageIsShown');
		},

		getCheckedFileIndexes: function() {

			var tree = this.model.get('fileTree');
			return tree.buildCheckedFileIndexes.apply(tree);
		},

		cancelByButton: function () {

            if (app.states.ScheduleSelectOpened)
                return;

			this.cancel(true, false);
		},
		cancel: function (allRequests, stopPropagation) {

			if (allRequests && !stopPropagation && this.model.get('onApiOpened')){

				var view_state = window.app.appViewManager.getDownloadsWizardState();

				if (!view_state.linkCatchingMsgShown
					&& fdmApp.settings['monitoring-alt-pressed-behaviour'] == 1){
					app.controllers.settings.model.set({showLinkCatchingMsg: true});
					//return;
				}

			}

			//if ((this.model.get('addSourcePageIsShown') || this.model.get('sourceInfoPageIsShown'))
			//	&& this.model.get('showTutorial')){
			//	this.model.set({showTutorial: false});
			//}
			//else{
				this.close();
				this.cancelCreation(!!allRequests, !!stopPropagation);
			//}
		},

		handleKeydown: function (e) {

			if (this.model.get('sourceInfoPageIsShown')
				&& this.model.get('duplicateTrtId')
				&& this.model.get('trackers')){
				if(e.keyCode == 27){
					stopEventBubble(e);
					this.cancelByButton();
				}
				else if(e.keyCode == 13) {
					stopEventBubble(e);
					this.addTrackers();
				}
			}
			else if (this.model.get('sourceInfoPageIsShown')){
				if(e.keyCode == 27){
					stopEventBubble(e);
					this.cancelByButton();
				}
				else if(e.keyCode == 13) {
					stopEventBubble(e);
					this.createDownloadByEnter();
				}
			}
			else if(e.keyCode == 27){
				this.cancel(true, false);
			}
			else if(e.keyCode == 13) {
				stopEventBubble(e);
				this.applySource();
			}
			else if (e.keyCode == 86) { // CTRL+V
				var ctrlKey = false;
				if (fdmApp.platform == 'mac')
					ctrlKey = e.metaKey;
				else
					ctrlKey = e.ctrlKey;
				if(ctrlKey) {

					if (e.target.nodeName == 'INPUT') {
						return true;
					}
					else {
						//fdm.htmlUtils.setFocus("rawSource");
						var source = this.getClipboardText();
						if (source != ""){
							var rawSourceElement = document.getElementById("rawSource");
							if (rawSourceElement){
								rawSourceElement.value = source;
								this.model.set('rawSource', source);
							}
							stopEventBubble(e);
						}
						return false;
					}
				}
			}
			return true;
		}
    };

    return Class;
})();
