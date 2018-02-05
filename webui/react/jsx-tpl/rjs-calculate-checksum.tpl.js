

var CalculateChecksumDialog = React.createClass({

    mixins: [ButtonMixin, ToolbarDragMixin],

    toolbarDragId: 'download-popup-overlay2',

    dispatcherIndexKeyDown: false,

    getInitialState: function () {

        var state = app.controllers.calculateChecksumDialog.model.toJSON();
        state.selectOpened = false;
        state.compareInput = '';
        return state;
    },

    componentDidMount: function() {

        app.controllers.calculateChecksumDialog.model.on('change', this._onChange, this);
        app.controllers.calculateChecksumDialog.model.get('hashFunctions').on('all', this._onChange, this);

        this.dispatcherIndexKeyDown = FdmDispatcher.register(function(payload) {

            if (!this.state.dialogOpened)
                return true;

            if (payload.source == 'VIEW_ACTION'){
                if (payload.action.actionType == 'GlobalKeyDown')
                    return this.globalKeyDown(payload.action.content);
            }

            return true; // No errors. Needed by promise in Dispatcher.
        }.bind(this));
    },

    componentWillUnmount: function() {

        app.controllers.calculateChecksumDialog.model.off('change', this._onChange, this);
        app.controllers.calculateChecksumDialog.model.get('hashFunctions').off('all', this._onChange, this);

        FdmDispatcher.unregister(this.dispatcherIndexKeyDown);
    },

    _onChange: function() {

        var json = app.controllers.calculateChecksumDialog.model.toJSON();

        if (json.dialogOpened != this.state.dialogOpened)
            json.compareInput = '';

        this.setState(json);
    },

    globalKeyDown: function(content){

        if (content.keyCode === 27){
            this.close();
        }

    },

    close: function(){

        app.controllers.calculateChecksumDialog.close();
    },

    closeSelect: function(){

        this.setState({
            selectOpened: false
        });
    },

    toggleSelect: function(){

        this.setState({
            selectOpened: !this.state.selectOpened
        });
    },

    changeCurrentHashFunction: function(f, e){

        app.controllers.calculateChecksumDialog.changeCurrentHashFunction(f);
    },

    calculate: function(f){

        app.controllers.calculateChecksumDialog.calculateChecksum(f);
    },

    changeCompareInput: function(e){

        this.setState({
            compareInput: e.target.value
        });
    },

    render: function() {

        if (!this.state.dialogOpened)
            return null;

        var current_function = this.state.hashFunctions.get(this.state.currentHashId);
        if (!current_function)
            current_function = this.state.hashFunctions.first();

        var current_function_state = current_function.get('state');
        var current_function_percent = parseInt(current_function.get('percent'));

        var download = this.state.download;

        if (!download)
            return null;

        var success_state = false;
        var error_state = false;

        if (current_function_state == fdm.models.calculateChecksumStates.Completed && this.state.compareInput.length){

            if (this.state.compareInput == current_function.get('hash'))
                success_state = true;
            else
                error_state = true;
        }


        return (

            <div id="download-popup-overlay2"
                 onMouseDown={this.toolbarDragStart} onDoubleClick={this.toolbarDoubleClick}
                 className="popup__overlay hash_popup">
                <div>
                    <div className="mount"></div>
                    <div className="delete">

                        <div className="header">
                            <div>{__('Check file integrity')}</div>
                            <div className="close_button" onClick={this.close}></div>
                        </div>

                        <div className="top_add_ul center">

                            <div className="popup_top">
                                <div className="title">
                                    <span className="for_copy">{download.get('fileName')}</span>
                                    <span className="size">
                                {' (' + fdm.sizeUtils.bytesAsText(download.get('totalBytes')) + ')'}
                                </span>
                                </div>
                            </div>

                            <div className="block_element">

                                <label>{__('Hash')}</label>

                            <div className="transparent_select" onClick={this.closeSelect}
                                 style={{display: this.state.selectOpened ? null : 'none'}}></div>
                            <div onClick={this.toggleSelect} className="wrapper_inselect inselect">
                                <span>{current_function.get('name')}</span>
                                <div className="dropdown_button" onClick={this.toggleSelect}></div>

                                {this.state.selectOpened ?

                                    <div className="list">

                                        {this.state.hashFunctions.map(function(f, i){

                                            return (

                                                <div key={i} onClick={_.partial(this.changeCurrentHashFunction, f)}><span>{f.get('name')}</span></div>
                                            );
                                        }.bind(this))}
                                    </div>

                                    : null }

                            </div>

                            {current_function_state == fdm.models.calculateChecksumStates.New ?

                                <a onClick={_.partial(this.calculate, current_function)} className="blue_btn" href="#">{__('Calculate')}</a>
                                : null }

                            {current_function_state == fdm.models.calculateChecksumStates.InProgress ?

                                <div className="calculating">
                                    <span>{__('Calculating') + ' ' + current_function_percent + '%'}</span>
                                    <div className="compact-progress-line">
                                        <div className="compact-download-progress" style={{width: current_function_percent + '%', display: 'block'}}></div>
                                    </div>
                                </div>
                                : null }

                            {current_function_state == fdm.models.calculateChecksumStates.Error ?

                                <span className="error">{current_function.get('errorMsg')}</span>
                                : null }

                            {current_function_state == fdm.models.calculateChecksumStates.Completed ?

                                <input type="text" className="inp_txt" value={current_function.get('hash')} disabled={true} />

                                : null }

                            </div>

                            <label>{__('Compare with')}</label>
                            <input type="text"
                                   value={this.state.compareInput}
                                   defaultValue={this.state.compareInput}
                                   onChange={this.changeCompareInput}
                                   className={rjs_class({
                                    success_state: success_state,
                                    error_state: error_state
                                   })}/>

                            {success_state ?
                                <span className="success_txt">{__('Verification OK')}</span>
                                : null }
                            {error_state ?
                                <span className="error_txt">{__('Verification failed')}</span>
                                : null }

                        </div>
                        <div className="bottom">
                            <div className="group_button">

                                <button className="left_button cancel linkblock" onClick={this.close}
                                        onMouseDown={this.buttonMouseDown}>{__('Close')}</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
});