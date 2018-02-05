

var PopupMenu = React.createClass({

    dispatcherIndexKeyDown: false,

    getInitialState: function () {

        var state = app.controllers.menu.model.toJSON();
        state.settingsOpened = app.controllers.settings.model.get('opened');
        state.shutDownWhenDone = app.controllers.settings.model.get('shutDownWhenDone');
        state.preventSleepAction = app.controllers.settings.model.get('preventSleepAction');
        state.hasDownloadingItems = app.controllers.downloads.model.get('hasDownloadingItems');
        state.shutDownGroupOpened = false;

        return state;
    },

    _onChange: function() {

        var new_state = app.controllers.menu.model.toJSON();

        if (this.state.opened != new_state.opened)
            new_state.shutDownGroupOpened = false;

        this.setState(new_state);
    },

    settingsChangeState: function(){

        this.setState({
            settingsOpened: app.controllers.settings.model.get('opened'),
            shutDownWhenDone: app.controllers.settings.model.get('shutDownWhenDone'),
            preventSleepAction: app.controllers.settings.model.get('preventSleepAction')
        });
    },

    componentDidMount: function() {

        app.controllers.menu.model.on("change", this._onChange, this);
        app.controllers.settings.model.on('change:opened change:shutDownWhenDone change:preventSleepAction', this.settingsChangeState, this);
        app.controllers.downloads.model.on('change:hasDownloadingItems', this.changeDownloadingState, this);

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
        app.controllers.menu.model.off("change", this._onChange, this);
        app.controllers.settings.model.off('change:opened change:shutDownWhenDone change:preventSleepAction', this.settingsChangeState, this);
        app.controllers.downloads.model.off('change:hasDownloadingItems', this.changeDownloadingState, this);

        FdmDispatcher.unregister(this.dispatcherIndexKeyDown);
    },

    changeDownloadingState: function () {

        this.setState({
            hasDownloadingItems: app.controllers.downloads.model.get('hasDownloadingItems')
        });

    },

    globalKeyDown: function(content){

        if (content.keyCode === 27){
            this.closeMenu();
        }

    },

    closeMenu: function(e){

        stopEventBubble(e);
        app.controllers.menu.closeMenu();

    },

    shotDownOptionFailedToggle: function(){

        app.controllers.settings.saveSetting('shutdown-when-done', !this.state.shutDownWhenDone);
        app.controllers.settings.model.set({
            shutDownWhenDone: !this.state.shutDownWhenDone
        });
    },

    shotDownGroupToggle: function(){

        this.setState({
            shutDownGroupOpened: !this.state.shutDownGroupOpened
        });
    },

    shotDownOptionToggle: function(new_option){

        if (new_option == this.state.preventSleepAction && this.state.shutDownWhenDone){
            app.controllers.settings.saveSetting('shutdown-when-done', false);
            app.controllers.settings.model.set({
                shutDownWhenDone: false
            });
        }
        else{
            app.controllers.settings.saveSetting('shutdown-when-done', true);
            app.controllers.settings.saveSetting('prevent-sleep-action', new_option);
            app.controllers.settings.model.set({
                shutDownWhenDone: true,
                preventSleepAction: new_option
            });
        }
        if (!this.state.shutDownGroupOpened){
            this.setState({
                shutDownGroupOpened: true
            });
        }
        app.controllers.menu.closeMenu();
    },

    __: function(){

        if (fdmApp.platform == 'mac')
            return __upperCapitalize.apply(null, arguments);
        else
            return __.apply(null, arguments);
    },

    render: function() {

        if (!this.state.opened)
            return null;

        var menu = app.controllers.menu;

        return (
            <div>
                <div onClick={this.closeMenu} onContextMenu={this.closeMenu} className="modal-dialog-layer"></div>
                <div className="dropdown-settings" style={{zIndex: 5001}}>
                    <div className="border-block">
                        <div className="rows-group">
                            <div className="menu-row"
                                 onClick={_.bind(menu.openTrtFile, menu)}>
                                {this.__('Open torrent file...')}
                            </div>
                            <div className="menu-row"
                                 onClick={_.bind(menu.importUrlsFromClipboard, menu)}>
                                {this.__('Paste urls from clipboard')}
                            </div>
                            <hr />
                        </div>

                        {this.state.settingsOpened ?
                            <div className="rows-group disabled">
                                <div className="menu-row" onClick={stopEventBubble}>
                                    {fdmApp.platform == 'mac' ? __('Preferences...') : __('Settings...')}
                                </div>
                                <hr />
                            </div>
                            :
                            <div className="rows-group">
                                <div className="menu-row"
                                     onClick={_.bind(menu.openSettings, menu)}>
                                    {fdmApp.platform == 'mac' ? __('Preferences...') : __('Settings...')}
                                </div>
                                <hr />
                            </div>
                        }
                        <div className="rows-group">
                            <div className="menu-row"
                                 onClick={_.bind(menu.contactSupport, menu)}>
                                {this.__('Contact support')}
                            </div>
                            <div className="menu-row"
                                 onClick={_.bind(menu.voteForFeatures, menu)}>
                                {this.__('Vote for new features')}
                            </div>
                            <hr />
                        </div>


                        {!this.state.hasDownloadingItems && !this.state.shutDownWhenDone && !this.state.shutDownGroupOpened ?

                            <div className="rows-group disabled">
                                <div className={rjs_class({
                                    'menu-row': true
                                })} onClick={stopEventBubble}>
                                    {this.__('Auto shutdown')}
                                </div>
                                <hr />
                            </div>

                            :

                            <div className="rows-group">
                                <div className={rjs_class({
                                    'menu-row': true,
                                    shutdown_group_opened: !this.state.shutDownWhenDone && this.state.shutDownGroupOpened,
                                    shutdown_group_closed: !this.state.shutDownWhenDone && !this.state.shutDownGroupOpened,
                                })} onClick={this.shotDownGroupToggle}>
                                    {this.__('Auto shutdown')}
                                </div>

                                { this.state.shutDownWhenDone || this.state.shutDownGroupOpened ?

                                    <div className="shutdown_group">
                                        <div className={rjs_class({
                                            'menu-row': true,
                                            shutdown: this.state.shutDownWhenDone
                                                && this.state.preventSleepAction == fdm.models.preventSleepAction.Sleep
                                        })} onClick={_.partial(this.shotDownOptionToggle, fdm.models.preventSleepAction.Sleep)}>
                                            {__('Sleep')}
                                        </div>
                                        {fdmApp.platform == 'win' ?
                                        <div className={rjs_class({
                                            'menu-row': true,
                                            shutdown: this.state.shutDownWhenDone
                                                && this.state.preventSleepAction == fdm.models.preventSleepAction.Hibernate
                                        })} onClick={_.partial(this.shotDownOptionToggle, fdm.models.preventSleepAction.Hibernate)}>
                                            {__('Hibernate')}
                                        </div>
                                            : null}
                                        <div className={rjs_class({
                                            'menu-row': true,
                                            shutdown: this.state.shutDownWhenDone
                                                && this.state.preventSleepAction == fdm.models.preventSleepAction.Shutdown
                                        })} onClick={_.partial(this.shotDownOptionToggle, fdm.models.preventSleepAction.Shutdown)}>
                                            {__('Shutdown')}
                                        </div>
                                    </div>

                                    : null }
                                <hr />
                            </div>

                        }

                        {/*
                        <div className="rows-group">
                            <div className={rjs_class({
                                'menu-row': true,
                                shutdown: this.state.shutDownWhenDone
                            })} onClick={this.shotDownOptionFailedToggle}>
                                {fdmApp.platform == 'mac' ? __('Auto Sleep/Shut down') : __('Auto Hiberate/Sleep/Shut down')}
                            </div>
                            <hr />
                        </div>
                        */}
                        <div className="rows-group">

                            {!fdmApp.appUpdateDisabled ?
                            <div className="menu-row"
                                 onClick={_.bind(menu.checkForUpdates, menu)}>
                                {this.__('Check for updates') + (fdmApp.platform == 'mac' ? '...' : '')}</div>
                                : null }
                            <div className="menu-row"
                                 onClick={_.bind(menu.shareWithFriends, menu)}>
                                {this.__('Share with friends') + (fdmApp.platform == 'mac' ? '...' : '')}</div>
                            {!fdmApp.vicoinIsInstalled ?
                            <div className="menu-row"
                                 onClick={_.bind(menu.vicoinsBundle, menu)}>
                                {this.__('Special offer') + (fdmApp.platform == 'mac' ? '...' : '')}</div>
                                : null }
                            <div className="menu-row"
                                 onClick={_.bind(menu.openAbout, menu)}>{__('About Free Download Manager')}</div>
                            <hr />
                        </div>
                        <div className="rows-group">
                            <div className="menu-row"
                                 onClick={_.bind(menu.exitApp, menu)}>
                                {fdmApp.platform == 'mac' ? __('Quit') : __('Exit')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});