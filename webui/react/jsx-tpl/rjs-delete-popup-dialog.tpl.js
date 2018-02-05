

var DeletePopupDialog = React.createClass({

    mixins: [ButtonMixin, ToolbarDragMixin],

    toolbarDragId: 'download-popup-overlay1',

    dispatcherIndexKeyDown: false,

    getInitialState: function () {

        var state = {};
        state.opened = app.controllers.downloads.model.get('showDeletePopupDialog');
        state.downloadsExistsOnDisk = app.controllers.downloads.model.get('downloadsExistsOnDisk');
        state.deleteDialogChoice = app.controllers.downloads.model.get('deleteDialogChoice');
        state.deleteDialogCheckbox = app.controllers.downloads.model.get('deleteDialogCheckbox');
        state.selectedFiles = [];

        return state;
    },

    _onChange: function() {

        var state = {};
        state.opened = app.controllers.downloads.model.get('showDeletePopupDialog');
        state.downloadsExistsOnDisk = app.controllers.downloads.model.get('downloadsExistsOnDisk');
        state.deleteDialogChoice = app.controllers.downloads.model.get('deleteDialogChoice');
        state.deleteDialogCheckbox = app.controllers.downloads.model.get('deleteDialogCheckbox');

        if (state.opened){
            var selected = app.controllers.downloads.getDownloadsToMoveAndRemove();

            var selectedFiles = [];
            for (var i = 0; i < selected.length; i ++){

                if (state.downloadsExistsOnDisk.indexOf(selected[i].get('id')) < 0)
                    continue;

                var file_path =  selected[i].get('outputFilePath');

                if (file_path)
                    selectedFiles.push(file_path);
            }
            state.selectedFiles = selectedFiles;
        }
        else{
            state.selectedFiles = [];
        }

        this.setState(state);
    },

    componentDidMount: function() {

        app.controllers.downloads.model.on('change:showDeletePopupDialog change:downloadsExistsOnDisk', this._onChange, this);
        app.controllers.downloads.model.on('change:deleteDialogCheckbox', this._onChange, this);

        this.dispatcherIndexKeyDown = FdmDispatcher.register(function(payload) {

            if (!this.state.opened)
                return true;

            if (payload.source == 'VIEW_ACTION'){
                if (payload.action.actionType == 'GlobalKeyDown')
                    return this.globalKeyDown(payload.action.content);
            }

            return true; // No errors. Needed by promise in Dispatcher.
        }.bind(this));
    },

    componentWillUnmount: function() {

        app.controllers.downloads.model.off('change:showDeletePopupDialog change:downloadsExistsOnDisk', this._onChange, this);
        app.controllers.downloads.model.off('change:deleteDialogCheckbox', this._onChange, this);

        FdmDispatcher.unregister(this.dispatcherIndexKeyDown);
    },

    globalKeyDown: function(content){

        if (content.keyCode === 27){
            this.close();
        }

    },

    close: function(){

        app.controllers.downloads.hideDeletePopupDialog();

    },

    rememberChoiceChange: function(e){

        app.controllers.downloads.model.set('deleteDialogCheckbox', e.target.checked);

    },

    submit: function(e){

        if (this.state.deleteDialogChoice == fdm.models.deleteDialogChoice.fromDisk)
            app.controllers.downloads.deleteSelected(true);
        else
            app.controllers.downloads.deleteSelected(false);

        app.controllers.downloads.hideDeletePopupDialog();
    },

    submitFromDisk: function(e){

        if (this.state.deleteDialogCheckbox)
            app.controllers.downloads.model.set({deleteDialogChoice: fdm.models.deleteDialogChoice.fromDisk});
        app.controllers.downloads.deleteSelected(true);
        app.controllers.downloads.hideDeletePopupDialog();
    },

    submitFromList: function(e){

        if (this.state.deleteDialogCheckbox)
            app.controllers.downloads.model.set({deleteDialogChoice: fdm.models.deleteDialogChoice.fromList});
        app.controllers.downloads.deleteSelected(false);
        app.controllers.downloads.hideDeletePopupDialog();
    },

    render: function() {

        if (!this.state.opened)
            return null;

        if (this.state.deleteDialogChoice == fdm.models.deleteDialogChoice.notSave){
            return (
                <div id="download-popup-overlay1"
                     onMouseDown={this.toolbarDragStart} onDoubleClick={this.toolbarDoubleClick}
                     className="popup__overlay" onClick={this.close}>
                    <div className="mount"></div>

                    <div className={rjs_class({
                        delete: true,
                        delete_files: this.state.selectedFiles.length > 1
                    })} onMouseDown={stopPropagation}>
                        <div className="header">
                            <div>{__('Delete selected downloads')}</div>
                            <div className="close_button" onClick={this.close}></div>
                        </div>

                        <div className="center">

                            <div onMouseDown={stopEventBubble}>
                                <div className="disk">
                                    <ul className="files_list">
                                        {this.state.selectedFiles.map(function(file, index){
                                            return <li className="for_copy delete_fname" title={file} key={index}><span>{file}</span></li>;

                                        })}
                                    </ul>

                                </div>
                            </div>
                        </div>

                        <input checked={this.state.deleteDialogCheckbox} defaultChecked={this.state.deleteDialogCheckbox}
                               onChange={this.rememberChoiceChange} type="checkbox" id="remember-choice" />
                        <label htmlFor="remember-choice">{__('Remember my choice')}</label>

                        <div className="bottom_add_ul bottom">
                            <div className="group_button">
                                <button className="right_button from_disk" onClick={this.submitFromDisk}
                                        onMouseDown={this.buttonMouseDown}>
                                    {fdmApp.platform == 'mac' ? __('Move to trash') :
                                        ( this.state.selectedFiles.length == 1 ? __('Delete file') : __('Delete files') )}
                                </button>
                                <button className="right_button linkblock" onClick={this.submitFromList}
                                        onMouseDown={this.buttonMouseDown}>{__('Remove from list')}</button>
                                <button className="left_button cancel linkblock" onClick={this.close}
                                        onMouseDown={this.buttonMouseDown}>{__('Cancel')}</button>
                            </div>
                        </div>

                    </div>



                </div>
            );
        }


        return (

            <div id="download-popup-overlay2" className="popup__overlay" onMouseDown={this.close}>
                <div>
                    <div className="mount"></div>
                    <div className={rjs_class({
                            delete: true,
                            delete_files: this.state.selectedFiles.length > 1
                        })} onMouseDown={stopEventBubble}>

                        <div className="header">
                            <div>{fdmApp.platform == 'mac' ? __('Move to trash') :
                                ( this.state.selectedFiles.length == 1 ? __('Delete file') : __('Delete files') )}</div>
                            <div className="close_button" onClick={this.close}></div>
                        </div>


                        <div className="center">
                            <ul className="files_list">
                                {this.state.selectedFiles.map(function(file, index){
                                    return <li key={index} className="for_copy delete_fname" title={file}><span>{file}</span></li>;
                                })}
                            </ul>
                        </div>
                        <div className="bottom_add_ul bottom">
                            <div className="group_button">
                                <button className="left_button cancel linkblock" onClick={this.close}
                                        onMouseDown={this.buttonMouseDown}>{__('Cancel')}</button>
                                <button className="right_button linkblock" style={{float: 'none'}} onClick={this.submit}
                                        onMouseDown={this.buttonMouseDown}>{__('OK')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
});