

var ChangeUrlDialog = React.createClass({

    mixins: [ButtonMixin, ToolbarDragMixin],

    toolbarDragId: 'js_hash_popup',

    dispatcherIndexKeyDown: false,

    getInitialState: function () {

        var state = {};
        state.opened = app.controllers.downloads.model.get('changeUrlDialogShown');
        state.changeUrlDownloadProperties = app.controllers.downloads.model.get('changeUrlDownloadProperties');
        state.newDownloadUrl = '';
        state.startDownload = true;
        state.error = false;

        return state;
    },

    _onChange: function() {

        var state = {};
        state.opened = app.controllers.downloads.model.get('changeUrlDialogShown');
        state.changeUrlDownloadProperties = app.controllers.downloads.model.get('changeUrlDownloadProperties');

        var new_url = false;
        if (this.state.changeUrlDownloadProperties.id !== state.changeUrlDownloadProperties.id
            || this.state.opened !== state.opened){

            new_url = true;

            state.newDownloadUrl = state.changeUrlDownloadProperties.url;
            state.startDownload = true;
            state.error = false;
        }

        this.setState(state);

        if (new_url){

            _.defer(function(){
                var element = document.getElementById('change_download_url_input');
                if (element){
                    element.focus();
                    fdm.htmlUtils.setCaretPosition(element, state.changeUrlDownloadProperties.url.length);
                    element.select();
                }
            });
        }
    },

    componentDidMount: function() {

        app.controllers.downloads.model.on('change:changeUrlDialogShown change:changeUrlDownloadProperties', this._onChange, this);

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

        app.controllers.downloads.model.off('change:changeUrlDialogShown change:changeUrlDownloadProperties', this._onChange, this);

        FdmDispatcher.unregister(this.dispatcherIndexKeyDown);
    },

    globalKeyDown: function(content){

        if (content.keyCode === 27){
            this.close();
        }

    },

    close: function(){

        app.controllers.downloads.onChangeUrlCanceled();

    },

    submit: function(){

        var download_id = this.state.changeUrlDownloadProperties.id;

        fdmApp.downloads.validUrlForChange(download_id, this.state.newDownloadUrl, function(ok){

            if (!ok) {

                this.setState({error: true});
            }
            else {

                app.controllers.downloads.changeUrl(this.state.changeUrlDownloadProperties.id, this.state.newDownloadUrl, this.state.startDownload);
            }

        }.bind(this));
    },

    changeNewDownloadUrl: function (e) {

        this.setState({
            newDownloadUrl: e.target.value
        });

        if (this.state.error){

            this.setState({
                error: false
            });
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

    render: function() {

        if (!this.state.opened)
            return null;

        return (

            <div id="js_hash_popup"
                 onMouseDown={this.toolbarDragStart} onDoubleClick={this.toolbarDoubleClick}
                 onKeyDown={this.onKeyDown} className="popup__overlay hash_popup change_url">
                <div>
                    <div className="mount"></div>
                    <div className="change_url_wrapper">

                        <div className="header">
                            <div> {__('Change download URL')}</div>
                            <div className="close_button" onClick={this.close}></div>
                        </div>

                        <div className="center">

                            <label>{__('Enter new URL')}</label>
                            <input type="text" id="change_download_url_input"
                                   value={this.state.newDownloadUrl}
                                   defaultValue={this.state.newDownloadUrl}
                                   autoComplete="off"
                                   onChange={this.changeNewDownloadUrl}/>


                            {this.state.error ?
                                <span className="error_message">{__('Invalid URL')}</span>
                                : null}

                            <div className="file_title" style={{
                                visibility: this.state.error ? 'hidden' : false
                            }}>
                                <span className="f_text">{__('File location:') + ' '}</span>
                                <span className="size">

                                    <span className="for_copy">{this.state.changeUrlDownloadProperties.outputFilePath}</span>
                                    {this.state.changeUrlDownloadProperties.totalBytes > 0 ?
                                        ' (' + fdm.sizeUtils.bytesAsText(this.state.changeUrlDownloadProperties.totalBytes) + ')'
                                        : null}
                                </span>
                            </div>


                        </div>

                        <div className="bottom_add_ul bottom">

                            <div className="wrapper_label">
                                <input
                                    defaultChecked={this.state.startDownload}
                                    checked={this.state.startDownload}
                                    onChange={this.changeStartDownload}
                                    type="checkbox" id="start-download"/>
                                <label htmlFor="start-download">{__('Start download')}</label>
                            </div>

                            <div className="group_button">

                                <button className="left_button cancel linkblock" onClick={this.close}
                                        onMouseDown={this.buttonMouseDown}>{__('Cancel')}</button>
                                <button className="right_button linkblock" onClick={this.submit}
                                        onMouseDown={this.buttonMouseDown}>{__('OK')}</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
});