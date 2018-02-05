

var ChangePathDialog = React.createClass({

    mixins: [ButtonMixin, ToolbarDragMixin],

    toolbarDragId: 'js-change-path-dialog',

    dispatcherIndexKeyDown: false,

    getInitialState: function () {

        var state = {};
        state.opened = app.controllers.downloads.model.get('changePathDialogShown');
        state.download = app.controllers.downloads.model.get('changePathDialogDownload');
        state.startDownload = true;
        state.error = false;
        state.lastFolders = fdmApp.downloadWizard.getLastFolders();

        state.newDownloadPath = '';
        if (state.lastFolders.length > 0)
            state.newDownloadPath = state.lastFolders[0];

        state.newDownloadPathValid = false;
        state.newDownloadPathError = '';

        this.onChangeTargetFolder();

        return state;
    },

    _onChange: function() {

        var state = {};
        state.opened = app.controllers.downloads.model.get('changePathDialogShown');
        state.download = app.controllers.downloads.model.get('changePathDialogDownload');
        state.lastFolders = fdmApp.downloadWizard.getLastFolders();

        if (state.lastFolders.length > 0)
            state.newDownloadPath = state.lastFolders[0];
        else if (state.download)
            state.newDownloadPath = state.download.get('outputFilePath');

        if (this.state.newDownloadPath !== state.newDownloadPath)
        {
            state.newDownloadPathValid = false;
            state.newDownloadPathError = '';
        }

        this.onChangeTargetFolder();

        this.setState(state);
    },

    componentDidMount: function() {

        app.controllers.downloads.model.on('change:changePathDialogShown change:changePathDialogDownload', this._onChange, this);

        this.dispatcherIndexKeyDown = FdmDispatcher.register(function(payload) {

            if (!this.state.opened)
                return true;

            if (payload.source == 'VIEW_ACTION'){
                if (payload.action.actionType == 'GlobalKeyDown')
                    return this.globalKeyDown(payload.action.content);

                if (payload.action.actionType == 'ChangePathDialogFolderCallback')
                    return this.openFolderDialogCallback(payload.action.content);
            }

            return true; // No errors. Needed by promise in Dispatcher.
        }.bind(this));
    },

    componentWillUnmount: function() {

        app.controllers.downloads.model.off('change:changePathDialogShown change:changePathDialogDownload', this._onChange, this);

        FdmDispatcher.unregister(this.dispatcherIndexKeyDown);
    },

    globalKeyDown: function(content){

        if (content.keyCode === 27){
            this.close();
        }

    },

    close: function(){

        app.controllers.downloads.onChangePathCanceled();

    },

    submit: function(){

        var folder = this.state.newDownloadPath;

        if (folder === null)
        {
            this.setState({
                newDownloadPathValid: false,
                newDownloadPathError: '',
            });
        }
        else if (folder === "")

            this.setState({
                newDownloadPathValid: false,
                newDownloadPathError: __('Selected filepath is not valid.'),
            });
        else{

            fdmApp.system.validateFolder(folder, '', false, true, function(serialized){

                this.setState({
                    newDownloadPathValid: serialized[0],
                    newDownloadPathError: serialized[1],
                });

                if (serialized[0])
                    app.controllers.downloads.changePath(this.state.download.id, folder);

            }.bind(this));
        }
    },

    onKeyDown: function(e){

        if(e.keyCode === 27){

            stopEventBubble(e);
            this.close();
        }
        if(e.keyCode === 13){

            stopEventBubble(e);
            this.submit();
        }
    },

    changeStartDownload: function(e){

        this.setState({
            startDownload: e.target.checked
        });
    },

    divFolderSelectToggle: function(e){

        stopEventBubble(e);
        this.setState({
            divFolderSelectOpened: !this.state.divFolderSelectOpened
        });
    },
    divFolderSelectClose: function(e){

        stopEventBubble(e);

        if (this.state.divFolderSelectOpened)
            this.setState({divFolderSelectOpened: false});
    },
    lastFolderChange: function(value, e){

        stopEventBubble(e);

        this.setState({
            newDownloadPath: value
        });

        this.divFolderSelectClose();
        this.onChangeTargetFolder();
    },
    targetFolderChange: function(event) {

        this.setState({
            newDownloadPath: event.target.value
        });
        this.onChangeTargetFolder();
    },

    validateFolderTimeout: false,

    onChangeTargetFolder: function(){

        this.setValidateFolderTimeout();
    },

    setValidateFolderTimeout: function(){
        if (this.validateFolderTimeout)
            clearTimeout(this.validateFolderTimeout);

        this.validateFolderTimeout = setTimeout(function(){

            var folder = this.state.newDownloadPath;

            if (folder === null)
            {
                this.setState({
                    newDownloadPathValid: false,
                    newDownloadPathError: '',
                });
            }
            else if (folder === "")

                this.setState({
                    newDownloadPathValid: false,
                    newDownloadPathError: __('Selected filepath is not valid.'),
                });
            else{
                fdmApp.system.validateFolder(folder, '', false, true, function(serialized){

                    this.setState({
                        newDownloadPathValid: serialized[0],
                        newDownloadPathError: serialized[1],
                    });

                }.bind(this));
            }

        }.bind(this), 1000);
    },

    openFolderDialog: function(){

        fdmApp.system.openFolderDialog( this.state.newDownloadPath, 'change-path-dialog' );
    },

    openFolderDialogCallback: function(folder){

        this.setState({
            newDownloadPath: folder.targetFolder
        });
        this.onChangeTargetFolder();
    },

    render: function() {

        if (!this.state.opened || !this.state.download)
            return null;

        var download = this.state.download;

        var lastFolders = this.state.lastFolders || [];
        var targetFolder = this.state.newDownloadPath;

        return (
            <div onKeyDown={this.onKeyDown}
                 id="js-change-path-dialog"
                 onMouseDown={this.toolbarDragStart} onDoubleClick={this.toolbarDoubleClick}
                 className="temporary-style download-wiz-source-info popup__overlay change_path with_note">
                <div className="mount"></div>
                <div className="popup">
                    <div className="header">
                        <div>{__('Change download path')}</div>
                        <div className="close_button"></div>
                    </div>
                    <div className="center">
                        <div>
                            <div className="center_left">
                                <div className="saveto">
                                    <span className="title-input">{__('Enter new path:')}</span>
                                    <div className="cont_form">
                                        <div className="clear">
                                            <div id="containerTargetFolder" className="inselect wrapper_inselect" onClick={this.divFolderSelectToggle}>

                                                <div className="input_wrapper" onClick={stopEventBubble}>
                                                    <input value={targetFolder} defaultValue={targetFolder} onChange={this.targetFolderChange}
                                                           id="targetFolder" autoComplete="off" spellCheck="false" type="text" className="select-text"
                                                           onFocus={function(){document.getElementById('containerTargetFolder').className='inselect wrapper_inselect focus'}}
                                                           onBlur={function(){document.getElementById('containerTargetFolder').className='inselect wrapper_inselect'}}/>
                                                </div>

                                                <div className="transparent_select" style={{display: this.state.divFolderSelectOpened ? 'block' : 'none'}}
                                                     onClick={this.divFolderSelectClose}></div>
                                                <div className="dropdown_button"></div>

                                                { this.state.divFolderSelectOpened ?
                                                    <div className="list">

                                                        {lastFolders.map(function(folder, index){

                                                            if (folder == '')
                                                                return;

                                                            return (
                                                                <div key={index} onClick={_.partial(this.lastFolderChange, folder)}><span>{folder}</span></div>
                                                            );
                                                        }.bind(this))}

                                                    </div>
                                                    : null }

                                            </div>
                                            <button className="button_folder linkblock" title={__('Select folder')}
                                                    onClick={this.openFolderDialog}
                                                    onMouseDown={this.buttonMouseDown}></button>
                                        </div>
                                        <label className="link_name for_copy">{__('Old file location:')} <span className="for_copy">{download.get('outputFilePath')}</span></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="note_info">
                            <span>{__('Disk unavailable. Choose new download path.')}</span>
                        </div>
                    </div>
                    <div className="bottom">

                        <span className="error-message">
                            <span>{this.state.newDownloadPathError}</span>
                        </span>

                        <div className="group_button">

                            <button className="left_button cancel linkblock" onClick={this.close}
                                    onMouseDown={this.buttonMouseDown}>{__('Cancel')}</button>
                            <button className="right_button linkblock" onClick={this.submit}
                                    disabled={!this.state.newDownloadPathValid}
                                    onMouseDown={this.buttonMouseDown}>{__('Resume')}</button>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
});