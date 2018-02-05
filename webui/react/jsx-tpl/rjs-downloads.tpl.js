
var EmptyDownloads = React.createClass({

    dispatcherIndex: 0,
    getInitialState: function() {

        var state = {};
        state.downloadListBuild = app.controllers.downloads.model.get('downloadListBuild');
        state.currentDownloadsLength = app.controllers.downloads.collections.currentDownloads.length;
        state.allDownloadsLength = app.controllers.downloads.collections.downloads.length;
        state.filterMessage = {};

        return state;
    },

    componentDidMount: function(){

        app.controllers.downloads.model.on('change:downloadListBuild', this.changeDownloadListBuild, this);
        app.controllers.downloads.collections.currentDownloads.on('add reset remove', this.changeCurrentDownloads, this);
        app.controllers.downloads.collections.downloads.on('add reset remove', this.changeAllDownloads, this);

        app.controllers.downloads.model.on('change:activeFilterText change:statusFilter', this.refreshDownloadsFilteredText, this);
        app.controllers.tags.model.on('change:selectedTag', this.refreshDownloadsFilteredText, this);

        this.dispatcherIndex = FdmDispatcher.register(function(payload) {

            if (payload.source == 'VIEW_ACTION'){

                if (payload.action.actionType == 'onTagChanged')
                    this.onTagChanged.apply(this);
            }

            return true; // No errors. Needed by promise in Dispatcher.
        }.bind(this));

    },

    componentWillUnmount: function() {

        app.controllers.downloads.model.off('change:downloadListBuild', this.changeDownloadListBuild, this);
        app.controllers.downloads.collections.currentDownloads.off('add reset remove', this.changeCurrentDownloads, this);
        app.controllers.downloads.collections.downloads.off('add reset remove', this.changeAllDownloads, this);

        app.controllers.downloads.model.off('change:activeFilterText change:statusFilter', this.refreshDownloadsFilteredText, this);
        app.controllers.tags.model.off('change:selectedTag', this.refreshDownloadsFilteredText, this);

        FdmDispatcher.unregister(this.dispatcherIndex);
    },

    onTagChanged: function(){

        this.refreshDownloadsFilteredText();
    },

    changeDownloadListBuild: function(){
        this.setState({downloadListBuild: app.controllers.downloads.model.get('downloadListBuild')});
    },

    changeCurrentDownloads: function(){
        this.setState({currentDownloadsLength: app.controllers.downloads.collections.currentDownloads.length});
    },

    changeAllDownloads: function(){
        this.setState({allDownloadsLength: app.controllers.downloads.collections.downloads.length});
    },

    refreshDownloadsFilteredText: function(){

        var filter_message;

        var activeFilterText = app.controllers.downloads.model.get('activeFilterText');
        var selectedTag = app.controllers.tags.model.get('selectedTag');
        var statusFilter = app.controllers.downloads.model.get('statusFilter');

        if (
            (activeFilterText != '' ? 1 : 0 ) +
            (selectedTag ? 1 : 0) +
            (statusFilter !== null ? 1 : 0) > 1
        ){
            filter_message = {
                type: 'many_filters',
                text: activeFilterText != '' ? '"' + activeFilterText + '"' : false
            };

            this.setState({filterMessage: filter_message});
        }
        else if (selectedTag){

            filter_message = {
                type: 'tag',
                text: '"' + selectedTag.get('name') + '"'
            };

            this.setState({filterMessage: filter_message});
        }
        else if (activeFilterText != ''){

            filter_message = {
                type: 'search',
                text: '"' + activeFilterText + '"'
            };

            this.setState({filterMessage: filter_message});
        }
        else if (statusFilter !== null){

            if (statusFilter == fdm.models.DownloadStateFilters.Active ){

                filter_message = {
                    type: 'statusFilter',
                    text: __('No active downloads')
                };
                this.setState({filterMessage: filter_message});
            }
            if (statusFilter == fdm.models.DownloadStateFilters.Completed){

                filter_message = {
                    type: 'statusFilter',
                    text: __('No completed downloads')
                };
                this.setState({filterMessage: filter_message});
            }
        }
        else{
            filter_message = {
                type: 'unknown'
            };

            this.setState({filterMessage: filter_message});
        }
    },

    mouseDownEmptyDiv: function(){

        FdmDispatcher.handleViewAction({
            actionType: 'tagsShowMoreCloseEvent',
            content: {}
        });

    },

    render: function () {

        if (!this.state.downloadListBuild){
            return (
                <div className="first_view">
                    <img src="preloading_FDM.GIF" alt="" />
                </div>
            );
        }

        if (this.state.currentDownloadsLength > 0)
            return null;

        if (this.state.allDownloadsLength == 0){
            return (
                <div onMouseDown={this.mouseDownEmptyDiv} className="temporary-style wrapper_strt_dwlnd">
                    <div className="start_add_download" >
                        <div className="wrapper">
                            <div className="big_title">{__('Drag & Drop')}</div>
                            <div>{__('URL or torrent here')}</div>
                        </div>
                    </div>
                </div>
            );
        }
        else{

            var filter_message = this.state.filterMessage;

            return (
                <div className="filter-no-results">

                    {function(){

                        if (filter_message
                            && (filter_message.type == 'search'
                            || filter_message.type == 'many_filters' && filter_message.text)){

                            return (
                                <span className="notification">
                                {__('No results found for') + ' '}
                                    <span className="user_text">{filter_message.text}</span>
                                <a href="#" onClick={app.controllers.downloads.resetTagsAndFilters}>{__('Show all')}</a>
                            </span>
                            );
                        }
                        if (filter_message && filter_message.type == 'tag'){
                            return (
                                <span className="notification">
                                    {__('No results tagged') + ' '}
                                    <span className="user_text">{filter_message.text}</span>
                                    {' ' + __('found')}
                                <a href="#" onClick={app.controllers.downloads.resetTagsAndFilters}>{__('Show all')}</a>
                            </span>
                            );
                        }
                        if (filter_message && filter_message.type == 'statusFilter'){
                            return (
                                <span className="notification">
                                {filter_message.text}
                                    <a href="#" onClick={app.controllers.downloads.resetTagsAndFilters}>{__('Show all')}</a>
                            </span>
                            );
                        }

                        return (
                            <span className="notification">
                                {__('Nothing found')}
                                <a href="#" onClick={app.controllers.downloads.resetTagsAndFilters}>{__('Show all')}</a>
                            </span>
                        );

                    }()}
                </div>
            );
        }

    }
});

var DownloadEmptyDiv = React.createClass({

    render: function () {

        var height = this.props.height;

        return (
            <div style={{height: height + 'px'}} className="my-compact completed">
            </div>
        );


    }
});


var Download = React.createClass({

    getInitialState: function() {

        var state = this.props.download.toJSON();
        state.showFilenameTitle = false;
        state.showErrorTitle = false;

        return state;
    },

    componentDidMount: function(){

        this.nameTitleFix = _.bind(this.nameTitleFix, this);

        this.props.download.on('change:state change:seedingEnabled', this.nameTitleFix);
        this.props.download.on('change', this.downloadChange, this);
        window.addEventListener('resize', this.nameTitleFix);

        this.nameTitleFix();
    },

    componentWillUnmount: function() {

        if (this.titleFixTimeout)
            clearTimeout(this.titleFixTimeout);

        this.props.download.off("change:state change:seedingEnabled", this.nameTitleFix);
        this.props.download.off('change', this.downloadChange, this);
        window.removeEventListener('resize', this.nameTitleFix);
    },

    downloadChange: function(){

        _.defer(function(){
            if (this.isMounted())
                this.setState(this.props.download.toJSON());
        }.bind(this));
    },

    titleFixTimeout: null,

    nameTitleFix: function() {

        var row = ReactDOM.findDOMNode(this);

        if (this.titleFixTimeout)
            clearTimeout(this.titleFixTimeout);
        this.titleFixTimeout = setTimeout(function(){

            var showFilenameTitle = false;
            var showErrorTitle = false;

            var c = row.getElementsByClassName('compact-download-title');
            var n = row.getElementsByClassName('download-title');
            if (c && c.length && n && n.length)
            {
                c = c[0];
                n = n[0];

                if (n && n.firstChild)
                    n = n.firstChild;

                showFilenameTitle = c.getBoundingClientRect().width < n.getBoundingClientRect().width + 12;
            }

            var error_text = this.props.download.getErrorText();

            if (error_text != ''){

                var e = row.getElementsByClassName('error_wrap');
                var s = row.getElementsByClassName('error-message');

                if (e && e.length && s && s.length)
                {
                    e = e[0];
                    s = s[0];

                    showErrorTitle = e.getBoundingClientRect().width < s.getBoundingClientRect().width;
                }
            }

            this.setState({
                showFilenameTitle: showFilenameTitle,
                showErrorTitle: showErrorTitle
            });

        }.bind(this), 1000);
    },

    сontextMenuClick: function() {

    },

    lastChangeState:0,
    doAction: function(e) {

        if (this.props.download.get('isMoving')){
            stopEventBubble(e);
            return;
        }

        var current_date = +new Date();
        if (current_date - this.lastChangeState < 250)
            return;
        this.lastChangeState = current_date;

        this.props.controller.toggleDownload(this.props.download);
    },

    // getErrorText: function(text){
    //
    //     if (text.indexOf('HTTP Error') === 0){
    //         var pos = text.indexOf(':');
    //         if (pos > 0){
    //             return text.substring(0, pos);
    //         }
    //     }
    //
    //     return text;
    //
    // },

    showTags: function(e){

        stopEventBubble(e);

        app.controllers.bottomPanel.changeTab(fdm.views.BottomPanelTab.General);

        if (!app.controllers.bottomPanel.model.get('panelVisible')){
            app.controllers.bottomPanel.show();
        }
    },

    needToggleBottomPanel: false,
    lastDownloadClick: 0,
    togglePanelTimeout: 0,
    onDownloadClick: function(){

        var current_date = +new Date();
        if (current_date - this.lastDownloadClick < 350){

            this.onDownloadDoubleClick();
            return;
        }
        this.lastDownloadClick = current_date;

        if (app.controllers.downloads.view_model.lastPopupMenuDownloadId === this.props.download.id)
            return;

        if (this.needToggleBottomPanel) {

            this.togglePanelTimeout = setTimeout(function(){

                app.controllers.bottomPanel.showToggle();
            }.bind(this), 350);
        }
    },

    onDownloadDoubleClick: function(){

        this.props.view_model.launchItem(this.props.download);
        this.needToggleBottomPanel = false;
        clearTimeout(this.togglePanelTimeout);
    },

    onDownloadMouseDown: function(e){

        stopEventBubble(e);

        this.needToggleBottomPanel = this.state.current && !this.props.isSelected;

        if (!this.needToggleBottomPanel)
            clearTimeout(this.togglePanelTimeout);

        var view_model = this.props.view_model;

        view_model.setFocus();
        view_model.selectItemByMouse(this.props.download, e);
        view_model.needShowPopupMenu(this.props.download, e);
    },

    disableSeeding: function(e){

        stopEventBubble(e);
        fdmApp.downloads.setSeeding(this.props.download.id, false);
    },

    changePriority: function(type, e){

        if ( type == 'up' && this.state.priority != fdm.models.downloadPriority.High ){

            fdmApp.downloads.prioritizeDownloads({
                downloadIds: [ this.props.download.id ],
                new_priority: (this.state.priority+1)

            })
        }
        if ( type == 'down' && this.state.priority != fdm.models.downloadPriority.Low ){

            fdmApp.downloads.prioritizeDownloads({
                downloadIds: [ this.props.download.id ],
                new_priority: (this.state.priority-1)

            })
        }

        stopEventBubble(e);
    },

    render: function() {

        var view_model = this.props.view_model;
        var download = this.props.download;
        var index = this.props.index;

        var button_title = titleByActionButton(this.state);

        var state = this.state.state;

        var requesting_info = this.state.downloadType == fdm.models.DownloadType.InfoRequest;

        var no_size = download.isNoSize();
        var error_text = download.getErrorText();

        var moving_progress = this.state.isMoving;

        var show_error = false;
        if (this.state.missingFiles || this.state.missingStorage ||
            !moving_progress && (state==fdm.models.DownloadState.Error || state==fdm.models.DownloadState.Reconnecting))
            show_error = true;

        var without_upload = !moving_progress &&
                (state == fdm.models.DownloadState.Completed
                && !this.state.isMoving && !requesting_info
                && (this.state.downloadType != fdm.models.DownloadType.Trt
                    || !this.state.seedingEnabled)
                || state == fdm.models.DownloadState.Reconnecting && error_text != '');

        var tags = this.state.tags;

        var class_name = cssByState(this.state);

        var tags_num = 0;

        var action_btn_disabled = !show_error && !this.state.isScheduled
            && (this.state.isMoving || state == fdm.models.DownloadState.FileProcessing)
            || state === fdm.models.DownloadState.Paused && this.state.pauseReason === fdm.models.pauseReason.LowDiskSpace;

        var show_low_disk_space_msg = state === fdm.models.DownloadState.Paused && this.state.pauseReason === fdm.models.pauseReason.LowDiskSpace;

        return (
            <li onClick={this.onDownloadClick}
                onMouseDown={this.onDownloadMouseDown}
                id={'row_' + download.id}
                data-id={download.id} data-index={index}
                //onDoubleClick={this.onDownloadDoubleClick}
                //onContextMenu={function(e){_.bind(model.selectItemByMouse, model, download, e)();_.bind(model.showPopupMenu, model, download, e)();}}
                className={rjs_class({
                    row:true, 'my-compact':true,
                    is_moving: this.state.isMoving && !moving_progress,
                    action_btn_disabled: action_btn_disabled,
                        //|| state == fdm.models.DownloadState.Allocating,
                    selected: this.props.isSelected,
                    drop_is_active: this.state.dropIsActive,
                    current: this.state.current,
                    without_upload: without_upload,
                    enable_seeding: this.state.downloadType == fdm.models.DownloadType.Trt
                            && this.state.seedingEnabled && state == fdm.models.DownloadState.Completed && class_name != 'download-ending',
                    partially: state == fdm.models.DownloadState.Completed && this.state.filesCount > 0 && this.state.filesCount > this.state.filesChosenCount,
                    requesting_info: requesting_info,
                    timer_state: this.state.isScheduled,
                }) + ' ' + class_name}>

                { (state != fdm.models.DownloadState.Completed
                        || this.state.downloadType == fdm.models.DownloadType.Trt && this.state.seedingEnabled )
                    && (this.state.priority == fdm.models.downloadPriority.Low
                        || this.state.priority == fdm.models.downloadPriority.High) ?

                    <div className={rjs_class({
                        low_priority: this.state.priority == fdm.models.downloadPriority.Low,
                        high_priority: this.state.priority == fdm.models.downloadPriority.High
                    })}></div>

                    : null}

                <div onDoubleClick={stopEventBubble}
                     onClick={stopEventBubble}
                    onMouseDown={function(e){
            _.bind(view_model.clickAsCheckbox, view_model, download, e)();
            _.bind(view_model.needShowPopupMenu, view_model, download, e)();}}
                     className="compact-checkbox-wrap">
                    <span className="checkbox-fake"></span>
                </div>

                {action_btn_disabled ?

                    <div title={button_title} className={rjs_class({
                        'compact-download-state': true,
                        disable: this.state.isMoving
                    })} onDoubleClick={stopEventBubble} onClick={stopEventBubble}>
                        <span className="download-state" onClick={stopEventBubble}></span>
                    </div>

                    :

                    <div title={button_title} className={rjs_class({
                        'compact-download-state': true,
                        disable: this.state.isMoving
                    })} onDoubleClick={stopEventBubble} onClick={stopEventBubble}>
                        <span className="download-state" onClick={this.doAction}></span>
                    </div>

                }

                <div className="compact-preview-img">
                    <img onDrag={stopEventBubble} onDrop={stopEventBubble} onDragStart={stopEventBubble}
                         src={download.getThumbnailUrl()} alt=""/>
                </div>

                <div className="compact-download-title">

                    {requesting_info ?
                        <span title={this.state.showFilenameTitle ? this.state.url : null} className="download-title">
                            <span>{this.state.url}</span>
                        </span>
                        :
                        <span title={this.state.showFilenameTitle ? this.state.fileName : null} className="download-title">
                            <span>{this.state.fileName}</span>
                        </span>
                    }

                    <div className="tags">

                        {(function(tag, index){

                            var rows = [];

                            for (var i = tags.length - 1; i >= 0; i--){
                                tag = tags[i];

                                if (tag.system)
                                    continue;

                                tags_num++;
                                if (tags_num > 3)
                                    break;

                                rows.push(
                                    <span key={tag.id} title={tag.name} style={{backgroundColor: 'rgb('+tag.colorR+','+tag.colorG+','+tag.colorB+')'}}></span>
                                );
                            }

                            return rows;

                        })()}

                        {tags_num > 3 ?
                            <span onClick={this.showTags}
                                className="show_tags" style={{display: 'block'}}></span>
                            : null }
                    </div>
                </div>

                <div className="compact-progress-wrap">

                    {function(){


                        if (show_error){

                            if (this.state.downloadType == fdm.models.DownloadType.batchDownload && error_text == '')
                                error_text = __('Some files corrupted');

                            return (
                                <div className={rjs_class({
                        error_wrap: true,
                        'no-size': no_size,
                        'downloading_paused_line': !moving_progress
                            && (state==fdm.models.DownloadState.Paused || state==fdm.models.DownloadState.Pausing)
                    })}>

                                    {this.state.isMoving ?
                                        <span className="left moving">{__('Moving')}</span>
                                        : null}

                                    <span title={this.state.showErrorTitle ? error_text : null}
                                        className={rjs_class({
                                        'error-message': true,
                                        left: this.state.isMoving
                                    })}>{error_text}</span>

                                    </div>
                            );
                        }

                        if (no_size){

                            return (

                                <div className={rjs_class({
                        'no-size': no_size,
                        'downloading_paused_line': !this.state.isMoving && !requesting_info
                            && (state==fdm.models.DownloadState.Paused || state==fdm.models.DownloadState.Pausing)
                    })}>

                                    <span>{download.getNoSizeStatus()}</span>

                                    { this.state.isMoving || requesting_info ||
                                        (state==fdm.models.DownloadState.Paused
                                        || state==fdm.models.DownloadState.Pausing
                                        || state==fdm.models.DownloadState.FileProcessing
                                        //|| state==fdm.models.DownloadState.Allocating
                                        || state==fdm.models.DownloadState.Reconnecting
                                        || state==fdm.models.DownloadState.WaitingForMetadata
                                        || state==fdm.models.DownloadState.Checking
                                        || state==fdm.models.DownloadState.Downloading) ?
                                        <div></div>
                                        : null }

                                </div>

                            );
                        }
                        else {
                            return (

                                <div className={rjs_class({
                                'info-time': true,
                                'downloading_paused_line': !moving_progress
                                    && (state==fdm.models.DownloadState.Paused || state==fdm.models.DownloadState.Pausing)
                                })}>

                                    {function(){

                                        if (state==fdm.models.DownloadState.Checking){

                                            if (this.state.checking == fdm.models.CheckingState.Allocating)
                                            {
                                                return (
                                                    <span className="percents">{__('Allocating disk space...')}</span>
                                                );
                                            }
                                            if (this.state.checking == fdm.models.CheckingState.ResumeData)
                                            {
                                                return (
                                                    <span className="percents">{__('Checking resume data...')}</span>
                                                );
                                            }
                                            if (this.state.checking == fdm.models.CheckingState.Queued)
                                            {
                                                return (
                                                    <span className="percents">{__('Queued for checking...')}</span>
                                                );
                                            }

                                            return (
                                                <span className="percents">{__('Checking files...') + ' '
                                                + ( this.state.checkingProgress >= 0 ? this.state.checkingProgress + '%' : '')}</span>
                                            );
                                        }
                                        if (moving_progress){
                                            return (
                                                <span className="percents">{__('Moving') + '... ' + this.state.moveProgress + '%'}</span>
                                            );
                                        }
                                        if (state!=fdm.models.DownloadState.Completed && this.state.progress >= 0){
                                            return (
                                                <span className="percents">{this.state.progress + '%'}</span>
                                            );
                                        }
                                        if (state!=fdm.models.DownloadState.Completed && this.state.progress < 0){
                                            return (
                                                <span className="percents" dangerouslySetInnerHTML={{__html: '&nbsp;'}}></span>
                                            );
                                        }

                                    }.apply(this)}

                                    { !moving_progress && state==fdm.models.DownloadState.Downloading && this.state.isQueued ?
                                        <span className="download-time time">{__('Queued')}</span>
                                        : null }
                                    { state==fdm.models.DownloadState.Downloading && !this.state.isQueued ?
                                        <span className="download-time time">{fdm.timeUtils.remainingTime(download.getRemainingTime())}</span>
                                        : null }
                                    { !moving_progress && (state==fdm.models.DownloadState.Paused || state==fdm.models.DownloadState.Pausing) ?
                                        <span className="download-time time">{__('Paused')}</span>
                                        : null }

                                </div>

                            );
                        }


                    }.apply(this)}

                    { !no_size && state!=fdm.models.DownloadState.Completed || moving_progress ?

                        <div className="compact-progress-line">

                            {moving_progress ?
                                <div className="compact-download-progress"
                                     style={{
                                         width: this.state.moveProgress + '%',
                                         display: this.state.moveProgress < 0 ? 'none' : 'block'
                                     }}></div>
                                :

                                state==fdm.models.DownloadState.Checking ?

                                    <div className="compact-download-progress"
                                         style={{
                                             width: this.state.checkingProgress + '%',
                                             display: this.state.checkingProgress < 0 ? 'none' : 'block'
                                         }}></div> :
                                    <div className="compact-download-progress"
                                         style={{
                                             width: this.state.progress + '%',
                                             display: this.state.progress < 0 ? 'none' : 'block'
                                         }}></div>
                            }
                        </div>

                        : null }

                    {state==fdm.models.DownloadState.Completed && !this.state.isMoving && !requesting_info
                        && this.state.filesCount > 0 && this.state.filesCount > this.state.filesChosenCount && !show_error ?

                        <div className="no-size"><span>
                            {__('Completed %n / %2 files', [this.state.filesChosenCount, this.state.filesCount])}
                        </span></div>

                        : null }

                    {state==fdm.models.DownloadState.Completed && !this.state.isMoving && !requesting_info
                        && !(this.state.filesCount > 0 && this.state.filesCount > this.state.filesChosenCount) ?

                        <div className="download-complete"><span>{__('Complete')}</span></div>

                        : null }

                </div>
                <div className="compact-download-speed">

                    <div className="priority_buttons" onMouseDown={stopEventBubble}>
                        <div className={rjs_class({
                            priority_button_up: true, disabled: this.state.priority == fdm.models.downloadPriority.High
                        })} onClick={_.partial(this.changePriority, 'up')}></div>
                        <div className={rjs_class({
                            priority_button_down: true, disabled: this.state.priority == fdm.models.downloadPriority.Low
                        })} onClick={_.partial(this.changePriority, 'down')}></div>
                        <div className="priority_button_text">{__('Priority')}</div>
                    </div>

                    {function(){

                        if (show_low_disk_space_msg)
                        {
                            return (
                                <span className="download-speed">
                                    <span className="error-message">{__('Low disk space')}</span>
                                </span>
                            );
                        }

                        if (this.state.downloadType != fdm.models.DownloadType.Trt && state!=fdm.models.DownloadState.Downloading)
                            return null;

                        var dlSpeed = this.state.downloadSpeedBytes;
                        var ulSpeed = this.state.uploadSpeedBytes ? this.state.uploadSpeedBytes : 0;
                        var seeding_enabled = this.state.downloadType == fdm.models.DownloadType.Trt
                            && this.state.seedingEnabled && state == fdm.models.DownloadState.Completed && class_name != 'download-ending';

                        seeding_enabled = seeding_enabled || false;

                        if (dlSpeed == 0 && seeding_enabled)
                            return (
                                <span className="download-speed">
                                    <span key="1" className="cancel">
                                        <span className="wrapper_cancel" onMouseDown={stopEventBubble} onClick={this.disableSeeding}>
                                            <span className="cancel_button"></span>
                                            <span>{__('Stop seeding')}</span>
                                        </span>
                                    </span>
                                    <span key="2" className="arrow_up"></span>
                                    <span key="3" className="txt">{fdm.speedUtils.speed2SignDigits(ulSpeed)}</span>
                                </span>
                            );

                        var resultSpeedText = [];
                        if (dlSpeed > 0)
                            resultSpeedText.push( [
                                <span key="4" className="arrow_dwn"></span>,
                                <span key="5">{fdm.speedUtils.speed2SignDigits(dlSpeed)}</span>
                            ] );

                        if (dlSpeed > 0 && ulSpeed > 0)
                            resultSpeedText.push(<span key="6">; </span>);

                        if (ulSpeed > 0)
                            resultSpeedText.push( [
                                <span key="7" className="arrow_up"></span>,
                                <span key="8">{fdm.speedUtils.speed2SignDigits(ulSpeed)}</span>
                            ]);

                        return (
                            <span className="download-speed">
                                {resultSpeedText}
                            </span>
                        );


                    }.apply(this)}

                </div>

                <div className="compact-download-size">
                    <span className="download-size">{fdm.sizeUtils.byteProgressAsText(this.state.downloadedBytes, this.state.totalBytes)}</span>
                </div>

                {this.props.showCompletedDate ?

                    <div className="compact-download-date" title={fdm.dateUtils.downloadDateTitle(this.state.completionDate)}>
                        <span className="download-date">{fdm.dateUtils.downloadDateText(this.state.completionDate)}</span>
                    </div>
                    :
                    <div className="compact-download-date" title={fdm.dateUtils.downloadDateTitle(this.state.createdDate)}>
                        <span className="download-date">{fdm.dateUtils.downloadDateText(this.state.createdDate)}</span>
                    </div>
                }

            </li>
        );
    }
});




var MouseSlideMixin = {
    mouseSlideDownloadStart: null,
    startInSelection: false,
    startInCheckbox: false,
    mouseSlideDownloadEnd: null,
    mouseSlideHasSelect: false,

    mouseSlideStart: function(e){

        if (e.target.classList.contains('triangle'))
            return;

        if (e.button != 0 || e.button == 0 && fdmApp.platform == 'mac' && e.ctrlKey)
            return;

        this.mouseSlideDownloadStart = this.getDownloadOnTarget(e.target);
        this.startInSelection = false;
        this.startInCheckbox = false;

        if ((e.target.nodeName.toLowerCase() == 'span' && $(e.target).hasClass('checkbox-fake'))
            || e.target.nodeName.toLowerCase() == 'div' && $(e.target).hasClass('compact-checkbox-wrap'))
            this.startInCheckbox = true;

        if (this.mouseSlideDownloadStart != null){

            if (this.templateName == 'Downloads'){

                if ( app.controllers.downloads.isSelectedId(this.mouseSlideDownloadStart.id) )
                    this.startInSelection = true;
            }
            if (this.templateName == 'DownloadsTable'){

                if ( this.state.selectedFiles && this.state.selectedFiles[this.mouseSlideDownloadStart.id] )
                    this.startInSelection = true;
            }
            if (this.templateName == 'FilesTable'){

                if ( this.state.selectedFiles && this.state.selectedFiles[this.mouseSlideDownloadStart.id] )
                    this.startInSelection = true;
            }

        }
        document.addEventListener('mousemove', this.mouseSlideMove);
        document.addEventListener('mouseup', this.mouseSlideEnd);

        if (this.templateName == 'Downloads'){

            FdmDispatcher.handleViewAction({
                actionType: 'downloadsMouseSlideStart',
                content: {}
            });

            var bottom_trsprnt = document.getElementById('bottom_trsprnt_scroll');
            if (bottom_trsprnt){
                bottom_trsprnt.addEventListener('mouseover', this.mouseSlideOver);
                bottom_trsprnt.addEventListener('mouseout', this.mouseSlideOut);
            }

            var top_trsprnt = document.getElementById('top_trsprnt_scroll');
            if (top_trsprnt){
                top_trsprnt.addEventListener('mouseover', this.mouseSlideOver);
                top_trsprnt.addEventListener('mouseout', this.mouseSlideOut);
            }
        }

    },
    mouseSlideEnd: function(e){

        this.selectDownloadsOnSlide(e);
        document.removeEventListener('mousemove', this.mouseSlideMove);
        document.removeEventListener('mouseup', this.mouseSlideEnd);
        this.mouseSlideDownloadStart = null;
        this.startInSelection = false;
        this.mouseSlideDownloadEnd= null;
        this.mouseSlideHasSelect= false;

        if (this.templateName == 'Downloads'){

            var bottom_trsprnt = document.getElementById('bottom_trsprnt_scroll');
            if (bottom_trsprnt){
                bottom_trsprnt.removeEventListener('mouseover', this.mouseSlideOver);
                bottom_trsprnt.removeEventListener('mouseout', this.mouseSlideOut);
            }

            var top_trsprnt = document.getElementById('top_trsprnt_scroll');
            if (top_trsprnt){
                top_trsprnt.removeEventListener('mouseover', this.mouseSlideOver);
                top_trsprnt.removeEventListener('mouseout', this.mouseSlideOut);
            }

            FdmDispatcher.handleViewAction({
                actionType: 'downloadsMouseSlideEnd',
                content: {}
            });
        }

        clearInterval(this.mouseSlideTimeInterval);
        // this.needSetMouseInterval = false;

    },
    // needSetMouseInterval: false,
    lastMouseSlideMoveTime: false,
    mouseSlideTimeInterval: 0,
    lastMouseSlideMoveData: 0,

    mouseSlideOver: function(e){

        // this.needSetMouseInterval = true;

        this.mouseSlideTimeInterval = setInterval(
            this.mouseNotMove,
            30
        );

    },
    mouseSlideOut: function(e){

        clearInterval(this.mouseSlideTimeInterval);
        // this.needSetMouseInterval = false;
    },
    mouseNotMove: function(){

        if ((+ new Date()) - this.lastMouseSlideMoveTime < 100)
            return;

        this.selectDownloadsOnSlide(this.lastMouseSlideMoveData);
    },

    mouseSlideMove: function(e){

        if (this.templateName != 'Downloads'){

            if (this.mouseSlideTimeInterval){

                clearInterval(this.mouseSlideTimeInterval);
                this.mouseSlideTimeInterval = false;
            }

            var scroll_dom = ReactDOM.findDOMNode(this);
            var scroll_rect = scroll_dom.getBoundingClientRect();

            if (e.pageY > scroll_rect.bottom + 10 || e.pageY < scroll_rect.top - 10){
                this.mouseSlideOver(e);
            }
            else
                this.mouseSlideOut(e);
        }

        this.lastMouseSlideMoveData = {
            pageY: e.pageY,
            target: e.target,
            metaKey: e.metaKey,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey
        };

        this.lastMouseSlideMoveTime = (+ new Date());

        this.selectDownloadsOnSlide(e);
    }
};



var Downloads = React.createClass({

    templateName: 'Downloads',

    mixins: [MouseSlideMixin],

    dispatcherIndex: false,

    getInitialState: function() {

        var downloads = app.controllers.downloads.collections.currentDownloads;

        var state = {};
        state.hasScroll = false;
        state.downloads = downloads;
        state.selectedList = app.controllers.downloads.collections.currentSelectedList;
        state.viewInfo = app.controllers.downloads.view_model.getViewItemsPositions(downloads.length);
        state.statusFilter = app.controllers.downloads.model.get('statusFilter');

        return state;
    },

    componentDidMount: function(){

        _.bindAll(this, 'mouseSlideEnd', 'mouseSlideStart', 'changeScroll', 'changeSize', 'mouseSlideMove',
            'mouseSlideOver', 'mouseSlideOut', 'mouseNotMove');
        window.addEventListener('resize', this.changeSize);
        document.getElementById('downloads-scroll-container').addEventListener('scroll', this.changeScroll);
        document.getElementById('downloads-scroll-container').addEventListener('mousedown', this.mouseSlideStart);
        app.controllers.downloads.collections.currentDownloads.on('add reset remove sort', this.changeDownloads, this);
        app.controllers.downloads.collections.currentSelectedList.on('add reset remove', this.changeSelected, this);
        app.controllers.bottomPanel.model.on('change:panelVisible', this.needUpdateScrollFlag, this);

        app.controllers.downloads.model.on('change:statusFilter', this.changeStatusFilter, this);

        this.dispatcherIndex = FdmDispatcher.register(function(payload) {

            if (payload.source == 'VIEW_ACTION'){

                if (payload.action.actionType == 'changeBottomPanelHeight')
                    this.needUpdateScrollFlag.apply(this);
                /*if (payload.action.actionType == 'WindowOnFocus')
                    this.windowOnFocus.apply(this);*/
            }

            return true; // No errors. Needed by promise in Dispatcher.
        }.bind(this));
    },

    componentWillUnmount: function() {

        window.removeEventListener('resize', this.changeSize);
        document.getElementById('downloads-scroll-container').removeEventListener('scroll', this.changeScroll);
        document.getElementById('downloads-scroll-container').removeEventListener('mousedown', this.mouseSlideStart);
        app.controllers.downloads.collections.currentDownloads.off('add reset remove sort', this.changeDownloads, this);
        app.controllers.downloads.collections.currentSelectedList.off('add reset remove', this.changeSelected, this);

        app.controllers.bottomPanel.model.off('change:panelVisible', this.needUpdateScrollFlag, this);

        app.controllers.downloads.model.off('change:statusFilter', this.changeStatusFilter, this);

        FdmDispatcher.unregister(this.dispatcherIndex);
    },

    getDownloadOnTarget: function (target) {

        return app.controllers.downloads.getDownloadOnTarget(target);
    },

    /*windowOnFocus: function(){

        var scroll_container = ReactDOM.findDOMNode(this);

        console.error('windowOnFocus');
        if (scroll_container){
            var prev_left = scroll_container.style.left;
            scroll_container.style.left = '9px';
            _.delay(function(){
                scroll_container.style.left = prev_left
            }, 200);
        }

    },*/

    changeStatusFilter: function(){

        this.setState({
            statusFilter: app.controllers.downloads.model.get('statusFilter')
        });
    },

    changeScroll: function(){

        this.setState({
            viewInfo: app.controllers.downloads.view_model.getViewItemsPositions(this.state.downloads.length)
        });
    },

    changeSize: function(){
        this.setState({
            viewInfo: app.controllers.downloads.view_model.getViewItemsPositions(this.state.downloads.length)
        });
    },

    changeDownloads: function(){

        var downloads = app.controllers.downloads.collections.currentDownloads;
        this.setState({
            downloads: downloads,
            viewInfo: app.controllers.downloads.view_model.getViewItemsPositions(downloads.length)
        });
        _.defer(_.bind(this.needUpdateScrollFlag, this));
    },

    changeSelected: function(){

        this.setState({
            selectedList: app.controllers.downloads.collections.currentSelectedList
        });
    },

    updateScrollFlagTimeout: 0,
    needUpdateScrollFlag: function(){

        if (this.updateScrollFlagTimeout){
            clearTimeout(this.updateScrollFlagTimeout);
        }
        this.updateScrollFlagTimeout = setTimeout(_.bind(this.updateHasScrollFlag, this), 50);
    },
    updateHasScrollFlag: function(){

        var ul = ReactDOM.findDOMNode(this);
        var has_scroll = ul.clientHeight < ul.scrollHeight;

        if (has_scroll != this.state.hasScroll)
            this.setState({hasScroll: ul.clientHeight < ul.scrollHeight});
    },

    selectDownloadsOnSlide: function(e)
    {
        var start_row = this.mouseSlideDownloadStart;

        if (start_row == null)
            return;

        var current_row = this.getDownloadOnTarget(e.target);

        if (current_row == this.mouseSlideDownloadEnd)
            return;

        if (!current_row){

            var scroll_dom = ReactDOM.findDOMNode(this);
            var scroll_rect = scroll_dom.getBoundingClientRect();

            var scroll_top = scroll_dom.scrollTop;
            var scroll_height = scroll_dom.scrollHeight;

            var top = 118;

            var new_scroll_top;
            var download_position;
            if (e.pageY > scroll_rect.height + top + 10){
                new_scroll_top = Math.max(0, scroll_top + Math.min(30, (e.pageY - (scroll_rect.height + top + 10))));
                scroll_dom.scrollTop = new_scroll_top;

                download_position = new_scroll_top + scroll_rect.height - 47;

            }
            if (e.pageY < top - 10){
                new_scroll_top = scroll_dom.scrollTop = Math.min((scroll_height - scroll_rect.height), (scroll_top - Math.min(30, (top - e.pageY - 10))));

                scroll_dom.scrollTop = new_scroll_top;
                download_position = new_scroll_top - 10;
            }
            if (download_position){
                current_row = app.controllers.downloads.view_model.getItemByScrollPosition(download_position);
            }
        }


        if (current_row && (current_row.id != start_row.id || this.mouseSlideHasSelect)){

            var downloads = this.state.downloads;
            var controller = app.controllers.downloads;

            var start_download  = downloads.get(start_row.id);
            var current_download  = downloads.get(current_row.id);

            if (start_download && current_download){

                var ctrlKey = false;
                if (fdmApp.platform == 'mac')
                    ctrlKey = e.metaKey;
                else
                    ctrlKey = e.ctrlKey;

                if (!ctrlKey && !this.startInCheckbox){
                    controller.clearSelection();
                }

                if (e.shiftKey && this.mouseSlideDownloadEnd && current_row.id != this.mouseSlideDownloadEnd.id){
                    var end_download  = downloads.get(this.mouseSlideDownloadEnd.id);
                    controller.removeSelectRange( start_download, end_download );
                }

                if ((ctrlKey || this.startInCheckbox) && this.startInSelection)
                    controller.removeSelectRange( start_download, current_download );
                else
                    controller.selectRange( start_download, current_download );
                this.mouseSlideHasSelect = true;

                this.mouseSlideDownloadEnd = current_download;
                stopEventBubble(e);
            }
        }
    },

    clearSelection: function(e){

        if (window.innerWidth - e.pageX > 25 )
            this.props.controller.clearSelection();
    },


    render: function() {

        var model = this.props.model;
        var view_model = this.props.view_model;
        var controller = this.props.controller;
        var downloads = this.state.downloads;
        var selected_list = this.state.selectedList;
        var view_info = this.state.viewInfo;

        var showCompletedDate = this.state.statusFilter == fdm.models.DownloadStateFilters.Completed;

        var rows = [];
        if (downloads.length > 0){

            if (view_info.before_view > 0){

                rows.push(<DownloadEmptyDiv key="up" height={view_info.before_height} />);
            }

            for (var i = view_info.id_start; i <= view_info.id_end; i++) {

                var download =  downloads.at(i);

                if (download){
                    var is_selected = selected_list.get( download.id ) !== undefined;

                    rows.push(
                        <Download key={download.id}
                                  index={i}
                                  download={download}
                                  showCompletedDate={showCompletedDate}
                                  isSelected={is_selected}
                                  model={model}
                                  view_model={view_model}
                                  controller={controller} />
                    );
                }
            }

            if (view_info.after_view > 0){

                rows.push(<DownloadEmptyDiv key="down" height={view_info.after_height + 2} />);
            }
        }

        return (
            <ul className={rjs_class({
                'download-list': true,
                has_scroll: this.state.hasScroll
            })}
                id="downloads-scroll-container"
                onMouseDown={this.clearSelection}
                data-length={downloads.length}>

                {rows}

            </ul>
        );
    }
});

