

var CalculateChecksumDialog = React.createClass({displayName: "CalculateChecksumDialog",

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

            React.createElement("div", {id: "download-popup-overlay2", 
                 onMouseDown: this.toolbarDragStart, onDoubleClick: this.toolbarDoubleClick, 
                 className: "popup__overlay hash_popup"}, 
                React.createElement("div", null, 
                    React.createElement("div", {className: "mount"}), 
                    React.createElement("div", {className: "delete"}, 

                        React.createElement("div", {className: "header"}, 
                            React.createElement("div", null, __('Check file integrity')), 
                            React.createElement("div", {className: "close_button", onClick: this.close})
                        ), 

                        React.createElement("div", {className: "top_add_ul center"}, 

                            React.createElement("div", {className: "popup_top"}, 
                                React.createElement("div", {className: "title"}, 
                                    React.createElement("span", {className: "for_copy"}, download.get('fileName')), 
                                    React.createElement("span", {className: "size"}, 
                                ' (' + fdm.sizeUtils.bytesAsText(download.get('totalBytes')) + ')'
                                )
                                )
                            ), 

                            React.createElement("div", {className: "block_element"}, 

                                React.createElement("label", null, __('Hash')), 

                            React.createElement("div", {className: "transparent_select", onClick: this.closeSelect, 
                                 style: {display: this.state.selectOpened ? null : 'none'}}), 
                            React.createElement("div", {onClick: this.toggleSelect, className: "wrapper_inselect inselect"}, 
                                React.createElement("span", null, current_function.get('name')), 
                                React.createElement("div", {className: "dropdown_button", onClick: this.toggleSelect}), 

                                this.state.selectOpened ?

                                    React.createElement("div", {className: "list"}, 

                                        this.state.hashFunctions.map(function(f, i){

                                            return (

                                                React.createElement("div", {key: i, onClick: _.partial(this.changeCurrentHashFunction, f)}, React.createElement("span", null, f.get('name')))
                                            );
                                        }.bind(this))
                                    )

                                    : null

                            ), 

                            current_function_state == fdm.models.calculateChecksumStates.New ?

                                React.createElement("a", {onClick: _.partial(this.calculate, current_function), className: "blue_btn", href: "#"}, __('Calculate'))
                                : null, 

                            current_function_state == fdm.models.calculateChecksumStates.InProgress ?

                                React.createElement("div", {className: "calculating"}, 
                                    React.createElement("span", null, __('Calculating') + ' ' + current_function_percent + '%'), 
                                    React.createElement("div", {className: "compact-progress-line"}, 
                                        React.createElement("div", {className: "compact-download-progress", style: {width: current_function_percent + '%', display: 'block'}})
                                    )
                                )
                                : null, 

                            current_function_state == fdm.models.calculateChecksumStates.Error ?

                                React.createElement("span", {className: "error"}, current_function.get('errorMsg'))
                                : null, 

                            current_function_state == fdm.models.calculateChecksumStates.Completed ?

                                React.createElement("input", {type: "text", className: "inp_txt", value: current_function.get('hash'), disabled: true})

                                : null

                            ), 

                            React.createElement("label", null, __('Compare with')), 
                            React.createElement("input", {type: "text", 
                                   value: this.state.compareInput, 
                                   defaultValue: this.state.compareInput, 
                                   onChange: this.changeCompareInput, 
                                   className: rjs_class({
                                    success_state: success_state,
                                    error_state: error_state
                                   })}), 

                            success_state ?
                                React.createElement("span", {className: "success_txt"}, __('Verification OK'))
                                : null, 
                            error_state ?
                                React.createElement("span", {className: "error_txt"}, __('Verification failed'))
                                : null

                        ), 
                        React.createElement("div", {className: "bottom"}, 
                            React.createElement("div", {className: "group_button"}, 

                                React.createElement("button", {className: "left_button cancel linkblock", onClick: this.close, 
                                        onMouseDown: this.buttonMouseDown}, __('Close'))

                            )
                        )
                    )
                )
            )

        );
    }
});