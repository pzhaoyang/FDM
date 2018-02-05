

var SharerDialog = React.createClass({

    mixins: [ToolbarDragMixin],

    toolbarDragId: 'js_share_modal',

    dispatcherIndexKeyDown: false,

    getInitialState: function () {

        return app.controllers.sharer.model.toJSON();
    },

    componentDidMount: function() {

        app.controllers.sharer.model.on('change', this._onChange, this);

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

        app.controllers.sharer.model.off('change', this._onChange, this);

        FdmDispatcher.unregister(this.dispatcherIndexKeyDown);
    },

    _onChange: function() {

        this.setState(app.controllers.sharer.model.toJSON());
    },

    globalKeyDown: function(content){

        if (content.keyCode === 27){
            this.close();
        }

    },

    doNotShowAgainChange: function (e) {

        app.controllers.sharer.model.set('doNotShowAgain', e.target.checked);
    },

    close: function(){

        app.controllers.sharer.close();

    },

    mouseMove: function () {

        var dialog = ReactDOM.findDOMNode(this);

        if (!dialog)
            return;

        var buttons = dialog.getElementsByClassName('js_social_buttons');

        if (!buttons || !buttons.length)
            return;

        if (!$(buttons[0]).is(':visible'))
            $(buttons[0]).stop( true, true ).fadeIn();

        var bottom_text = dialog.getElementsByClassName('bottom_text');

        if (!bottom_text || !bottom_text.length)
            return;

        if ($(bottom_text[0]).is(':visible'))
            $(bottom_text[0]).stop( true, true ).fadeOut();
    },

    mouseEnter: function () {

        var dialog = ReactDOM.findDOMNode(this);

        if (!dialog)
            return;

        var buttons = dialog.getElementsByClassName('js_social_buttons');

        if (!buttons || !buttons.length)
            return;

        $(buttons[0]).stop( true, true ).fadeIn();

        var bottom_text = dialog.getElementsByClassName('bottom_text');

        if (!bottom_text || !bottom_text.length)
            return;

        $(bottom_text[0]).stop( true, true ).fadeOut();
    },

    mouseOut: function () {

        var dialog = ReactDOM.findDOMNode(this);

        if (!dialog)
            return;

        var buttons = dialog.getElementsByClassName('js_social_buttons');

        if (!buttons || !buttons.length)
            return;

        $(buttons[0]).stop( true, true ).fadeOut();

        var bottom_text = dialog.getElementsByClassName('bottom_text');

        if (!bottom_text || !bottom_text.length)
            return;

        $(bottom_text[0]).stop( true, true ).fadeIn();
    },

    share: function (type) {

        app.controllers.sharer.share(type);
    },

    render: function() {

        if (!this.state.dialogOpened)
            return null;

        if (this.state.showPreLoader){

            return (

                <div id="js_share_modal"
                    onMouseDown={this.toolbarDragStart} onDoubleClick={this.toolbarDoubleClick}
                    className="share_modal pre_loader" onClick={this.close}>
                    <div className="mount"></div>
                    <div className="wrapper_modal" onClick={stopEventBubble}>
                        <div className="wrapper_popup" style={this.state.style.wrapper_popup}>

                            <div onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseOut}>

                                <div className="absolute">
                                    <img src="preloading_FDM.gif" alt="" />

                                    {!this.state.hideButton ?
                                    <div className="title">
                                        Share with friends
                                    </div>
                                        : null }
                                </div>


                                <div className="close_button" onClick={this.close}></div>

                                {!this.state.hideButton ?
                                <div className="social_buttons" style={{display: 'block'}}>
                                    <div className="google" onClick={_.partial(this.share, 'google')}></div>
                                    <div className="facebook" onClick={_.partial(this.share, 'facebook')}></div>
                                    <div className="tweeter" onClick={_.partial(this.share, 'twitter')}></div>
                                </div>
                                    : null }

                            </div>
                        </div>
                    </div>
                </div>

            );
        }

        var wrapper_popup_style = _.clone(this.state.style.wrapper_popup);
        if (this.state.msgVariant == 2 && this.state.style.wrapper_popup)
            wrapper_popup_style.marginTop = parseInt(wrapper_popup_style.marginTop) - 50 + 'px';

        return (

            <div id="js_share_modal"
                onMouseDown={this.toolbarDragStart} onDoubleClick={this.toolbarDoubleClick}
                className={rjs_class({
                share_modal: true, // balloon text
                var1: this.state.msgVariant == 1, // balloon img
                var2: this.state.msgVariant == 2, // bottom text
                var3: this.state.msgVariant == 3  // top text
            })} onClick={this.close}>
                <div className="mount"></div>

                <div className="wrapper_modal">
                    <div className="wrapper_popup" onClick={stopEventBubble} style={wrapper_popup_style}>

                        <div onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseOut} onMouseMove={this.mouseMove}>

                            <img src={this.state.gif} alt="" />
                            <div className="close_button" onClick={this.close}></div>

                            {this.state.msgVariant == 0 ?
                                <div className="balloon" style={this.state.style.balloon}>
                                    <div dangerouslySetInnerHTML={{__html: this.state.innerHtml}}></div>
                                </div>
                                : null }
                            {this.state.msgVariant == 1 ?
                                <div className="balloon" style={this.state.style.img_balloon_style}>
                                    <img style={{height: '185px',width: '224px'}} src={this.state.img}/>
                                </div>
                                : null }

                            {this.state.msgVariant == 3 ?
                                <div className="bottom_text">
                                    <div dangerouslySetInnerHTML={{__html: this.state.innerText}}></div>
                                </div>
                                : null }

                            {!this.state.hideButton ?
                            <div className="js_social_buttons social_buttons">
                                <div className="google" onClick={_.partial(this.share, 'google')}></div>
                                <div className="facebook" onClick={_.partial(this.share, 'facebook')}></div>
                                <div className="tweeter" onClick={_.partial(this.share, 'twitter')}></div>
                            </div>
                                : null}

                            {this.state.msgVariant == 2 ?
                                <div className="text_info">
                                    <div dangerouslySetInnerHTML={{__html: this.state.innerText}}></div>
                                </div>
                                : null }

                        </div>

                        {!this.state.userMenuClick && this.state.msgVariant != 2?

                            <div className="dont_label" onClick={stopPropagation}>

                                <input checked={this.state.doNotShowAgain} defaultChecked={this.state.doNotShowAgain}
                                       onChange={this.doNotShowAgainChange} type="checkbox" id="dont_show" />
                                <label htmlFor="dont_show">Don't show again</label>
                            </div>

                            : null }
                    </div>

                    {!this.state.userMenuClick && this.state.msgVariant == 2?

                        <div className="dont_label" style={this.state.style.dont_label} onClick={stopPropagation}>

                            <input checked={this.state.doNotShowAgain} defaultChecked={this.state.doNotShowAgain}
                                   onChange={this.doNotShowAgainChange} type="checkbox" id="dont_show" />
                            <label htmlFor="dont_show">Don't show again</label>
                        </div>

                        : null }
                </div>

            </div>

        );
    }
});