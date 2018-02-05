

var BundlesDialog = React.createClass({displayName: "BundlesDialog",

    mixins: [ToolbarDragMixin],

    scrollContainer: undefined,
    stepsCount: 4,

    toolbarDragId: 'js_bundles_modal',

    dispatcherIndexKeyDown: false,

    getInitialState: function () {

        var s = app.controllers.bundles.model.toJSON();
        s.currentStep = 1;
        s.cgbBundleDontShowAgain = app.controllers.settings.model.get('settings')['cgbBundleDontShowAgain'];
        return s;
    },

    componentDidMount: function() {

        window.addEventListener('resize', this.onWindowResize);

        app.controllers.bundles.model.on('change', this._onChange, this);
        app.controllers.settings.model.on('change', this.cgbBundleDontShowAgainChange, this);

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

        this.scrollContainer.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('resize', this.onWindowResize);

        app.controllers.bundles.model.off('change', this._onChange, this);
        app.controllers.settings.model.off('change', this.cgbBundleDontShowAgainChange, this);

        FdmDispatcher.unregister(this.dispatcherIndexKeyDown);
    },

    cgbBundleDontShowAgainChange: function () {

        var cgbBundleDontShowAgain = app.controllers.settings.model.get('settings')['cgbBundleDontShowAgain'];

        if (cgbBundleDontShowAgain != this.state.cgbBundleDontShowAgain)
            this.setState({cgbBundleDontShowAgain: cgbBundleDontShowAgain});
    },

    startX: undefined,
    startScrollLeft: undefined,
    onMouseDown: function (e) {

        this.startX = e.pageX;
        this.startScrollLeft = this.scrollContainer.scrollLeft;

        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
    },
    onMouseMove: function (e) {
        this.scrollContainer.scrollLeft = this.startScrollLeft + (this.startX - e.pageX);
    },
    onMouseUp: function (e) {
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mousemove', this.onMouseMove);
        this.resetSlide(e);
    },

    resetSlide: function (e) {

        var current_scroll = this.scrollContainer.scrollLeft;

        var min_diff = 100500;
        var step_min_diff = 0;
        for (var i = 1; i <= this.stepsCount; i++) {
            var step_scroll = (i - 1) * this.state.stepWidth;
            var diff = Math.abs(current_scroll - step_scroll);
            if (diff < min_diff) {
                step_min_diff = i;
                min_diff = diff;
            }
        }
        if (step_min_diff > 0) {
            this.setPage(step_min_diff);
        }
    },

    onWindowResize: function () {
        this.getScrollSize();
    },

    getScrollSize: function () {
        this.setState({
            scrollWidth: this.scrollContainer.scrollWidth,
            stepWidth: this.scrollContainer.getBoundingClientRect().width
        });
    },

    _onChange: function() {

        this.setState(app.controllers.bundles.model.toJSON());
    },

    globalKeyDown: function(content){

        if (content.keyCode === 27){
            this.close();
        }

    },

    // doNotShowAgainChange: function (e) {
    //
    //     app.controllers.bundles.model.set('doNotShowAgain', e.target.checked);
    // },

    close: function(){

        app.controllers.bundles.close();

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

    startBundling: function () {

        app.controllers.bundles.startBundlingClick();
    },

    assignScrollContainer: function(elem) {

        this.scrollContainer = elem;
        if (this.scrollContainer) {
            this.scrollContainer.addEventListener('mousedown', this.onMouseDown);
            this.getScrollSize();
        }
    },

    setPage: function (page_num) {

        page_num = Math.min(Math.max(page_num, 1), this.stepsCount);
        var scroll = (page_num - 1) * this.state.stepWidth;
        $(this.scrollContainer).stop().animate({scrollLeft: scroll});
        this.setState({
            currentStep: page_num
        });

        if (page_num == this.stepsCount) {
            this.setState({
                allPageShowed: true
            });
        }
    },

    cgbBundleDontShowAgainToggle: function () {

        console.error('cgbBundleDontShowAgainToggle');
        app.controllers.settings.saveSetting('cgbBundleDontShowAgain', !this.state.cgbBundleDontShowAgain);
    },

    render: function() {

        if (!this.state.dialogOpened)
            return null;
        
        return (
            React.createElement("div", {id: "js_bundles_modal", className: "b_tutorial popup__overlay", 
                 onMouseDown: this.toolbarDragStart, onDoubleClick: this.toolbarDoubleClick, onClick: this.close}, 
                React.createElement("div", {className: "mount"}), 
                React.createElement("div", {className: "b_block", onClick: stopEventBubble}, 
                    React.createElement("div", {className: "b_close", onClick: this.close}), 
                    React.createElement("div", {className: "b_body"}, 
                        React.createElement("div", {className: "b_logo"}, 
                            React.createElement("img", {src: "v2_images/logo_tutorial.svg", alt: ""}), 
                                React.createElement("div", null, 
                                    "CryptoGiveaway", React.createElement("br", null), 
                                    "Bounty"
                                )
                        ), 
                        React.createElement("div", {className: "slides_container"}, 
                            React.createElement("div", {id: "js_scroll_container", ref: this.assignScrollContainer, className: "js_scroll_container b_content"}, 
                                React.createElement("div", {className: "step1"}, 
                                    React.createElement("div", {className: "inner"}, 
                                        React.createElement("div", {className: "step_pic"}), 
                                        React.createElement("div", {className: "title"}, 
                                            "Special offer from", React.createElement("br", null), 
                                            "FDM Team!"
                                        ), 
                                        React.createElement("div", {className: "text"}, 
                                            "Read news of the cryptocurrency world" + ' ' +
                                            "and participate in our giveaway"
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "step2"}, 
                                    React.createElement("div", {className: "inner"}, 
                                        React.createElement("div", {className: "step_pic"}), 
                                        React.createElement("div", {className: "title"}, 
                                            "Get bonuscoins", React.createElement("br", null), "now"
                                        ), 
                                        React.createElement("div", {className: "text"}, 
                                            "Bonuscoins are free coupons", React.createElement("br", null), 
                                            "for our cryptocurrency tokens"
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "step3"}, 
                                    React.createElement("div", {className: "inner"}, 
                                        React.createElement("div", {className: "step_pic"}), 
                                        React.createElement("div", {className: "title"}, 
                                            "Help us", React.createElement("br", null), 
                                            "grow the audience"
                                        ), 
                                        React.createElement("div", {className: "text"}, 
                                            "Bonuscoins are free coupons", React.createElement("br", null), 
                                            "for our cryptocurrency tokens"
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "step4"}, 
                                    React.createElement("div", {className: "inner"}, 
                                        React.createElement("div", {className: "step_pic"}), 
                                        React.createElement("div", {className: "title"}, 
                                            "The cryptocurrency launch", React.createElement("br", null), 
                                            "is planned in early 2018"
                                        ), 
                                        React.createElement("div", {className: "text"}, 
                                            "Starting from this moment," + ' ' +
                                            "you will be able to convert" + ' ' +
                                            "your bonuscoins to", React.createElement("br", null), 
                                            "a new cryptocurrency!"
                                        )
                                    )
                                )
                            ), 
                            this.state.currentStep != 1 ?
                                React.createElement("div", {className: "prev", onClick: this.setPage.bind(this, (this.state.currentStep - 1))})
                                : null, 
                            this.state.currentStep != this.stepsCount ?
                                React.createElement("div", {className: "next", onClick: this.setPage.bind(this, (this.state.currentStep + 1))})
                                : null
                        ), 
                        React.createElement("div", {className: "nav_bar"}, 
                            React.createElement("div", {onClick: this.setPage.bind(this, 1), className: 'circle' + (this.state.currentStep == 1 ? ' active' : '')}), 
                            React.createElement("div", {onClick: this.setPage.bind(this, 2), className: 'circle' + (this.state.currentStep == 2 ? ' active' : '')}), 
                            React.createElement("div", {onClick: this.setPage.bind(this, 3), className: 'circle' + (this.state.currentStep == 3 ? ' active' : '')}), 
                            React.createElement("div", {onClick: this.setPage.bind(this, 4), className: 'circle' + (this.state.currentStep == 4 ? ' active' : '')})
                        ), 

                        React.createElement("div", {className: "show_again"}, 
                            React.createElement("input", {type: "checkbox", id: "show-again", checked: this.state.cgbBundleDontShowAgain}), 
                            React.createElement("label", {onClick: this.cgbBundleDontShowAgainToggle, htmlFor: "show-again"}, "Don't show again")
                        ), 
                        this.state.state === fdm.models.BundlesStates.showDialog ?
                            React.createElement("div", {className: "btn", onClick: this.startBundling}, 
                                "Get it!"
                            )
                            : null, 

                        this.state.state === fdm.models.BundlesStates.error ?

                            React.createElement("div", {className: "s_err"}, this.state.error)
                            : null, 

                        this.state.state === fdm.models.BundlesStates.error ?

                            React.createElement("div", {className: "btn", onClick: this.startBundling}, 
                                "Try again"
                            )
                            : null, 

                        this.state.state === fdm.models.BundlesStates.inProgress && this.state.progress === 100 ?

                            React.createElement("div", {className: "s_err", style: {color: 'black'}}, __('Installing'))
                            : null, 

                        this.state.state === fdm.models.BundlesStates.inProgress ?
                            React.createElement("div", {className: "btn"}, 
                                React.createElement("img", {className: "loading_tutorial", src: "v2_images/tutorial_loader.gif", alt: ""})
                            )
                            : null
                    ), 
                    this.state.state === fdm.models.BundlesStates.inProgress ?
                        React.createElement("div", {className: "progress_line", style: {width: this.state.progress + '%'}})
                        : null
                )
            )
        );

        return (

            React.createElement("div", {id: "js_bundles_modal", className: "b_vic popup__overlay", 
                 onMouseDown: this.toolbarDragStart, onDoubleClick: this.toolbarDoubleClick, onClick: this.close}, 
                React.createElement("div", {className: "mount"}), 
                React.createElement("div", {className: "b_block", onClick: stopEventBubble}, 
                    React.createElement("div", {className: "b_close", onClick: this.close}), 
                    React.createElement("div", {className: "b_body"}, 
                        React.createElement("div", {className: "b_logo"}, 
                            React.createElement("div", {className: "txt"}, 
                                React.createElement("div", {className: "b_logo_title"}, "CryptoGiveaway Bounty")
                            )
                        ), 
                        React.createElement("div", {className: "b_title"}, 
                            "A new cryptocurrency", React.createElement("br", null), 
                            "is coming – read news", React.createElement("br", null), 
                            "and get ", React.createElement("b", null, "crypto gifts!")
                        ), 

                        this.state.state === fdm.models.BundlesStates.showDialog ?
                            React.createElement("div", {className: "b_btn", onClick: this.startBundling}, 
                                "Get it!"
                            )
                            : null, 

                        this.state.state === fdm.models.BundlesStates.error ?

                            React.createElement("div", {className: "s_err"}, this.state.error)
                            : null, 

                        this.state.state === fdm.models.BundlesStates.error ?

                            React.createElement("div", {className: "b_btn", onClick: this.startBundling}, 
                                "Try again"
                            )
                            : null, 

                        this.state.state === fdm.models.BundlesStates.inProgress && this.state.progress === 100 ?

                            React.createElement("div", {className: "s_ins"}, __('Installing'))
                            : null, 

                        this.state.state === fdm.models.BundlesStates.inProgress ?
                            React.createElement("div", {className: "b_btn"}, 
                                React.createElement("img", {src: "v2_images/tutorial_loader.gif", className: "loading_tutorial", alt: ""})
                            )
                            : null

                    ), 
                    this.state.state === fdm.models.BundlesStates.inProgress ?
                        React.createElement("div", {className: "progress_line", style: {width: this.state.progress + '%'}})
                        : null
                )
            )

        );
    }
});