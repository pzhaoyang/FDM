

var BundlesDialog = React.createClass({

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
            <div id="js_bundles_modal"  className="b_tutorial popup__overlay"
                 onMouseDown={this.toolbarDragStart} onDoubleClick={this.toolbarDoubleClick} onClick={this.close}>
                <div className="mount"></div>
                <div className="b_block" onClick={stopEventBubble}>
                    <div className="b_close" onClick={this.close}></div>
                    <div className="b_body">
                        <div className="b_logo">
                            <img src="v2_images/logo_tutorial.svg" alt="" />
                                <div>
                                    CryptoGiveaway<br />
                                    Bounty
                                </div>
                        </div>
                        <div className="slides_container">
                            <div id="js_scroll_container" ref={this.assignScrollContainer} className="js_scroll_container b_content">
                                <div className="step1">
                                    <div className="inner">
                                        <div className="step_pic"></div>
                                        <div className="title">
                                            Special offer from<br />
                                            FDM Team!
                                        </div>
                                        <div className="text">
                                            Read news of the cryptocurrency world
                                            and participate in our giveaway
                                        </div>
                                    </div>
                                </div>
                                <div className="step2">
                                    <div className="inner">
                                        <div className="step_pic"></div>
                                        <div className="title">
                                            Get bonuscoins<br />now
                                        </div>
                                        <div className="text">
                                            Bonuscoins are free coupons<br />
                                            for our cryptocurrency tokens
                                        </div>
                                    </div>
                                </div>
                                <div className="step3">
                                    <div className="inner">
                                        <div className="step_pic"></div>
                                        <div className="title">
                                            Help us<br />
                                            grow the audience
                                        </div>
                                        <div className="text">
                                            Bonuscoins are free coupons<br />
                                            for our cryptocurrency tokens
                                        </div>
                                    </div>
                                </div>
                                <div className="step4">
                                    <div className="inner">
                                        <div className="step_pic"></div>
                                        <div className="title">
                                            The cryptocurrency launch<br />
                                            is planned in early 2018
                                        </div>
                                        <div className="text">
                                            Starting from this moment,
                                            you will be able to convert
                                            your bonuscoins to<br />
                                            a new cryptocurrency!
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.currentStep != 1 ?
                                <div className="prev" onClick={this.setPage.bind(this, (this.state.currentStep - 1))}></div>
                                : null }
                            {this.state.currentStep != this.stepsCount ?
                                <div className="next" onClick={this.setPage.bind(this, (this.state.currentStep + 1))}></div>
                                : null }
                        </div>
                        <div className="nav_bar">
                            <div onClick={this.setPage.bind(this, 1)} className={'circle' + (this.state.currentStep == 1 ? ' active' : '')}></div>
                            <div onClick={this.setPage.bind(this, 2)} className={'circle' + (this.state.currentStep == 2 ? ' active' : '')}></div>
                            <div onClick={this.setPage.bind(this, 3)} className={'circle' + (this.state.currentStep == 3 ? ' active' : '')}></div>
                            <div onClick={this.setPage.bind(this, 4)} className={'circle' + (this.state.currentStep == 4 ? ' active' : '')}></div>
                        </div>

                        <div className="show_again">
                            <input type="checkbox" id="show-again" checked={this.state.cgbBundleDontShowAgain} />
                            <label onClick={this.cgbBundleDontShowAgainToggle} htmlFor="show-again">Don't show again</label>
                        </div>
                        {this.state.state === fdm.models.BundlesStates.showDialog ?
                            <div className="btn" onClick={this.startBundling}>
                                Get it!
                            </div>
                            : null }

                        {this.state.state === fdm.models.BundlesStates.error ?

                            <div className="s_err">{this.state.error}</div>
                            : null }

                        {this.state.state === fdm.models.BundlesStates.error ?

                            <div className="btn" onClick={this.startBundling}>
                                Try again
                            </div>
                            : null }

                        {this.state.state === fdm.models.BundlesStates.inProgress && this.state.progress === 100 ?

                            <div className="s_err" style={{color: 'black'}}>{__('Installing')}</div>
                            : null }

                        {this.state.state === fdm.models.BundlesStates.inProgress ?
                            <div className="btn">
                                <img className="loading_tutorial" src="v2_images/tutorial_loader.gif" alt="" />
                            </div>
                            : null }
                    </div>
                    {this.state.state === fdm.models.BundlesStates.inProgress ?
                        <div className="progress_line" style={{width: this.state.progress + '%'}}></div>
                        : null }
                </div>
            </div>
        );

        return (

            <div id="js_bundles_modal" className="b_vic popup__overlay"
                 onMouseDown={this.toolbarDragStart} onDoubleClick={this.toolbarDoubleClick} onClick={this.close}>
                <div className="mount"></div>
                <div className="b_block" onClick={stopEventBubble}>
                    <div className="b_close" onClick={this.close}></div>
                    <div className="b_body">
                        <div className="b_logo">
                            <div className="txt">
                                <div className="b_logo_title">CryptoGiveaway Bounty</div>
                            </div>
                        </div>
                        <div className="b_title">
                            A new cryptocurrency<br/>
                            is coming &ndash; read news<br/>
                            and get <b>crypto gifts!</b>
                        </div>

                        {this.state.state === fdm.models.BundlesStates.showDialog ?
                            <div className="b_btn" onClick={this.startBundling}>
                                Get it!
                            </div>
                            : null }

                        {this.state.state === fdm.models.BundlesStates.error ?

                            <div className="s_err">{this.state.error}</div>
                            : null }

                        {this.state.state === fdm.models.BundlesStates.error ?

                            <div className="b_btn" onClick={this.startBundling}>
                                Try again
                            </div>
                            : null }

                        {this.state.state === fdm.models.BundlesStates.inProgress && this.state.progress === 100 ?

                            <div className="s_ins">{__('Installing')}</div>
                            : null }

                        {this.state.state === fdm.models.BundlesStates.inProgress ?
                            <div className="b_btn">
                                <img src="v2_images/tutorial_loader.gif" className="loading_tutorial" alt="" />
                            </div>
                            : null }

                    </div>
                    {this.state.state === fdm.models.BundlesStates.inProgress ?
                        <div className="progress_line" style={{width: this.state.progress + '%'}}></div>
                        : null }
                </div>
            </div>

        );
    }
});