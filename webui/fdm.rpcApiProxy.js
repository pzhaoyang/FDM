RPC = {}
RPC.call = function(url, data, callback){
	var args = JSON.stringify(data || []);
	var xmlhttp =  new XMLHttpRequest();
//console.log("%o + [%o]", url, args);
	xmlhttp.open('POST', url, true);
	xmlhttp.onreadystatechange = function(){
//console.log("%o - [%o]", url, args);
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200 && typeof callback === "function") {
				var response = xmlhttp.responseText;

                //console.log('Response asinc string = ' + response);

                var obj_json = null;
                try
                {
                    obj_json = JSON.parse(response);
                }
                catch (e){
                    console.error('ERROR get_obj_of_json. String = ' + response);
                    callback(null);
                }

                callback(obj_json);
			}
		}
	};
	xmlhttp.send(args);
}

RPC.callSync = function(url, data){
	var args = JSON.stringify(data || []);
	var xmlhttp =  new XMLHttpRequest();
//console.log("%o + [%o], sync", url, args);
	xmlhttp.open('POST', url, false);
	xmlhttp.send(args);
//console.log("%o - [%o]", url, args);
	if (xmlhttp.status == 200) {
		var response = xmlhttp.responseText;
        //console.log('Response sinc string = ' + response);

        var obj_json = null;
        try
        {
            obj_json = JSON.parse(response);
        }
        catch (e){
            console.error('ERROR get_obj_of_json. String = ' + response);
            return null;
        }

        return obj_json
	}
	return undefined;
}

var isFake = false;
// check API available
if(!window.external
	|| typeof window.external.addMessageCallback !== 'function'){

	isFake = true;

	RPC.call = function(url, data, callback){
		fakes.rpc(url, data, callback);
	}
	RPC.callSync = function(url, data){
		return fakes.rpcSync(url, data);
	}

	window.external.addMessageCallback = function(callback){
		fakes.MessageCallback = callback;
	}
}

(function () {

	function createApp() {
		if(window.fdmApp) {
			// fdm global object is initialized
			return;
		}
		if(!window.external/* || !window.external.messages*/){
			console.error("External object is not absent.")
			return;
		}
		window.fdmApp = {
			handlers: {},
			events: {},
			rpc: function(url, data, callback){
				RPC.call(url, data, callback);
			},
			rpcSync: function(url, data){
                var value = RPC.callSync(url, data);
                if (_.isArray(value) && value.length == 1)
                    value = value[0];
                return value;
			},
			_buildUrl: function(objectName, methodName){
				var controllerName = objectName == "root" ? "" : objectName + "/";
				var url = "http://api/" + controllerName + methodName;
				return url;
			},
			onMessage: function(key){

				if (fdmApp.debug)
					console.log('onMessage', arguments);

//console.log("message got: %o", arguments);
				if (fdmApp.handlers.hasOwnProperty(key)){
					var handler = fdmApp.handlers[key];
					if(typeof handler == "function"){
						var handlerArgs = Array.prototype.slice.call(arguments, 1);
						var value = handler.apply(this, handlerArgs);
						if (_.isArray(value) || _.isObject(value))
							value = JSON.stringify(value);
						return value;
					}
				}
				else if (fdmApp.events.hasOwnProperty(key)){
					var event = fdmApp.events[key];
					var eventName = event.eventName;
					var target = this[event.objectName];
					if (!target.hasOwnProperty(eventName)){
						console.error("%o object does not contain %o method", event.objectName, eventName);
					}
					if(typeof target[eventName] == "function"){
						var eventArgs = Array.prototype.slice.call(arguments, 1);
						var value = target[eventName].apply(target, eventArgs);
						if (_.isArray(value) || _.isObject(value))
							value = JSON.stringify(value);
						return value;
					}
				}
				else{
console.warn("unknown message got: %o", arguments);
				}
			},
			registerMessageHandler: function(key, handler){
				fdmApp.handlers[key] = handler;
			},
			registerEvent: function(objectName, eventName, customHandler){
				if (!this.hasOwnProperty(objectName)){
					console.error("Child property %o of fdmApp object does not exist", objectName);
					return;
				}
				var target = this[objectName];
				if (!target.hasOwnProperty(eventName)){
					target[eventName] = function(){}; // set NOP to avoid null reference
				}
				var messageId = objectName+'.'+eventName;
				fdmApp.events[messageId] = {
					objectName: objectName,
					eventName: customHandler || eventName
				}
			},
            //valueMethods: ['getLocaleText', 'getAgentsToIdentity', 'getAntiViruses',
            //    'getClipboardText', 'getPreparedURL', 'getAllTags'],
			registerMethod: function(objectName, methodName, sync){
				if (!this.hasOwnProperty(objectName)){
					console.error("Child property %o of fdmApp object does not exist", objectName);
					return;
				}
				var target = this[objectName];
				if (target.hasOwnProperty(methodName)){
					console.warn("%o method already exists in %o object", methodName, objectName);
					return;
				}
				var method;
				var url = fdmApp._buildUrl(objectName, methodName);
				if(sync){
					method = function(){

                        var data;
                        if (arguments.length == 1 && (_.isArray(arguments[0]) || _.isObject(arguments[0])))
                            data = arguments[0];
                        else
                            data = Array.prototype.slice.call(arguments, 0);

                        return fdmApp.rpcSync(url, data);
					};
				}
				else{
					method = function(){

						var dataSize = arguments.length;
                        var data;
						var callbackIndex = -1;
						if (dataSize > 0){
							if(typeof arguments[dataSize - 1] == "function" ){
								callbackIndex = dataSize - 1;
								dataSize--;
							}
						}

                        var callback = callbackIndex != -1 ? arguments[callbackIndex] : null;

                        if (dataSize == 1 && (_.isArray(arguments[0]) || _.isObject(arguments[0])))
                            data = arguments[0];
                        else
                            data = Array.prototype.slice.call(arguments, 0, dataSize);

						fdmApp.rpc(
                            url,
                            data,
                            function(result){

                                if (callbackIndex != -1 && typeof callback == 'function'){
                                    if ( /* fdmApp.valueMethods.indexOf(methodName) >= 0 && */
                                    _.isArray(result) && result.length == 1)
                                        callback(result[0]);
                                    else
                                        callback(result);
                                }
                            }
                        );
					};
				}
				target[methodName] = method.bind(target);
			},
			registerProperty: function(objectName, propertyName){
				if (!this.hasOwnProperty(objectName)){
					console.error("Child property %o of fdmApp object does not exist", objectName);
					return;
				}
				var target = this[objectName];

				if (target.hasOwnProperty(propertyName)){
					console.warn("%o method already exists in %o object", propertyName, objectName);
					return;
				}
				var url = fdmApp._buildUrl(objectName, propertyName);

				Object.defineProperty(target, propertyName, {
					get: function (){
						var value = fdmApp.rpcSync(url);
						this["_"+propertyName] = value;
						return value;
					},
					set: function (value){
						var prev = this["_"+propertyName];
						if(typeof prev != typeof value){
							console.warn("value of property %o was changed from %o to %o", propertyName, prev, value);
						}

						//console.log("Call %o with %o", url, value);
                        if (_.isObject(value) || _.isArray(value)){
                            fdmApp.rpc(url, value);
                        }
                        else{
                            fdmApp.rpc(url, [value]);
                        }
					},
					enumerable: true
				});
			},
			createChild: function(name){
				var result = this[name] = {};
				result.addEventListener = fdmApp.addEventListener;
				result.registerEvent = _.bind(fdmApp.registerEvent, fdmApp, name);
				result.registerMethod = _.bind(fdmApp.registerMethod, fdmApp, name);
				result.registerProperty = _.bind(fdmApp.registerProperty, fdmApp, name);

				return result;
			},
			addEventListener: function(name, listener){
				if(!this.hasOwnProperty("_listeners")){
					this._listeners = {};
				}
				if (!this._listeners.hasOwnProperty(name)){
					this._listeners[name] = [];

					this[name] = function(){
						for(var i=0,l=this.length; i<l; ++i){
							var args = Array.prototype.slice.call(arguments, 0);
//							console.log("listener: %o", arguments);
							this[i].apply(window, args);
						}
					}.bind(this._listeners[name]);
				}
				this._listeners[name].push(listener);
			},

			isFake: isFake,
			platform: navigator.platform.toLowerCase().indexOf('mac') != -1 ? 'mac' : 'win',
			os: '',
			osversion: '',
			bytesInKB: navigator.platform.toLowerCase().indexOf('mac') != -1 ? 1000 : 1024,
			screenDensityFactor: 1,
			start_time: + new Date(),
			debug: false,

			appUpdateDisabled: false,
			IeSupportDisabled: false,
			EdgeSupportDisabled: false,
            AssociateWithTorrentsDisabled: false

//			onThumbnailGenerated: fdm.Events.MultiHandler.create // create manual handler
		};
		_.bindAll(window.fdmApp, "onMessage");
		window.fdmApp.root = window.fdmApp; // to register and send event as common message

		fdmApp.registerMethod("root", "start", false);
		fdmApp.registerMethod("root", "getLocaleText", true);
		fdmApp.registerMethod("root", "readViewState", true);
		fdmApp.registerMethod("root", "writeViewState", false);

		fdmApp.registerEvent("root", "onSwitchToBackground");
		fdmApp.registerEvent("root", "onClose");
		fdmApp.registerEvent("root", "onClickInSystemArea"); // left mouse button down on non client window area


		Object.defineProperties(window.fdmApp, {
			speedMode: {
				get: function (){
					return fdmApp.rpcSync("http://api/speedMode");
				},
				set: function (value){
					fdmApp.rpc("http://api/speedMode", [value]);
				}
			}
		});
		if(window.external && window.external.addMessageCallback){
			window.external.addMessageCallback(fdmApp.onMessage);
		}
	}

	function createTags() {
		var tags = fdmApp.createChild("tags");
		tags.registerMethod("createTag", false);
		tags.registerMethod("editTag", false);
		tags.registerMethod("deleteTag", false);
		tags.registerMethod("getAllTags", false);

		tags.registerEvent("onTagsChanged");
		tags.registerEvent("onTagCreated");
		tags.registerEvent("onTagEdited");
		tags.registerEvent("onTagDeleted");
		tags.registerEvent("onTagsDialogChanged");
		tags.registerEvent("onCreateNewTag");

		fdmApp.tagManager = tags;
	}

	function createLocalization() {

		var localization = fdmApp.createChild("localization");
		localization.registerMethod("getAllStrings", true);
		localization.registerMethod("tr", true);
		localization.registerMethod("installedTranslations", true);
		localization.registerMethod("systemLocale", true);

		localization.registerEvent("allStringsLoaded");

		fdmApp.localization = localization;
	}

	function createAppInfo() {

		var app_info = fdmApp.createChild("appInfo");
        app_info.registerMethod("featureDisabled");

		fdmApp.appInfo = app_info;
	}

	function createDownloads(){
		var downloads = fdmApp.createChild("downloads");
		_.extend(downloads, {
			_createProxyDownload: function(id, type){
				var download = {id: id};

				this._createProperty(download, "state");
				this._createProperty(download, "downloadType");
				this._createProperty(download, "errorText");
				this._createProperty(download, "fileName");
				this._createProperty(download, "totalBytes");
				this._createProperty(download, "downloadedBytes");
				this._createProperty(download, "url");
				this._createProperty(download, "domain");
				this._createProperty(download, "createdDate");
				this._createProperty(download, "progress");
				this._createProperty(download, "checkingProgress");
				this._createProperty(download, "sections");
				this._createProperty(download, "downloadSpeedBytes");
				this._createProperty(download, "downloadSpeedLimit");
				this._createProperty(download, "outputFilePath");
				this._createProperty(download, "rootPath");
				this._createProperty(download, "comment");
				this._createProperty(download, "tags");
				this._createProperty(download, "files");
				this._createProperty(download, "isMovable");
				this._createProperty(download, "isMoving");
				this._createProperty(download, "isQueued");

				_.extend(download, {
					play: function(){
						return fdmApp.rpc("http://api/downloads/play", [this.id]);
					},
					pause: function(){
						return fdmApp.rpc("http://api/downloads/pause", [this.id]);
					},
					restart: function(){
						return fdmApp.rpc("http://api/downloads/restart", [this.id]);
					},
					launch: function(){
						return fdmApp.rpc("http://api/downloads/launch", [this.id]);
					},
					addTag: function(tagId){
						return fdmApp.rpc("http://api/downloads/addTag", [this.id, tagId]);
					},
					removeTag: function(tagId){
						return fdmApp.rpc("http://api/downloads/removeTag", [this.id, tagId]);
					},
					openFolder: function(){
						return fdmApp.rpc("http://api/downloads/openFolder", [this.id]);
					},
					getDownloadProperties: function(downloadProperties, trtProperties, callback){
						return fdmApp.rpc("http://api/downloads/getDownloadProperties", [this.id, downloadProperties, trtProperties], callback);
					}
				});

				return download;
			},
			_createProperty: function(target, propertyName){
				Object.defineProperty(target, propertyName, {
					get: function (){
						return fdmApp.rpcSync("http://api/downloads/" + propertyName, [this.id]);
					},
					enumerable: true
				});
			}
			//_onItemAddedHandler: function(itemId, type, args){
			//	console.error("_onItemAddedHandler:", arguments);
			//	var proxy = this._createProxyDownload(itemId, type);
			//	this.onItemAdded(proxy);
			//}
		});
		//_.bindAll(downloads, "_onItemAddedHandler");

		downloads.registerMethod("deleteByIds", false);
		downloads.registerMethod("startAll", false);
		downloads.registerMethod("stopAll", false);
		downloads.registerMethod("startByIds", false);
		downloads.registerMethod("stopByIds", false);
		downloads.registerMethod("pauseExceptIds", false);
		downloads.registerMethod("moveToByIds", false);
		downloads.registerMethod("getDHTNodes", false);
		downloads.registerMethod("getDownloadsProperties", false);
		downloads.registerMethod("launchFile");
		downloads.registerMethod("prioritizeNode", false);

		downloads.registerMethod("listenToLogUpdates", false);

		downloads.registerMethod("setSeeding");

		downloads.registerEvent("onItemAdded");
		downloads.registerEvent("onDownloadListBuilt");
		downloads.registerEvent("onItemChanged");
		downloads.registerEvent("onItemProgressChanged");
		downloads.registerEvent("onItemPriorityChanged");
		downloads.registerEvent("onItemDeleted");
		downloads.registerEvent("onItemCompleted");
		downloads.registerEvent("onLogMessages");
		downloads.registerEvent("onFileNameChanged");
		downloads.registerEvent("onSectionCompleted");
		downloads.registerEvent("onSpeedChanged");
		downloads.registerEvent("onTotalSpeedChanged");

		downloads.registerEvent("onItemChanged2");

        downloads.registerEvent("onTagsChanged");

		downloads.registerEvent("onItemThumbnailChanged");

		downloads.registerEvent("selectDownload");

		downloads.registerEvent("lowDiskSpaceWarning");

		//single downloads
		downloads.registerMethod("getDownloadProperties", false);
		downloads.registerMethod("play");
		downloads.registerMethod("pause");
		downloads.registerMethod("restart");
		downloads.registerMethod("hardRestart");
		downloads.registerMethod("launch");
		downloads.registerMethod("addTag");
		downloads.registerMethod("removeTag");
		downloads.registerMethod("openFolder");
        if (fdmApp.platform == 'mac')
        {
            downloads.registerMethod("toggleQuickLook");
            downloads.registerMethod("setQuickLookItem");
        }


		//Calculate checksum
		downloads.registerMethod("calculateChecksum");
		downloads.registerMethod("cancelChecksum");

		downloads.registerEvent("onChecksumRequested");
		downloads.registerEvent("onChecksumChanged");

		downloads.registerEvent("onFullyRestored");
		downloads.registerEvent("onDownloadingStateChanged");

		downloads.registerEvent("onSelectAllDownloads");

		downloads.registerEvent("scheduleDownloadOnDays");
		downloads.registerMethod("scheduleDownloads");
		downloads.registerMethod("showScheduleDownloads");
		downloads.registerMethod("cancelScheduleForDownloads");

		downloads.registerMethod("downloadsExistsOnDisk");

		downloads.registerEvent("onChangeUrlRequested");
		downloads.registerMethod("changeUrl");
        // downloads.registerEvent("onChangePathRequested");
        downloads.registerEvent("restartDownloads");
		downloads.registerMethod("moveTo");
		downloads.registerMethod("validUrlForChange");
		downloads.registerMethod("getProgressMap");

        downloads.registerMethod("prioritizeDownloads");
	}

	function createDownloadWizard() {
		var downloadWizard = fdmApp.createChild("downloadWizard");

		downloadWizard.registerMethod("requestDownloadInfo", true);
		downloadWizard.registerMethod("createDownload", false);
		downloadWizard.registerMethod("cancelCreation", false);
		downloadWizard.registerMethod("getPreparedURL", true);
		downloadWizard.registerMethod("getLastFolders", true);
		downloadWizard.registerMethod("getFolderForDownloadType", true);

		downloadWizard.registerEvent("onRequestDownloadBaseInfoGot");
		downloadWizard.registerEvent("onRequestDownloadInfoSuccess");
		downloadWizard.registerEvent("onRequestDownloadInfoFail");
		downloadWizard.registerEvent("onRequestDownloadInfoCancel");
		downloadWizard.registerEvent("onCreateDownloadSuccess");
		downloadWizard.registerEvent("onCreateDownloadFail");
		downloadWizard.registerEvent("onOpen");
		downloadWizard.registerEvent("onClose");

		downloadWizard.registerEvent("newDialog");

		downloadWizard.registerMethod("autostartFailed", false);
        downloadWizard.registerMethod("addTrackers", false);

		downloadWizard.registerEvent("addListLinks", false);
        downloadWizard.registerMethod("downloadListLinks", false);

		downloadWizard.registerEvent("onItemThumbnailChanged");
		downloadWizard.registerEvent("onDefaultTimetableChanged");

		downloadWizard.registerMethod("resumeDownload");
		downloadWizard.registerMethod("calcSizeOnDiskForSelection");
	}

	function createSystem() {
		var system = fdmApp.createChild("system");

        system.registerMethod("openTorrentFileDialog", false);
		system.registerMethod("openFolderDialog", false);
		system.registerMethod("calcDiskFreeSpace", true);
		system.registerMethod("getMaximumAllowedFileSize", false);
		//system.registerMethod("generateFilePreview", false);
		system.registerMethod("generateBorderlessFilePreview", false);
		system.registerMethod("getDefaultTargetFolder", true);
		system.registerMethod("getFileKind", true);
		system.registerMethod("getFileModifiedDate", true);
		system.registerMethod("getFileLastAccessDate", true);
		system.registerMethod("getClipboardText", true);
		system.registerMethod("validateFolder", false);
		system.registerMethod("messageBox", true);
		system.registerMethod("prompt", true);

		system.registerMethod("screenDensityFactor", true);

		system.registerEvent("openFileCallback");
		system.registerEvent("openFolderCallback");

		system.registerEvent("onWindowHeaderMousedown");

		system.registerMethod("browseUrl");
		//system.registerEvent("onThumbnailGenerated");

		system.registerMethod("getOS");

		system.registerMethod("getUuid");


		system.registerMethod("toolbarDragStart");
		system.registerMethod("toolbarDragMove");
		system.registerMethod("toolbarDoubleClick");
		
		system.registerMethod("vicoinBnrClick");
	}

	function createMenu() {
		var menu = fdmApp.createChild("menu");

		menu.registerEvent("onAddDownload");
		menu.registerEvent("onShowSettings");
		menu.registerEvent("onOpenTorrentFile");

		menu.registerEvent("getMenuActionsEnabled");
		menu.registerEvent("startSelected");
		menu.registerEvent("pauseSelected");
		menu.registerEvent("pauseExceptSelected");
		menu.registerEvent("removeSelected");
		menu.registerEvent("restartSelected");
		menu.registerEvent("moveSelected");
		menu.registerEvent("addDownloadFromURL");

		menu.registerMethod("launchVisitForum", false);
		menu.registerMethod("launchContact", false);
		menu.registerMethod("launchAbout", true);
		menu.registerMethod("launchExit", false);
		
		menu.registerMethod("showPopupMenu", false);
		menu.registerMethod("showFilesPopupMenu", false);
		menu.registerMethod("showTagPopupMenu", false);
        menu.registerMethod("closePopupMenu", false);

		menu.registerEvent("onHide");

		menu.registerMethod("launchCheckUpdates", false);

		menu.registerEvent("editTag");
		menu.registerEvent("removeTag");

		menu.registerEvent("chooseFiles");
        menu.registerEvent("showInfo");

		menu.registerEvent("checkForUpdates");

		menu.registerMethod("showLogPopupMenu", false);
		menu.registerMethod("voteForFeatures", false);

		menu.registerMethod("importUrlsFromClipboard", false);

		fdmApp.menuManager = fdmApp.menu;
	}

	function createDragDrop() {
		fdmApp.dragDrop = {};
		fdmApp.registerMethod("dragDrop", "lastDroppedSource", true);
	}

	function createSettings() {
		var settings = fdmApp.createChild("settings");

		settings.registerMethod("getAgentsToIdentity", true);
		settings.registerMethod("clearFolderHistory", true);
		settings.registerMethod("clearDownloadHistory", true);
		settings.registerMethod("getAntiViruses", true);
		settings.registerMethod("onDialogInit", true);
		settings.registerMethod("onDialogApply", true);
		settings.registerMethod("checkAntivirusPathSettings", true);
		settings.registerMethod("checkAntivirusCustomArgSettings", true);
		settings.registerMethod("checkAntivirusExtSettings", true);
		settings.registerMethod("getLocales", true);
		settings.registerMethod("setConnectionTrafficLimit", true);
		settings.registerMethod("openChromePluginPage", false);
		settings.registerMethod("openFirefoxPluginPage", false);
		settings.registerMethod("openChromeDownloadPage", false);
		settings.registerMethod("openFirefoxDownloadPage", false);
        settings.registerMethod("openSafariExtension", false);
        settings.registerMethod("checkDefaultTorrentClient", true);
        settings.registerMethod("setDefaultTorrentClient", false);
        settings.registerMethod("applySettings", false);

		settings.registerMethod("resetToDefault", false);

		// Register Settings Properties.
		settings.registerProperty("general-load-on-startup");
		//settings.registerProperty("general-update-behaviour");
		settings.registerProperty("check-updates-automatically");
		settings.registerProperty("install-updates-automatically");
		settings.registerProperty("send-anon-usage-stats");
		//settings.registerProperty("new-download-default-folder-source");
		settings.registerProperty("check-default-torrent-client-at-startup");

		// General -> Monitoring
		settings.registerProperty("monitoring-ie-enabled");
		settings.registerProperty("monitoring-edge-enabled");
		settings.registerProperty("monitoring-ff-enabled");
		settings.registerProperty("firefox-installed");
		settings.registerProperty("monitoring-chrome-enabled");
		settings.registerProperty("chrome-installed");
		settings.registerProperty("monitoring-opera-enabled");
		settings.registerProperty("monitoring-safari-enabled");
		settings.registerProperty("monitoring-alt-pressed");
		settings.registerProperty("monitoring-alt-pressed-behaviour");
		settings.registerProperty("monitoring-allow-download");
		settings.registerProperty("monitoring-skip-smaller-enabled");
		settings.registerProperty("monitoring-skip-extensions-value");
		settings.registerProperty("monitoring-skip-extensions-enabled");
		settings.registerProperty("monitoring-skip-smaller-value");
		settings.registerProperty("monitoring-add-to-menu");
		settings.registerProperty("monitoring-menu-this");
		settings.registerProperty("monitoring-menu-page");
		settings.registerProperty("monitoring-menu-all");
		settings.registerProperty("monitoring-menu-selected");
		settings.registerProperty("monitoring-menu-video");
		settings.registerProperty("monitoring-silent");
		settings.registerProperty("default-download-folder");

		// settings.registerProperty("monitoring-edge-httpportsonly");

		settings.registerProperty("monitoring-skip-servers-value");
		settings.registerProperty("monitoring-skip-servers-enabled");

		// General -> Notifications
		settings.registerProperty("notifications-balloon-enabled");
		settings.registerProperty("notifications-balloon-timeout");
		settings.registerProperty("notifications-popup-on-finish-enabled");
		settings.registerProperty("notifications-popup-autohiding-on-finish-enabled");
		settings.registerProperty("notifications-popup-autohiding-on-finish-timeout");
		settings.registerProperty("notifications-disabled-for-batch");
		settings.registerProperty("notifications-show-tips");
		
		// General -> History
		settings.registerProperty("folder-history-enabled");
		settings.registerProperty("folder-history-keep-records-enabled");
		settings.registerProperty("folder-history-keep-records-value");
		settings.registerProperty("folder-history-max-records-enabled");
		settings.registerProperty("folder-history-max-records-value");
		settings.registerProperty("download-history-enabled");
		settings.registerProperty("download-history-keep-records-enabled");
		settings.registerProperty("download-history-keep-records-value");
		settings.registerProperty("download-history-completed-only");
		
		
		settings.registerProperty("confirmation-timeout-hang-up");
		settings.registerProperty("confirmation-timeout-exit");
		settings.registerProperty("confirmation-timeout-shutdown");
		settings.registerProperty("confirmation-timeout-launch-download");
		
		settings.registerProperty("target-folder-is-user-defined");
		settings.registerProperty("target-folder-user-defined-value");
		settings.registerProperty("auto-save-interval");

		// General -> Languages
		settings.registerProperty("locale-value");
		
		// Appearance -> Behavior
		settings.registerProperty("behavior-close-as-minimize");
		
		// Appearance -> Floating windows
		settings.registerProperty("floating-window-drop-box-enabled");
		settings.registerProperty("floating-window-drop-box-transparency");
		settings.registerProperty("floating-window-extra-info-enabled");
		settings.registerProperty("floating-window-extra-info-transparency");
		settings.registerProperty("floating-window-hide-in-fullscreen");
		
		// Downloads -> Essential
		settings.registerProperty("downloads-logs-disabled");
		settings.registerProperty("downloads-auto-delete-completed");
		settings.registerProperty("downloads-delete-uncompleted-reaction");
		settings.registerProperty("downloads-detailed-log-enabled");
		settings.registerProperty("downloads-show-progress-window");
		//settings.registerProperty("downloads-sizes-in-bytes");
		settings.registerProperty("file-cache-writing-enabled");
		settings.registerProperty("file-cache-writing-size");
		
		settings.registerProperty("downloads-prevent-standing");
		settings.registerProperty("downloads-time-limits-enabled");
		settings.registerProperty("downloads-time-limits-begin");
		settings.registerProperty("downloads-time-limits-end");
		
		// Downloads -> Essential -> Virus check
		settings.registerProperty("virus-check-enabled");
		settings.registerProperty("virus-check-predefined-app-enabled");
		settings.registerProperty("virus-check-predefined-app-value");
		settings.registerProperty("virus-check-custom-app-path");
		settings.registerProperty("virus-check-custom-app-args");
		settings.registerProperty("virus-check-file-extensions");

		// Network -> Bittorrent
		settings.registerProperty("bittorrent-enable-dht");
		settings.registerProperty("bittorrent-enable-local-peer-discovery");
		settings.registerProperty("bittorrent-enable-port-forwarding");
		//settings.registerProperty("bittorrent-enable-upnp");
		//settings.registerProperty("bittorrent-enable-nat-pmp");
		settings.registerProperty("bittorrent-enable-utpex");
		settings.registerProperty("bittorrent-enable-utp");
		settings.registerProperty("bittorrent-port-from");
		settings.registerProperty("bittorrent-port-to");
		settings.registerProperty("bittorrent-limit-local-traffic");

		// Network -> speed-mode
		//settings.registerProperty("tum-low-restriction-percentage");
		settings.registerProperty("tum-low-restriction-absolute");
		settings.registerProperty("tum-low-restriction-type");
		settings.registerProperty("tum-low-upload-restriction-absolute");
		settings.registerProperty("tum-low-upload-restriction-type");
		//settings.registerProperty("tum-low-upload-restriction");
		//settings.registerProperty("tum-low-max-connections-auto");
		settings.registerProperty("tum-low-max-connections-value");
		//settings.registerProperty("tum-low-max-connections-per-server-auto");
		//settings.registerProperty("tum-low-max-connections-per-server-value");
		//settings.registerProperty("tum-low-max-tasks-auto");
		settings.registerProperty("tum-low-max-tasks-value");

		//settings.registerProperty("tum-medium-restriction-percentage");
		settings.registerProperty("tum-medium-restriction-absolute");
		settings.registerProperty("tum-medium-restriction-type");
		settings.registerProperty("tum-medium-upload-restriction-absolute");
		settings.registerProperty("tum-medium-upload-restriction-type");
		//settings.registerProperty("tum-medium-upload-restriction");
		//settings.registerProperty("tum-medium-max-connections-auto");
		settings.registerProperty("tum-medium-max-connections-value");
		//settings.registerProperty("tum-medium-max-connections-per-server-auto");
		//settings.registerProperty("tum-medium-max-connections-per-server-value");
		//settings.registerProperty("tum-medium-max-tasks-auto");
		settings.registerProperty("tum-medium-max-tasks-value");

		//settings.registerProperty("tum-high-restriction-percentage");
		settings.registerProperty("tum-high-restriction-absolute");
		settings.registerProperty("tum-high-restriction-type");
		settings.registerProperty("tum-high-upload-restriction-absolute");
		settings.registerProperty("tum-high-upload-restriction-type");
		//settings.registerProperty("tum-high-upload-restriction");
		//settings.registerProperty("tum-high-max-connections-auto");
		settings.registerProperty("tum-high-max-connections-value");
		//settings.registerProperty("tum-high-max-connections-per-server-auto");
		//settings.registerProperty("tum-high-max-connections-per-server-value");
		//settings.registerProperty("tum-high-max-tasks-auto");
		settings.registerProperty("tum-high-max-tasks-value");

		//settings.registerProperty("speed-mode-browser-activity-manage-enabled");
		//settings.registerProperty("speed-mode-browser-activity-manage-value");
			
		// Network -> New Download -> Connection
		settings.registerProperty("connection-attempt-pause");
		settings.registerProperty("connection-max-attempts-enabled");
		settings.registerProperty("connection-max-attempts-value");
		settings.registerProperty("connection-timeout");
		settings.registerProperty("connection-section-restart-if-low-speed-enabled");
		settings.registerProperty("connection-section-restart-if-low-speed-value");
		settings.registerProperty("connection-traffic-limit-enabled");
		settings.registerProperty("connection-traffic-limit-value");
		settings.registerProperty("connection-traffic-limit-unit");
		settings.registerProperty("connection-traffic-limit-upload-enabled");
		settings.registerProperty("connection-traffic-limit-upload-value");
		settings.registerProperty("connection-traffic-limit-upload-unit");
		settings.registerProperty("connection-ignore-all-restrictions");

		// Network -> New Download -> Protocol
		settings.registerProperty("new-download-browser-agent");
		settings.registerProperty("new-download-referer");
		settings.registerProperty("new-download-http11-enabled");
		settings.registerProperty("new-download-cookies-enabled");
		settings.registerProperty("new-download-ftp-passive-mode-enabled");
		settings.registerProperty("new-download-ftp-file-date-retrieving-disabled");
		settings.registerProperty("new-download-ftp-transfer-mode");
		settings.registerProperty("new-download-ftp-transfer-mode-ascii-extensions");

		// Network -> New Download -> Proxy
		settings.registerProperty("proxy-settings-source");
		settings.registerProperty("proxy-http-settings-address");
		settings.registerProperty("proxy-http-settings-port");
		//settings.registerProperty("proxy-http-settings-login-required");
		settings.registerProperty("proxy-http-settings-login-name");
		settings.registerProperty("proxy-http-settings-login-password");
		settings.registerProperty("proxy-https-settings-address");
		settings.registerProperty("proxy-https-settings-port");
		//settings.registerProperty("proxy-https-settings-login-required");
		settings.registerProperty("proxy-https-settings-login-name");
		settings.registerProperty("proxy-https-settings-login-password");
		settings.registerProperty("proxy-ftp-settings-address");
		settings.registerProperty("proxy-ftp-settings-port");
		//settings.registerProperty("proxy-ftp-settings-login-required");
		settings.registerProperty("proxy-ftp-settings-login-name");
		settings.registerProperty("proxy-ftp-settings-login-password");

		settings.registerProperty("new-download-proxy-settings-error-rollback");
		settings.registerProperty("new-download-proxy-settings-error-rollback-bytes");

		// Network -> New Download -> Integrity
		settings.registerProperty("integrity-check-enabled");
		settings.registerProperty("integrity-check-action");

		// Network -> New Download -> Miscellaneous
		settings.registerProperty("file-already-exists-action");
		settings.registerProperty("file-already-exists-rename-at-restart");

		//settings.registerProperty("reserve-disk-downloading-file-space");
		settings.registerProperty("reserve-file-space-larger-enabled");
		settings.registerProperty("reserve-file-space-larger-value");

		settings.registerProperty("retrieve-file-date-from-server");
		settings.registerProperty("uncompleted-file-extension-enabled");
		settings.registerProperty("uncompleted-file-extension-value");
		settings.registerProperty("hide-uncompleted-file");
		settings.registerProperty("create-file-extension-enabled");
		settings.registerProperty("create-file-extension-value");
		settings.registerProperty("append-comment-to-completed-file");
		settings.registerProperty("run-completed-file");
		settings.registerProperty("generate-file-description");

		settings.registerProperty("restart-disabled-if-server-resume-unsupported");
		settings.registerProperty("server-file-size-changed-action");
		settings.registerProperty("stop-on-file-not-found");
		settings.registerProperty("stop-on-access-denied");

		settings.registerProperty("check-updates-interval");
		settings.registerProperty("update-to-betas");

		settings.registerProperty("notify-about-completed-downloads");
		settings.registerProperty("notify-only-window-is-inactive");

		settings.registerProperty("tum-snail-mode-enabled");

		settings.registerProperty("prevent-sleep-if-active-downloads");
		settings.registerProperty("prevent-sleep-if-uploading-downloads-active");
		settings.registerProperty("bittorrent-proxy-peer-connections");
		settings.registerProperty("suggest-download-folder-by-content-type");
		settings.registerProperty("suggest-download-settings-by-url");
		settings.registerProperty("remove-dead-downloads");
		settings.registerProperty("set-files-dates-from-server");

		settings.registerProperty("shutdown-when-done");
		settings.registerProperty("prevent-sleep-action");
		settings.registerProperty("prevent-sleep-if-scheduled-downloads");

		settings.registerProperty("update-server-provided-info");

		settings.registerProperty("cgbBundleDontShowAgain");

		settings.registerEvent("onSettingsChanged");
	}

	function createUpdater() {
		var updater = fdmApp.createChild("updater");

		updater.registerMethod("getUpdateTargetInfo", true);
		updater.registerMethod("updatesAvailable", true);
		updater.registerMethod("checkForUpdates", true);
		updater.registerMethod("downloadUpdates", true);
		updater.registerMethod("installUpdates", true);
		updater.registerMethod("getStage", true);
		updater.registerMethod("getState", true);
		updater.registerMethod("getProgress", true);
		updater.registerMethod("abortOperation", true);
		updater.registerMethod("getRestartRequired", true);
		updater.registerMethod("performRestart", true);
		updater.registerMethod("getLastErrorDescription", true);

		updater.registerMethod("getPreInstallCheckFailureReason", true);
		updater.registerMethod("shutdownUpdateTargetModule", true);
		updater.registerMethod("reset", false);
		updater.registerMethod("getInitiator", true);

		updater.registerEvent("onItemChanged");

		//updater.registerMethod("installUpdate", false);
        //
		//updater.registerProperty("state");
		//updater.registerProperty("downloadProgress");
		//updater.registerProperty("updateFile");
        //
		//updater.registerEvent("onStatusText");
	}

	function createSimpleDialogs() {
		var simpleDialogs = fdmApp.createChild("simpleDialogs");

		simpleDialogs.registerMethod("onDialogClosed", true);
		simpleDialogs.registerEvent("newDialog");
	}

	function batchDownloads() {
		var batchDownloads = fdmApp.createChild("batchDownloads");

		batchDownloads.registerMethod("getDownloadsIds");
	}

	function createSharer() {

        var sharer = fdmApp.createChild("sharer");

        sharer.registerMethod("dialogIsShown");
	}

	function createBundles() {
		var bundles = fdmApp.createChild("bundles");
		bundles.registerMethod("install");
		bundles.registerMethod("progress");
		bundles.registerEvent("onBundleStopped");
		bundles.registerMethod("canBeInstalled");
		bundles.registerMethod("isInstalled");

		bundles.registerEvent("onBundleNotificationEvent");

		bundles.registerMethod("bannerIsShown");
	}

	createApp();
    createAppInfo();
	createLocalization();
	createTags();
	createDownloads();
	createDownloadWizard();
	createSystem();
	createMenu();
	createSettings();
	createDragDrop();
	createUpdater();
	createSimpleDialogs();
	batchDownloads();
    createSharer();
    createBundles();

	fdmApp.system.getOS(function(os_info){

		if (os_info)
		{
            fdmApp.os = os_info.os;
            fdmApp.osversion = os_info.osversion;
            if (os_info.os == 'osx')
            {
                fdmApp.platform = 'mac';
                if (os_info.osversion == '10.9')
                    document.body.classList.add('macosx_10_9');
            }
            else
                fdmApp.platform = 'win';
        }

        if (fdmApp.platform === 'mac')
		{
			document.addEventListener('mousedown', function(){

                fdmApp.menuManager.closePopupMenu();
			});
		}
	});


    var featureDisabledEnum = {
        appUpdate: 1,
        IeSupport: 2,
        EdgeSupport: 3,
        AssociateWithTorrents: 4
    };

	fdmApp.appInfo.featureDisabled(featureDisabledEnum.appUpdate, function(res){

		fdmApp.appUpdateDisabled = res;
	});
	fdmApp.appInfo.featureDisabled(featureDisabledEnum.IeSupport, function(res){

		fdmApp.IeSupportDisabled = res;
	});
	fdmApp.appInfo.featureDisabled(featureDisabledEnum.EdgeSupport, function(res){

		fdmApp.EdgeSupportDisabled = res;
	});
    fdmApp.appInfo.featureDisabled(featureDisabledEnum.AssociateWithTorrents, function(res){

        fdmApp.AssociateWithTorrentsDisabled = res;
    });

    fdmApp.vicoinIsInstalled = true;
    fdmApp.vicoinCanBeInstalled = false;
    fdmApp.bundles.isInstalled('vicoin', function(res){

        fdmApp.vicoinIsInstalled = res;
    });
    fdmApp.bundles.canBeInstalled('vicoin', function(res){

        fdmApp.vicoinCanBeInstalled = res;
    });

	/*if (!window.external || !window.external.addMessageCallback){
		window.fdmApp.speedMode = fdm.models.NetworkSpeedMode.High;
	}*/
})();
