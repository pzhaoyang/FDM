
var FdmDispatcher = _.assign(new exports.Flux.Dispatcher, exports.Flux.Dispatcher.prototype, {

    /**
     * A bridge function between the views and the dispatcher, marking the action
     * as a view action.  Another variant here could be handleServerAction.
     * @param  {object} action The data coming from the view.
     */
    handleViewAction: function(action) {

        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });

    },
    handleCoreAction: function(action) {

        this.dispatch({
            source: 'CORE_ACTION',
            action: action
        });

    }

});

ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

// override $(document).ready +++
window.windowIsLoaded = false;
window.windowIsLoadedFunc = [];
function wOnLoad(load_f){
    if (window.windowIsLoaded){
        if (typeof load_f == 'function')
            return load_f();
    }
    else{
        window.windowIsLoadedFunc.push(load_f);
    }
}

window.onload = function(){
    eval_onload_funtions();
};
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        eval_onload_funtions();
    }
};
document.addEventListener("DOMContentLoaded", function() {
    eval_onload_funtions();
});

function eval_onload_funtions(){
    if (!window.windowIsLoaded){
        window.windowIsLoaded = true;
        window.windowIsLoadedFunc.forEach(function(f){
            if (typeof f == 'function'){
                try{
                    f();
                }catch (e){
                    console.error(e);
                }
            }
        });
        window.windowIsLoadedFunc = [];
    }
}
// --- override $(document).ready

function stopEventBubble(e) {
    e = e ? e : window.event;

    if (e)
    {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.cancel = true;
        e.returnValue = false;
		if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation){
			e.nativeEvent.stopImmediatePropagation();
		}
    }
}

function stopPropagation(e) {
    e = e ? e : window.event;

    if (e)
    {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    }
}

var Empty = React.createClass({displayName: "Empty",

    render: function() {

        return false;
    }
});

function rjs_class(obj){
    var class_name = '';
    for (var name in obj)
    {
        if (obj.hasOwnProperty(name) && obj[name])
        {
            if (class_name != '')
                class_name = class_name + ' ' + name;
            else
                class_name = name;
        }
    }
    return class_name;
}

function cssByState(json)
{
    var state = json.state;

    var cssClass = "completed";
    switch (state){
        case fdm.models.DownloadState.Downloading:
            cssClass = "downloading";
            if (json.isQueued)
                cssClass = "downloading is_queued";
            break;
        case fdm.models.DownloadState.WaitingForMetadata:
        case fdm.models.DownloadState.Checking:
        case fdm.models.DownloadState.FileProcessing:
        case fdm.models.DownloadState.Allocating:
        case fdm.models.DownloadState.Reconnecting:
            cssClass = "downloading";
            break;
        case fdm.models.DownloadState.Paused:
        case fdm.models.DownloadState.Pausing:
            cssClass = "paused";
            break;
        case fdm.models.DownloadState.Error:
            cssClass = "error";
            break;
    }

    if (json.missingFiles && !json.missingStorage)
        cssClass = "error";
    if (json.missingStorage)
        cssClass += " error";

    if (json.state == fdm.models.DownloadState.Completed &&
        !json.missingFiles && !json.missingStorage &&
        json.completedTime && +new Date() - json.completedTime < 2000){
        cssClass = "download-ending";
    }

    if (json.isMoving /* && json.moveProgress > 0*/)
        cssClass += " move_progress";

    return cssClass;
}

function titleByActionButton(json)
{
    var title;

    if (json.isScheduled)
        return __('Open Scheduler');

    switch (json.state) {
        case fdm.models.DownloadState.Completed:

            if (fdmApp.platform == 'mac')
                title = __('Reveal in Finder');
            else
                title = __('Show in folder');
            break;
        case fdm.models.DownloadState.Downloading:
        case fdm.models.DownloadState.WaitingForMetadata:
        case fdm.models.DownloadState.Checking:
        case fdm.models.DownloadState.Reconnecting:
            title = __('Pause');
            break;
        //case fdm.models.DownloadState.Allocating:
        //    title = __('Pause');
        //    break;
        case fdm.models.DownloadState.Error:
            title = __('Restart');
            break;
        case fdm.models.DownloadState.Paused:
        case fdm.models.DownloadState.Pausing:
            title = __('Start');
            break;
    }

    if (json.missingFiles)
        title = __('Restart');
    else if (json.missingStorage && json.state === fdm.models.DownloadState.Completed)
        title = __('Restart');

    return title;
}

Empty = React.createClass({

    render: function() {

        return null;
    }
});


var rjs_render = new function(){
    var self = this;

    //var render_queue = {};

    self.add = function(name, priority){

        //priority = priority || 'low';
        //name = name || 'all';
        //
        //if (priority == 'low'){
        //    render_queue[name] = 1;
        //    self.start_interval();
        //}
        //else if (priority == 'high'){
        //    _.defer(_.bind(rjs_render.add, rjs_render, name, 'now'));
        //}
        //else{
        //
        //    if (name == 'all'){
        //        render_queue = {};
        //        self.render_all();
        //    }
        //    else{
        //        if (typeof self['render_' + name] == 'function'){
        //            delete render_queue[name];
        //            //console.time('render_' + name);
        //            self['render_' + name]();
        //            //console.timeEnd('render_' + name);
        //        }
        //    }
        //}

    };

    //self.render_all = function(){

        //self.render_bottom_panel();
        //self.render_download_wizard();
    //};

    //self.render_bottom_panel = function(){

        //var model = app.controllers.bottomPanel.model;
        //var view_model = app.controllers.bottomPanel.view_model;
        //var current_item = model.get('currentItem');
        //if (current_item == null){
        //    ReactDOM.render(
        //        React.createElement(Empty),
        //        document.getElementById('react-bottom-panel')
        //    );
        //}
        //else{
        //    ReactDOM.render(
        //        React.createElement(BottomPanel, {
        //            model: model,
        //            current_item: current_item,
        //            view_model: view_model}),
        //        document.getElementById('react-bottom-panel')
        //    );
        //}
    //};

    //self.render_download_wizard = function(){

        //var view_model = app.controllers.downloadWizard.view_model;
        //var model = app.controllers.downloadWizard.model;
        //
        //if (model.get('addSourcePageIsShown')){
        //
        //    //ReactDOM.render(
        //    //    React.createElement(Empty),
        //    //    document.getElementById('react-download-wizard-add-container')
        //    //);
        //
        //    ReactDOM.render(
        //        React.createElement(DownloadWizardAdd, {view_model: view_model, model: model}),
        //        document.getElementById('react-download-wizard-add-container')
        //    );
        //}
        //else{
        //    ReactDOM.render(
        //        React.createElement(Empty),
        //        document.getElementById('react-download-wizard-add-container')
        //    );
        //}
        //
        //if (model.get('sourceInfoPageIsShown')){
        //    ReactDOM.render(
        //        React.createElement(DownloadWizardSource, {view_model: view_model, model: model}),
        //        document.getElementById('react-download-wizard-source-container')
        //    );
        //}
        //else{
        //    ReactDOM.render(
        //        React.createElement(Empty),
        //        document.getElementById('react-download-wizard-source-container')
        //    );
        //}
    //};

    //self.do_queue = function(){

        //var queue_keys = Object.keys(render_queue);
        //if (queue_keys.length == 0)
        //    return;
        //
        //if (typeof render_queue['all'] != 'undefined')
        //{
        //    render_queue = {};
        //    self.render_all();
        //    self.stop_interval();
        //}
        //else
        //{
        //    queue_keys.forEach(
        //        function(queue_key){
        //            if (typeof self['render_' + queue_key] == 'function'){
        //                delete render_queue[queue_key];
        //                self['render_' + queue_key]();
        //            }
        //        }
        //    );
        //    self.stop_interval();
        //}
    //};

    //self.render_interval = null;
    //self.start_interval = function(){
    //
    //    if (self.render_interval)
    //        return;
    //
    //    self.render_interval = setInterval(
    //        self.do_queue,
    //        200
    //    );
    //};
    //self.stop_interval = function(){
    //
    //    if (!self.render_interval)
    //        return;
    //
    //    clearInterval(self.render_interval);
    //    self.render_interval = null;
    //};
    //self.add('all');
    //setTimeout(
    //    function(){
    //        self.add('all');
    //    }, 500
    //)
};


var FdmReactTpl = {};

function startReactApp(){

    FdmReactTpl.Downloads = ReactDOM.render(
        React.createElement(Downloads, {
            view_model: app.controllers.downloads.view_model,
            model: app.controllers.downloads.model,
            controller: app.controllers.downloads
        }),
        document.getElementById('react-downloads-scroll-container')
    );
    FdmReactTpl.Downloads = ReactDOM.render(
        React.createElement(EmptyDownloads),
        document.getElementById('react-empty-downloads-container')
    );
    FdmReactTpl.Toolbar = ReactDOM.render(
        React.createElement(Toolbar),
        document.getElementById('react-toolbar-container')
    );
    // FdmReactTpl.TagsColourDialog = ReactDOM.render(
    //     React.createElement(TagsColourDialog),
    //     document.getElementById('react-tag-panel-colours')
    // );
    FdmReactTpl.Settings = ReactDOM.render(
        React.createElement(Settings),
        document.getElementById('react-settings-container')
    );
    FdmReactTpl.ResetSettingsDialog = ReactDOM.render(
        React.createElement(ResetSettingsDialog),
        document.getElementById('react-reset-settings-dialog')
    );
    FdmReactTpl.PopupMenu = ReactDOM.render(
        React.createElement(PopupMenu),
        document.getElementById('react-popup-menu-container')
    );
    FdmReactTpl.DeletePopupDialog = ReactDOM.render(
        React.createElement(DeletePopupDialog),
        document.getElementById('react-delete-popup-dialog')
    );
    FdmReactTpl.TableHeaderInfo = ReactDOM.render(
        React.createElement(TableHeaderInfo),
        document.getElementById('react-table-header-info-container')
    );
    FdmReactTpl.CustomSpeedDialog = ReactDOM.render(
        React.createElement(CustomSpeedDialog),
        document.getElementById('react-custom-speed-dialog-container')
    );
    FdmReactTpl.TrafficPanel = ReactDOM.render(
        React.createElement(TrafficPanel),
        document.getElementById('react-traffic-panel')
    );
    FdmReactTpl.TagsPanel = ReactDOM.render(
        React.createElement(TagsPanel, {
            model: app.controllers.tags.model
        }),
        document.getElementById('react-tag-panel-container')
    );
    //FdmReactTpl.TagsPanel = ReactDOM.render(
    //    React.createElement(TestLocalMessage),
    //    document.getElementById('react-tag-panel-container')
    //);

    FdmReactTpl.BottomPanel = ReactDOM.render(
        React.createElement(BottomPanel, {
            model: app.controllers.bottomPanel.model}),
        document.getElementById('react-bottom-panel')
    );

    FdmReactTpl.DownloadWizard = ReactDOM.render(
        React.createElement(DownloadWizard),
        document.getElementById('react-download-wizard')
    );

    //FdmReactTpl.DownloadWizard = ReactDOM.render(
    //    React.createElement(DefaultTorrentClientMessage),
    //    document.getElementById('react-default-client-message')
    //);

    FdmReactTpl.DownloadWizard = ReactDOM.render(
        React.createElement(TagsPanelMessages),
        document.getElementById('react-tags-panel-messages')
    );

    FdmReactTpl.SimpleDialogs = ReactDOM.render(
        React.createElement(SimpleDialogs),
        document.getElementById('react-simple-dialogs')
    );

    FdmReactTpl.CalculateChecksumDialog = ReactDOM.render(
        React.createElement(CalculateChecksumDialog),
        document.getElementById('react-calculate-checksum-dialog')
    );

    FdmReactTpl.ScheduleDialog = ReactDOM.render(
        React.createElement(ScheduleDialog),
        document.getElementById('react-schedule-dialog')
    );

    FdmReactTpl.SharerDialog = ReactDOM.render(
        React.createElement(SharerDialog),
        document.getElementById('react-sharer-dialog')
    );

    FdmReactTpl.BundlesDialog = ReactDOM.render(
        React.createElement(BundlesDialog),
        document.getElementById('react-bundles-dialog')
    );

    FdmReactTpl.ChangeUrlDialog = ReactDOM.render(
        React.createElement(ChangeUrlDialog),
        document.getElementById('react-change-url-dialog')
    );

    FdmReactTpl.ChangePathDialog = ReactDOM.render(
        React.createElement(ChangePathDialog),
        document.getElementById('react-path-dialog')
    );
}




var ButtonMixin = {

    buttonMouseDown: function(e){

        this.button = e.target;

        var callback = function(){

            this.button.classList.remove('pushed');
            document.removeEventListener('mouseup', callback);
        }.bind(this);

        this.button.classList.add('pushed');

        document.addEventListener('mouseup', callback);
    },
};

var ToolbarDragMixin = {

    toolbarDoubleClick: function (e) {

        if (fdmApp.platform !== 'mac')
            return;

        stopEventBubble(e);
        fdmApp.system.toolbarDoubleClick();
    },

    toolbarDragStart: function(e){

        console.error('toolbarDragStart', e.target.id, this.toolbarDragId);

        if (fdmApp.platform !== 'mac')
            return;

        if (e.target.id !== this.toolbarDragId)
            return;

        stopEventBubble(e);

        if (e.button === 0){

            document.addEventListener('mousemove', this.toolbarMove);
            document.addEventListener('mouseup', this.toolbarDragEnd);

            fdmApp.system.toolbarDragStart({screenX: e.screenX, screenY: e.screenY});
        }
    },

    toolbarDragEnd: function (e) {

        document.removeEventListener('mousemove', this.toolbarMove);
        document.removeEventListener('mouseup', this.toolbarDragEnd);
    },

    toolbarMove: function(e){

        fdmApp.system.toolbarDragMove({screenX: e.screenX, screenY: e.screenY});
    },
};