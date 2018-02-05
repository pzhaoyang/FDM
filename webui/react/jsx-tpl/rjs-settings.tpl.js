


var ResetSettingsDialog = React.createClass({

    mixins: [ButtonMixin],

    dispatcherIndexKeyDown: false,

    getInitialState: function () {

        var state = {};
        state.opened = app.controllers.settings.model.get('resetSettingsDialogOpened');

        return state;
    },

    _onChange: function() {

        var state = {};
        state.opened = app.controllers.settings.model.get('resetSettingsDialogOpened');

        this.setState(state);
    },

    componentDidMount: function() {

        app.controllers.settings.model.on('change:resetSettingsDialogOpened', this._onChange, this);

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

        app.controllers.settings.model.off('change:resetSettingsDialogOpened', this._onChange, this);

        FdmDispatcher.unregister(this.dispatcherIndexKeyDown);
    },

    globalKeyDown: function(content){

        if (content.keyCode === 27){
            this.close();
        }

    },

    globalKeyDown: function(content){

        if (content.keyCode === 27){
            this.close();
        }

    },

    close: function(){

        app.controllers.settings.model.set({
            resetSettingsDialogOpened: false
        });
    },

    resetSettings: function(e){

        app.controllers.settings.resetSettings();
        app.controllers.settings.model.set({
            resetSettingsDialogOpened: false
        });
    },

    render: function() {

        if (!this.state.opened)
            return null;

        return (
            <div className="popup__overlay reset_settings" onMouseDown={this.close}>
                <div className="mount"></div>
                <div onMouseDown={stopEventBubble}>
                    <div className="delete disk popup">

                        <div className="header">
                            <div>{__('Default settings')}</div>
                            <div className="close_button" onClick={this.close}></div>
                        </div>

                        <div className="center">
                            <label>{__('Restore default settings?')}</label>
                        </div>

                        <div className="bottom_add_ul bottom">
                            <div className="group_button">
                                <button className="left_button cancel linkblock" onClick={this.close}
                                        onMouseDown={this.buttonMouseDown}>{__('Cancel')}</button>
                                <button className="right_button" onClick={this.resetSettings}
                                        onMouseDown={this.buttonMouseDown}>{__('OK')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


var Settings = React.createClass({

    languageList: {
        en: 'English',
        ar: 'Arabic',
        zh: 'Chinese (Simplified)',
        zh_TW: 'Chinese (Traditional)',
        da: 'Danish',
        nl: 'Dutch',
        fr: 'French',
        de: 'German',
        el: 'Greek',
        id: 'Indonesian',
        it: 'Italian',
        ja: 'Japanese',
        pl: 'Polish',
        pt: 'Portuguese (Brazil)',
        ro: 'Romanian',
        ru: 'Russian',
        sl: 'Slovene',
        es: 'Spanish',
        sv: 'Swedish',
        tr: 'Turkish'
    },

    getInitialState: function() {

        /*
          'Arabic',
          'Chinese (Simplified)',
          'Danish',
          'Dutch',
          'French',
          'German',
          'Greek',
          'Indonesian',
          'Italian',
          'Japanese',
          'Polish',
          'Portuguese (Brazil)',
          'Romanian',
          'Russian',
          'Slovene',
          'Spanish',
          'Swedish',
          'Turkish',
          'Indonesian',
            */

        var state = this.getState();
        state.currentTab = false;

        return state;
    },

    getKB: function(bytes){

        var kb = 1;
        if (bytes)
            kb = parseInt(bytes / fdmApp.bytesInKB);
        kb = Math.max(kb, 1);

        return kb;
    },

    getGB: function(bytes){

        var gb = 0.01;
        if (bytes)
            gb = Math.round(bytes * 100 / Math.pow(fdmApp.bytesInKB, 3) ) / 100;
        gb = Math.max(gb, 0.01);

        return gb;
    },

    getB: function(kb){

        var bytes = fdmApp.bytesInKB;
        if (kb)
            bytes = kb * fdmApp.bytesInKB;
        bytes = Math.max(bytes, fdmApp.bytesInKB);

        return bytes;
    },

    tumTypeInputs: {
        'tum-low-restriction-absolute': 'tum-low-restriction-type',
        'tum-low-upload-restriction-absolute': 'tum-low-upload-restriction-type',
        'tum-medium-restriction-absolute': 'tum-medium-restriction-type',
        'tum-medium-upload-restriction-absolute': 'tum-medium-upload-restriction-type',
        'tum-high-restriction-absolute': 'tum-high-restriction-type',
        'tum-high-upload-restriction-absolute': 'tum-high-upload-restriction-type'
    },

    kbInputs: [
        'monitoring-skip-smaller-value',
        'tum-low-restriction-absolute',
        'tum-low-upload-restriction-absolute',
        'tum-medium-restriction-absolute',
        'tum-medium-upload-restriction-absolute',
        'tum-high-restriction-absolute',
        'tum-high-upload-restriction-absolute',
        'reserve-file-space-larger-value'
    ],

    textInputs: [
        'monitoring-skip-extensions-value',
        'monitoring-skip-servers-value',

        'proxy-http-settings-address',
        //'proxy-http-settings-port',
        'proxy-http-settings-login-name',
        'proxy-http-settings-login-password',

        'proxy-https-settings-address',
        //'proxy-https-settings-port',
        'proxy-https-settings-login-name',
        'proxy-https-settings-login-password',

        'proxy-ftp-settings-address',
        //'proxy-ftp-settings-port',
        'proxy-ftp-settings-login-name',
        'proxy-ftp-settings-login-password',
        'default-download-folder'
    ],

    getState: function(){

        var state = app.controllers.settings.model.toJSON();

        var days = 1;
        if (state.settings['check-updates-interval'])
            days = parseInt(state.settings['check-updates-interval'] / (24*60*60));
        days = Math.min(Math.max(days, 1), 365);

        state.inputs = {
            'bittorrent-port-to' : state.settings['bittorrent-port-to'],
            'bittorrent-port-from' : state.settings['bittorrent-port-from'],
            'check-updates-interval-days' : days,
            'monitoring-skip-smaller-value' : this.getKB(state.settings['monitoring-skip-smaller-value']),
            'monitoring-skip-extensions-value' : state.settings['monitoring-skip-extensions-value'],
            'monitoring-skip-servers-value' : state.settings['monitoring-skip-servers-value'],
            'tum-low-restriction-absolute' : this.getKB(state.settings['tum-low-restriction-absolute']),
            'tum-low-upload-restriction-absolute' : this.getKB(state.settings['tum-low-upload-restriction-absolute']),
            'tum-medium-restriction-absolute' : this.getKB(state.settings['tum-medium-restriction-absolute']),
            'tum-medium-upload-restriction-absolute' : this.getKB(state.settings['tum-medium-upload-restriction-absolute']),
            'tum-high-restriction-absolute' : this.getKB(state.settings['tum-high-restriction-absolute']),
            'tum-high-upload-restriction-absolute' : this.getKB(state.settings['tum-high-upload-restriction-absolute']),
            'tum-low-max-connections-value' : state.settings['tum-low-max-connections-value'],
            'tum-medium-max-connections-value' : state.settings['tum-medium-max-connections-value'],
            'tum-high-max-connections-value' : state.settings['tum-high-max-connections-value'],
            'tum-low-max-tasks-value' : state.settings['tum-low-max-tasks-value'],
            'tum-medium-max-tasks-value' : state.settings['tum-medium-max-tasks-value'],
            'tum-high-max-tasks-value' : state.settings['tum-high-max-tasks-value'],
            'folder-history-keep-records-value' : state.settings['folder-history-keep-records-value'],
            'folder-history-max-records-value' : state.settings['folder-history-max-records-value'],

            'proxy-http-settings-address' : state.settings['proxy-http-settings-address'],
            'proxy-http-settings-port' : state.settings['proxy-http-settings-port'] == 0 ? "" : state.settings['proxy-http-settings-port'],
            'proxy-http-settings-login-name' : state.settings['proxy-http-settings-login-name'],
            'proxy-http-settings-login-password' : state.settings['proxy-http-settings-login-password'],

            'proxy-https-settings-address' : state.settings['proxy-https-settings-address'],
            'proxy-https-settings-port' : state.settings['proxy-https-settings-port'] == 0 ? "" : state.settings['proxy-https-settings-port'],
            'proxy-https-settings-login-name' : state.settings['proxy-https-settings-login-name'],
            'proxy-https-settings-login-password' : state.settings['proxy-https-settings-login-password'],

            'proxy-ftp-settings-address' : state.settings['proxy-ftp-settings-address'],
            'proxy-ftp-settings-port' : state.settings['proxy-ftp-settings-port'] == 0 ? "" : state.settings['proxy-ftp-settings-port'],
            'proxy-ftp-settings-login-name' : state.settings['proxy-ftp-settings-login-name'],
            'proxy-ftp-settings-login-password' : state.settings['proxy-ftp-settings-login-password'],

            'reserve-file-space-larger-value' : this.getGB(state.settings['reserve-file-space-larger-value']),

            'default-download-folder' : state.settings['default-download-folder']
        };

        state.currentInput = {
            name: null,
            error: false,
            errorMessage: null
        };

        state.currentTum = {
            name: null,
            stage: false
        };

        state.deleteDialogChoice = app.controllers.downloads.model.get('deleteDialogChoice');

        return state;
    },

    _onChange: function() {

        var need_update_current_tab = false;
        if (this.state.activeFilterText != app.controllers.settings.model.get('activeFilterText'))
            need_update_current_tab = true;

        this.setState(this.getState());

        if (need_update_current_tab)
            _.defer(this.setCurrentTab);
    },

    dispatcherIndexKeyDown: false,

    componentDidMount: function() {

        this.dispatcherIndexKeyDown = FdmDispatcher.register(function(payload) {

            if (!this.state.opened || this.state.resetSettingsDialogOpened)
                return true;

            if (payload.source == 'VIEW_ACTION'){
                if (payload.action.actionType == 'GlobalKeyDown')
                    return this.globalKeyDown(payload.action.content);
            }

            if (payload.source == 'VIEW_ACTION'){
                if (payload.action.actionType == 'SettingsDefaultFolderCallback')
                    return this.openFolderDialogCallback(payload.action.content);
            }

            if (payload.source == 'VIEW_ACTION'){
                if (payload.action.actionType == 'showSettingsTab')
                    return this.changeTab(payload.action.content.tabId);
            }

            return true; // No errors. Needed by promise in Dispatcher.
        }.bind(this));

        app.controllers.settings.model.on("change:opened", this.onChangeOpened, this);
        app.controllers.settings.model.on("change", this._onChange, this);
        app.controllers.downloads.model.on("change:deleteDialogChoice", this._onChange, this);

        _.bindAll(this, "keyDownListEvent", "mouseDownListEvent", "setCurrentTab");
    },

    componentWillUnmount: function() {

        app.controllers.settings.model.off("change:opened", this.onChangeOpened, this);
        app.controllers.settings.model.off("change", this._onChange, this);
        app.controllers.downloads.model.off("change:deleteDialogChoice", this._onChange, this);

        FdmDispatcher.unregister(this.dispatcherIndexKeyDown);

    },

    onChangeOpened: function(){

        if (app.controllers.settings.model.get('opened')){

            _.defer(function(){

                this.setCurrentTab();
                window.addEventListener('resize', this.setCurrentTab);
                document.getElementById('settings_right_panel').addEventListener('scroll', this.setCurrentTab);

            }.bind(this))
        }
        else{

            window.removeEventListener('resize', this.setCurrentTab);
            document.getElementById('settings_right_panel').removeEventListener('scroll', this.setCurrentTab);
        }

        this.setState({
            defaultTrtClient: fdmApp.settings.checkDefaultTorrentClient()
        });
    },

    globalKeyDown: function() {

        if (this.state.currentTum && this.state.currentTum.name
            || this.state.currentInput && this.state.currentInput.name)
            return;

        if (event.keyCode === 27){
            app.controllers.settings.close();
        }
    },

    changeTab: function(tab){

        if (this.state.activeFilterText != ''){

            app.controllers.settings.model.set({activeFilterText: ''});
            _.defer(this.changeTab);
            return;
        }

        var settings = ReactDOM.findDOMNode(this);

        var titles = settings.getElementsByClassName('group_title');
        var right_panel = settings.getElementsByClassName('right_panel');

        if (!right_panel && !right_panel.length)
            return;
        if (!titles && !titles.length)
            return;

        var scroll_block = right_panel[0];

        var new_tab = document.getElementById(tab);

        if (new_tab){

            scroll_block.scrollTop = new_tab.offsetTop - 20;
            this.setState({
                currentTab: tab
            });
        }

    },

    setCurrentTab: function(){

        if (this.state.activeFilterText != ''){

            this.setState({
                currentTab: false
            });
            return;
        }

        var settings = ReactDOM.findDOMNode(this);

        if (!settings)
            return;

        var titles = settings.getElementsByClassName('group_title');
        var right_panel = settings.getElementsByClassName('right_panel');

        if (!right_panel && !right_panel.length)
            return;
        if (!titles && !titles.length)
            return;

        var scroll_block = right_panel[0];

        var current_scroll = scroll_block.scrollTop;
        var current_height = scroll_block.offsetHeight;

        var current_title = false;
        for (var i = 0; i < titles.length; i++){

            var title = titles[i];
            var block = title.parentNode;

            if (title.offsetTop >= current_scroll
                && title.offsetTop + block.offsetHeight < current_scroll + current_height){

                current_title = title;
                break;
            }
            else if (title.offsetTop >= current_scroll + 100
                && title.offsetTop + block.offsetHeight - current_scroll - current_height < block.offsetHeight / 3){

                current_title = title;
            }
            else if (title.offsetTop < current_scroll + 100)
                current_title = title;
        }

        if (current_title){
            this.setState({
                currentTab: current_title.id
            });
        }
    },

    discardInputValue: function(name){
        var inputs = this.state.inputs;

        if (name == 'check-updates-interval-days'){
            var days = 1;
            if (this.state.settings['check-updates-interval'])
                days = parseInt(this.state.settings['check-updates-interval'] / (24*60*60));
            days = Math.min(Math.max(days, 1), 365);
            inputs[name] = days;
        }
        else if (['proxy-http-settings-port', 'proxy-https-settings-port', 'proxy-ftp-settings-port'].indexOf(name) >= 0 ){
            inputs[name] = this.state.settings[name] == 0 ? "" : this.state.settings[name];
        }
        else{

            if (name == 'reserve-file-space-larger-value')
                inputs[name] = this.getGB(this.state.settings[name]);
            else if (this.kbInputs.indexOf(name) >= 0)
                inputs[name] = this.getKB(this.state.settings[name]);
            else
                inputs[name] = this.state.settings[name];
        }
        this.setState({inputs: inputs});
    },

    validation: function(name){

        if (name == 'monitoring-skip-extensions-value'){

            var extensions = this.state.inputs[name].split(" ");

            for (var i = 0; i< extensions.length; i++){
                var extension = extensions[i].trim();

                if (extension == "")
                    continue;

                if (!extension.match(/^\.?[\d\w]+$/)){

                    this.setState({
                        currentInput: {
                            name: name,
                            error: true,
                            errorMessage: __('Are you sure this is a valid file extension?')
                        }
                    });

                    return false;
                }
            }

            this.setState({
                currentInput: {
                    name: name,
                    error: false,
                    errorMessage: ''
                }
            });

            return true;
        }

        if (name == 'monitoring-skip-servers-value'){

            var extensions = this.state.inputs[name].split(" ");

            for (var i = 0; i< extensions.length; i++){
                var extension = extensions[i].trim();

                if (extension == "")
                    continue;

                if (!extension.match(/^[\d\w\.\-]+$/)){

                    this.setState({
                        currentInput: {
                            name: name,
                            error: true,
                            errorMessage: __('Are you sure this is a valid server?')
                        }
                    });

                    return false;
                }
            }

            this.setState({
                currentInput: {
                    name: name,
                    error: false,
                    errorMessage: ''
                }
            });

            return true;
        }

        if (name != 'default-download-folder' && this.textInputs.indexOf(name) >= 0)
            return true;

        var value = this.state.inputs[name];

        if (['proxy-http-settings-port', 'proxy-https-settings-port', 'proxy-ftp-settings-port'].indexOf(name) >= 0 && value == '')
            value = 0;

        if (name == 'default-download-folder'){

            this.validateFolderPromise(value)
                .then(function(serialized){

                    var isValid = serialized[0];
                    var errorMsg = serialized[1];

                    if (!isValid){

                        this.setState({
                            currentInput: {
                                name: name,
                                error: true,
                                errorMessage: errorMsg
                            }
                        });
                    }
                    else{

                        this.setState({
                            currentInput: {
                                name: name,
                                error: false,
                                errorMessage: ''
                            }
                        });
                    }
                }.bind(this))
                .catch(console.error.bind(console));

            return true;
        }


        if (name == 'reserve-file-space-larger-value'){

            if (!_.isNumber(value) && parseFloat(value) != value){

                this.setState({
                    currentInput: {
                        name: name,
                        error: true,
                        errorMessage: __('Please enter numbers only')
                    }
                });

                return false;
            }

            value = Math.round(parseFloat(value) * 100) / 100;

            if (value < 0.01 ){

                this.setState({
                    currentInput: {
                        name: name,
                        error: true,
                        errorMessage: __('Are you sure it\'s not too small?')
                    }
                });

                return false;
            }
            if (value >= 1000 ){

                this.setState({
                    currentInput: {
                        name: name,
                        error: true,
                        errorMessage: __('Why should it be so huge?')
                    }
                });

                return false;
            }

            this.setState({
                currentInput: {
                    name: name,
                    error: false,
                    errorMessage: ''
                }
            });

            return true;
        }

        if (!_.isNumber(value) && parseInt(value) != value){

            this.setState({
                currentInput: {
                    name: name,
                    error: true,
                    errorMessage: __('Please enter numbers only')
                }
            });

            return false;
        }

        value = parseInt(value);

        var error = false;
        var error_message = null;


        if (typeof this.tumTypeInputs[name] != 'undefined'){

            if (value < 1 ){
                error = true;
                error_message = __('Extremely slow, isn\'t it?');
            }
            if (value > 9999999 ){
                error = true;
                error_message = __('Faster doesn\'t mean better');
            }

        }
        else {

            switch (name){

                case 'bittorrent-port-to':
                case 'bittorrent-port-from':

                    if (value < 0 ){

                        this.setState({
                            currentInput: {
                                name: name,
                                error: true,
                                errorMessage: __('Please enter numbers only')
                            }
                        });
                        return false;
                    }
                    break;

                case 'check-updates-interval-days':

                    if (value < 1 ){
                        error = true;
                        error_message = __('Isn\'t it too frequent?');
                    }
                    if (value > 365 ){
                        error = true;
                        error_message = __('Pretty rare to move with the time.');
                    }

                    break;

                case 'monitoring-skip-smaller-value':

                    if (value < 1 ){
                        error = true;
                        error_message = __('Are you sure it\'s not too small?');
                    }
                    if (value > 10000000 ){
                        error = true;
                        error_message = __('Why should it be so huge?');
                    }

                    break;

                case 'folder-history-keep-records-value': //days

                    if (value < 1 ){
                        error = true;
                        error_message = __('Maybe you\'d let it be a little longer?');
                    }
                    if (value > 3650 ){
                        error = true;
                        error_message = __('Are you sure it\'s not too long?');
                    }

                    break;

                case 'folder-history-max-records-value': //days

                    if (value < 1 && value >= 0 ){
                        error = true;
                        error_message = __('Only %n records? FDM can store much more!', value);
                    }
                    else if (value < 0 ){
                        error = true;
                        error_message = __('Are you sure it\'s not too small?');
                    }
                    if (value > 100000000 ){
                        error = true;
                        error_message = __('Are you sure it\'s not too long?');
                    }
                    else if (value > 100000 ){
                        error = true;
                        error_message = __('%n records is too many to save.', value);
                    }

                    break;

                case 'tum-low-max-connections-value':
                case 'tum-medium-max-connections-value':
                case 'tum-high-max-connections-value':

                    if (value < 1 ){
                        error = true;
                        error_message = __('Do you actually want to connect?');
                    }
                    if (value > 10000 ){
                        error = true;
                        error_message = __('Oh no, too many connections!');
                    }

                    break;

                case 'tum-low-max-tasks-value':
                case 'tum-medium-max-tasks-value':
                case 'tum-high-max-tasks-value':

                    if (value < 1 ){
                        error = true;
                        error_message = __('It seems like an understatement.');
                    }
                    if (value > 10000 ){
                        error = true;
                        error_message = __('So many? It\'s overwhelming!');
                    }

                    break;
            }
        }

        this.setState({
            currentInput: {
                name: name,
                error: error,
                errorMessage: error_message
            }
        });

        return !error;
    },

    saveInputValue: function(name, event){

        if (name == 'default-download-folder'){

            var value = this.state.inputs[name];

            this.validateFolderPromise(value)
                .then(function(serialized){

                    var isValid = serialized[0];
                    var errorMsg = serialized[1];

                    if (!isValid){

                        this.setState({
                            currentInput: {
                                name: name,
                                error: true,
                                errorMessage: errorMsg
                            }
                        });
                        document.getElementById(name).select();
                        document.getElementById(name).focus();
                    }
                    else{

                        app.controllers.settings.saveSetting(name, value);
                    }
                }.bind(this))
                .catch(console.error.bind(console));

            return;
        }

        if (!this.validation(name)){

            stopEventBubble(event);

            if (event.target.disabled) {
                this.discardInputValue(name);
                document.getElementById(name).blur();
            }
            else{
                document.getElementById(name).select();
                document.getElementById(name).focus();
            }
            return;
        }

        var value;
        if (this.textInputs.indexOf(name) >= 0){
            value = this.state.inputs[name];
        }
        else if (name == 'reserve-file-space-larger-value'){
            value = Math.round( this.state.inputs[name] * 100 ) / 100;
        }
        else{
            value = this.state.inputs[name];
            if (['proxy-http-settings-port', 'proxy-https-settings-port', 'proxy-ftp-settings-port'].indexOf(name) >= 0 && value == '')
                value = 0;
            value = parseInt(value);
        }

        if (name == 'check-updates-interval-days'){
            var seconds = value * 24*60*60;
            app.controllers.settings.saveSetting('check-updates-interval', seconds);
        }
        else{
            if (name == 'reserve-file-space-larger-value')
                value = parseInt(value * Math.pow(fdmApp.bytesInKB, 3));
            else if (this.kbInputs.indexOf(name) >= 0)
                value = this.getB(value);

            app.controllers.settings.saveSetting(name, value);
            if (this.tumTypeInputs[name])
                app.controllers.settings.saveSetting(this.tumTypeInputs[name], 1);
        }

    },

    changeSetting:function(name, event){

        name = name || false;

        var value;
        var el = event.target;
        if (el.type == 'checkbox')
            value = el.checked;
        else
            value = el.value;

        this.state.settings[name] = value;

        if (name == 'check-updates-interval-days'){
            var seconds = value * 24*60*60;
            app.controllers.settings.saveSetting('check-updates-interval', seconds);
        }
        else{
            app.controllers.settings.saveSetting(name, value);
        }
    },

    setSetting:function(name, value, event){

        app.controllers.settings.saveSetting(name, value);
        if (this.tumTypeInputs[name])
            app.controllers.settings.saveSetting(this.tumTypeInputs[name], 1);
    },

    inputKeyDown: function(name, event){

        if (event.keyCode === 27){
            this.discardInputValue(name);
            var el = event.target;
            _.defer(function(){el.blur()});
            stopEventBubble(event);
        }
        if (event.keyCode === 13){

            if (name == 'default-download-folder'){

                var value = this.state.inputs[name];

                this.validateFolderPromise(value)
                    .then(function(serialized){

                        var isValid = serialized[0];
                        //var errorMsg = serialized[1];

                        if (isValid){
                            document.getElementById(name).blur();
                        }

                    }.bind(this))
                    .catch(console.error.bind(console));

                this.saveInputValue(name, event);
            }
            else{

                if (this.validation(name)){
                    document.getElementById(name).blur();
                }
                this.saveInputValue(name, event);
            }
        }
    },

    changeInput: function(name, event){

        name = name || false;

        var value;
        var el = event.target;
        if (el.type == 'checkbox')
            value = el.checked;
        else
            value = el.value;

        var i = this.state.inputs;

        i[name] = value;

        this.setState({inputs: i});

        this.validation(name);
    },

    keyDownListEvent: function(e){

        if (event.keyCode === 27 && this.state.currentTum && this.state.currentTum.name && this.state.currentTum.stage == 'select'){
            this.setState({currentTum: {
                name: null,
                stage: false
            }});
        }

    },
    mouseDownListEvent: function(){

        if (this.state.currentTum && this.state.currentTum.name && this.state.currentTum.stage == 'select'){
            this.setState({currentTum: {
                name: null,
                stage: false
            }});
        }
        this.removeEventListener();
    },

    addEventListener: function(){

        document.addEventListener('mousedown', this.mouseDownListEvent);
        document.addEventListener('keydown', this.keyDownListEvent);
    },

    removeEventListener: function(){

        document.removeEventListener('mousedown', this.mouseDownListEvent);
        document.removeEventListener('keydown', this.keyDownListEvent);
    },

    inputOnFocus: function(name, event){
        this.state.currentInput.name = name;
        this.removeEventListener();
    },

    inputOnBlur: function(name, event){
        this.state.currentInput.name = null;

        if (name == 'default-download-folder'){

            var value = this.state.inputs[name];

            this.validateFolderPromise(value)
                .then(function(serialized){

                    var isValid = serialized[0];
                    //var errorMsg = serialized[1];

                    if (!isValid){
                        this.setState({
                            currentInput: {
                                name: name,
                                error: false,
                                errorMessage: ''
                            }
                        });
                        this.discardInputValue(name);
                    }
                    else{
                        app.controllers.settings.saveSetting(name, value);
                    }

                }.bind(this))
                .catch(console.error.bind(console));

            return;
        }

        if (!this.validation(name)){
            this.setState({
                currentInput: {
                    name: name,
                    error: false,
                    errorMessage: ''
                }
            });
            this.discardInputValue(name);
        }
        else{
            this.saveInputValue(name, event);
        }
        this.removeEventListener();
    },

    validateFolderPromise: function(folder){

        return new Promise(function(resolve, reject) {

            fdmApp.system.validateFolder(folder, 'filename', false, true, function(serialized){
                resolve(serialized);
            }.bind(this));
        });
    },

    tumClick: function(name, stage, event){

        stopEventBubble(event);

        if (this.state.currentTum && this.state.currentTum.name
            && this.state.currentTum.name != name && this.state.currentTum.stage == 'input' ){

            this.inputOnBlur(name, event);
            return;
        }

        this.setState({currentTum: {
            name: name,
            stage: stage
        }});

        if (stage == 'input'){
            _.defer(function(){
                var element = document.getElementById(name);

                if (element){
                    element.focus();
                    fdm.htmlUtils.setCaretPosition(element, element.value.length);
                }
            });
        }

        this.addEventListener();
    },

    changeDeleteDialogChoice:function(event){

        app.controllers.downloads.model.set({deleteDialogChoice: event.target.value});
    },

    openSafariExtension: function(){
        fdmApp.settings.openSafariExtension();
    },

    openFolderDialog: function(){

        fdmApp.system.openFolderDialog( this.state.inputs['default-download-folder'], 'settings-default-folder' );
    },

    openFolderDialogCallback: function(content){

        var i = this.state.inputs;

        i['default-download-folder'] = content.targetFolder;
        this.setState({inputs: i});
        this.saveInputValue('default-download-folder');
    },

    showBlock: function(text_list){

        var filter = this.state.activeFilterText;

        if (!filter || filter == '')
            return true;

        filter = filter.toLowerCase();

        if (text_list.title && text_list.title.toLowerCase().indexOf(filter) >= 0)
            return true;

        if (text_list.textList && text_list.textList.length){

            for (var i in text_list.textList){

                var t = __(text_list.textList[i]).toLowerCase();

                if (t.indexOf(filter) >= 0)
                    return true;
            }
        }

        return false;
    },

    settingsText: function(text, vars, context){

        var l_text = __(text, vars, context);

        var filter = this.state.activeFilterText;
        if (!filter || filter == '')
            return l_text;

        filter = filter.toLowerCase();

        var pos = l_text.toLowerCase().indexOf(filter);

        if (pos < 0)
            return l_text;

        return (
            <span>
                {l_text.substr(0, pos)}
                <span className="search">{l_text.substr(pos, filter.length)}</span>
                {l_text.substr(pos + filter.length)}
            </span>
        );
    },

    setDefaultTrtClient: function(e){

        stopEventBubble(e);

        fdmApp.settings.setDefaultTorrentClient(true);

        app.controllers.settings.model.set({
            defaultTrtClientDialogOpened: false
        });

        this.setState({
            defaultTrtClient: true
        });
    },

    resetSettings: function(){

        app.controllers.settings.model.set({
            resetSettingsDialogOpened: true
        });
    },

    setLanguage: function(lang_code){

        this.languageMenuClose();
        app.controllers.settings.setLanguage(lang_code);
    },

    languageMenuToggle: function(){

        var s = {languageMenuOpened: !this.state.languageMenuOpened};

        if (s.languageMenuOpened)
        {
            var o = ReactDOM.findDOMNode(this);
            if (o)
            {
                var e = o.getElementsByClassName('lang_l');
                if (e && e.length)
                {
                    var list = e[0];
                    var rect = list.getBoundingClientRect();

                    var t_s = rect.top - 70;
                    var b_s = window.innerHeight - rect.bottom - 35;

                    s.languageMenuTopPos = t_s > b_s;
                }
            }
        }

        this.setState(s);
    },

    languageMenuClose: function(){

        this.setState({languageMenuOpened: false});
    },

    settingsOnWheel: function(e){

        if (this.state.languageMenuOpened)
            stopEventBubble(e);
    },

    render: function() {

        var s = this.state.settings;
        var i = this.state.inputs;
        var ci = this.state.currentInput;
        var ct = this.state.currentTum;
        var current_tab = this.state.currentTab;

        if (!this.state.opened)
            return null;

        var selected_one_browser = s['monitoring-ff-enabled'] || s['monitoring-chrome-enabled']
        || fdmApp.platform == 'win' && (s['monitoring-ie-enabled'] && !fdmApp.IeSupportDisabled
                || s['monitoring-edge-enabled'] && !fdmApp.EdgeSupportDisabled);
        //|| fdmApp.platform == 'mac' && s['monitoring-safari-enabled'];

        var current_language = this.state.language;
        if (this.state.language == '')
            current_language = this.state.systemLocale;

        if ( this.state.installedTranslations.indexOf(current_language) < 0 )
            current_language = 'en';

        return (

            <div className="settings_wrapper">
                <div className="left_panel">
                    <div className="title">{fdmApp.platform == 'mac' ? __('Preferences') : __('Settings')}</div>
                    <ul>
                        <li onClick={_.partial(this.changeTab, 'general_tab')}
                            className={rjs_class({
                            active: current_tab == 'general_tab'
                        })}>{__('General')}</li>
                        <li onClick={_.partial(this.changeTab, 'monitoring_tab')}
                            className={rjs_class({
                            active: current_tab == 'monitoring_tab'
                        })}>{__('Browser Integration')}</li>
                        {/*<li onClick={_.partial(this.changeTab, 'bit_torrent')}
                            className={rjs_class({
                            active: current_tab == 'bit_torrent'
                        })}>{__('BitTorrent')}</li>*/}
                        <li onClick={_.partial(this.changeTab, 'connection_tab')}
                            className={rjs_class({
                            active: current_tab == 'connection_tab'
                        })}>{__('Network')}</li>
                        <li onClick={_.partial(this.changeTab, 'tum_tab')}
                            dangerouslySetInnerHTML={{__html: __('Traffic Limits')}}
                            className={rjs_class({
                            active: current_tab == 'tum_tab'
                        })}></li>
                        <li onClick={_.partial(this.changeTab, 'advanced_tab')}
                            className={rjs_class({
                            active: current_tab == 'advanced_tab'
                        })}>{__('Advanced')}</li>
                        {/*
                        <li onClick={_.partial(this.changeTab, 'proxy')}
                            className={rjs_class({
                            active: current_tab == 'proxy'
                        })}>Proxy</li>
                        */}
                    </ul>
                </div>
                <div className="right_panel" id="settings_right_panel" onWheel={this.settingsOnWheel}>

                    {this.showBlock({
                        textList: [
                            fdmApp.platform == "mac" ? 'Login' : 'Startup',
                            fdmApp.platform == 'mac' ? 'Open at Login' : 'Launch at startup (minimized)',
                            'Close button minimizes window',
                            fdmApp.appUpdateDisabled ? '' : 'Update',
                            fdmApp.appUpdateDisabled ? '' : 'Check for updates automatically',
                            fdmApp.appUpdateDisabled ? '' : 'Install updates automatically',
                            //'Send anonymous statistics',
                            'Notifications',
                            'Notify me of completed downloads via Notification Center',
                            'Only when FDM window is inactive',
                            'Downloads',
                            // 'Default folder:',
                            'Suggest folders based on file type',
                            'Suggest folders based on download URL',
                            'Language'
                        ]
                    }) ?
                    <div>

                    <div id="general_tab" className="group_title">{__('General')}</div>
                    <div className="general_tab">

                        {this.showBlock({
                            title: 'Language'
                        }) ?

                            <div className="language_block" style={{display: 'block'}}>
                                <div className="tab_title">{this.settingsText('Language')}</div>

                                <div className="choose bottom">
                                    <div className="transparent_select" onMouseDown={this.languageMenuClose}
                                         style={{display: this.state.languageMenuOpened ? 'block' : 'none'}}></div>
                                    <div onClick={this.languageMenuToggle}
                                         className={rjs_class({
                                            wrapper_inselect: true,
                                            lang_l: true,
                                            top_position: this.state.languageMenuTopPos
                                         })}>
                                        <span className={current_language}>
                                            {this.languageList[current_language]}
                                        </span>
                                        <div className="list"
                                             style={{display: this.state.languageMenuOpened ? 'block' : 'none'}}>

                                            {_.map(this.languageList, function(l_name, l_code){

                                                if (this.state.installedTranslations.indexOf(l_code) < 0)
                                                    return null;

                                                return(
                                                    <div key={l_code} onClick={_.partial(this.setLanguage, l_code)}>
                                                        <span className={l_code}>{this.languageList[l_code]}</span>
                                                    </div>
                                                );
                                            }.bind(this))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null }


                        {this.showBlock({
                            title: 'Downloads',
                            textList: [
                                // 'Default folder:',
                                'Suggest folders based on file type',
                                'Suggest folders based on download URL',
                                'Automatically remove deleted files from download list'
                            ]
                        }) ?
                        <div>

                        <div className="tab_title">{this.settingsText('Downloads')}</div>
                        <div className="wrap_group">

                            {this.showBlock({
                                title: 'Downloads',
                                textList: [
                                    'Suggest folders based on file type'
                                ]
                            }) ?
                            <div>

                            <input checked={s['suggest-download-folder-by-content-type']}
                                   defaultChecked={s['suggest-download-folder-by-content-type']}
                                   onChange={_.partial(this.changeSetting, 'suggest-download-folder-by-content-type')}
                                   type="checkbox" id="suggest-download-folder-by-content-type" />
                            <label htmlFor="suggest-download-folder-by-content-type">{this.settingsText('Suggest folders based on file type')}</label>

                            </div>
                                : null }

                            {this.showBlock({
                                title: 'Downloads',
                                textList: [
                                    'Suggest folders based on download URL'
                                ]
                            }) ?
                            <div>

                            <input checked={s['suggest-download-settings-by-url']}
                                   defaultChecked={s['suggest-download-settings-by-url']}
                                   onChange={_.partial(this.changeSetting, 'suggest-download-settings-by-url')}
                                   type="checkbox" id="suggest-download-settings-by-url" />
                            <label htmlFor="suggest-download-settings-by-url">{this.settingsText('Suggest folders based on download URL')}</label>

                            </div>
                                : null }

                            {/*this.showBlock({
                                title: 'Downloads',
                                textList: [
                                    'Default folder:'
                                ]
                            }) ?
                            <div>

                            <span style={{float: 'left'}}>{this.settingsText('Default folder:')}</span>

                            <div onClick={stopEventBubble}
                                 className={rjs_class({
                                        absolute: true,
                                        num_records: true,
                                        error: ci.name == 'default-download-folder' && ci.error
                                        })}>

                                {ci.name == 'default-download-folder' && ci.error ?
                                    <div style={{left: '50px'}} className="block_error top">{ci.errorMessage}</div>
                                    : null }
                                <input className="default_folder_input"
                                       id="default-download-folder"
                                       value={i['default-download-folder']}
                                       defaultValue={i['default-download-folder']}
                                       onChange={_.partial(this.changeInput, 'default-download-folder')}
                                       onFocus={_.partial(this.inputOnFocus, 'default-download-folder')}
                                       onBlur={_.partial(this.inputOnBlur, 'default-download-folder')}
                                       onKeyDown={_.partial(this.inputKeyDown, 'default-download-folder')}
                                       type="text" />

                                <button className="button_folder linkblock" title={__('Select folder')}
                                        onClick={this.openFolderDialog}></button>

                            </div>
                            <div className="clear"></div>

                            </div>
                                : null */}

                            {this.showBlock({
                                title: 'Downloads',
                                textList: [
                                    'Automatically remove deleted files from download list'
                                ]
                            }) ?
                                <div>

                                    <input checked={s['remove-dead-downloads']}
                                           defaultChecked={s['remove-dead-downloads']}
                                           onChange={_.partial(this.changeSetting, 'remove-dead-downloads')}
                                           type="checkbox" id="remove-dead-downloads" />
                                    <label htmlFor="remove-dead-downloads">{this.settingsText('Automatically remove deleted files from download list')}</label>

                                </div>
                                : null }

                            {this.showBlock({
                                title: 'Downloads',
                                textList: [
                                    'Use server time for file creation'
                                ]
                            }) ?
                                <div>

                                    <input checked={s['set-files-dates-from-server']}
                                           defaultChecked={s['set-files-dates-from-server']}
                                           onChange={_.partial(this.changeSetting, 'set-files-dates-from-server')}
                                           type="checkbox" id="set-files-dates-from-server" />
                                    <label htmlFor="set-files-dates-from-server">{this.settingsText('Use server time for file creation')}</label>

                                </div>
                                : null }


                        </div>

                        </div>
                            : null }

                        {!fdmApp.appUpdateDisabled && this.showBlock({
                            title: 'Update',
                            textList: [
                                'Check for updates automatically',
                                'Install updates automatically'
                                //'Send anonymous statistics'
                            ]
                        }) ?
                            <div>

                                <div className="tab_title">{this.settingsText('Update', [], 'settings')}</div>
                                <div className="wrap_group">

                                    {this.showBlock({
                                        title: 'Update',
                                        textList: [
                                            'Check for updates automatically'
                                        ]
                                    }) ?
                                        <div>

                                            <input checked={s['check-updates-automatically']}
                                                   defaultChecked={s['check-updates-automatically']} onChange={_.partial(this.changeSetting, 'check-updates-automatically')}
                                                   type="checkbox" id="3i" />
                                            <label htmlFor="3i">{this.settingsText('Check for updates automatically')}</label>

                                        </div>
                                        : null }

                                    {this.showBlock({
                                        title: 'Update',
                                        textList: [
                                            'Install updates automatically'
                                        ]
                                    }) ?
                                        <div>

                                            <input checked={s['install-updates-automatically']}
                                                   defaultChecked={s['install-updates-automatically']} onChange={_.partial(this.changeSetting, 'install-updates-automatically')}
                                                   type="checkbox" id="3i1" />
                                            <label htmlFor="3i1">{this.settingsText('Install updates automatically')}</label>


                                        </div>
                                        : null }

                                </div>

                            </div>
                            : null }


                    </div>

                    </div>
                        : null }

                    {this.showBlock({
                        textList: [
                            'Browser Integration',
                            'Automatically catch downloads from browsers',
                            fdmApp.platform == 'win' && !fdmApp.IeSupportDisabled ? 'Internet Explorer' : '',
                            fdmApp.platform == 'win' && fdmApp.osversion >= 10 && !fdmApp.EdgeSupportDisabled ? 'Edge' : '',
                            'Firefox',
                            'Chrome',
                            'Browsers',
                            //fdmApp.platform == 'win' ? 'ALT must be pressed' : '',
                            'Allow the browser to download if you press Cancel',
                            'Don\'t catch downloads smaller than',
                            'Don\'t catch downloads from',
                            'Kbytes',
                            'Skip files with extensions:',
                            'Add FDM to browser context menu',
                            'Catch links without confirmation',
                            fdmApp.platform == 'mac' ? 'Safari: enable FDM extension for context menu extension is enabled' : ''
                        ]
                    }) ?
                        <div>

                    <div className="monitoring_tab">

                        <div id="monitoring_tab" className="group_title">{this.settingsText('Browser Integration')}</div>

                        <div className="wrap_group">
                            <div>

                                { fdmApp.platform == 'win' && (!fdmApp.IeSupportDisabled || !fdmApp.EdgeSupportDisabled) ?
                                    <div>
                                        { fdmApp.osversion >= 10 && !fdmApp.EdgeSupportDisabled ?
                                            <div>
                                                <input checked={s['monitoring-edge-enabled']}
                                                       defaultChecked={s['monitoring-edge-enabled']} onChange={_.partial(this.changeSetting, 'monitoring-edge-enabled')}
                                                       type="checkbox" id="5.0e" />
                                                <label htmlFor="5.0e">{this.settingsText('Edge')}</label>
                                            </div>
                                            : null }

                                        { !fdmApp.IeSupportDisabled ?
                                            <div>
                                                <input checked={s['monitoring-ie-enabled']}
                                                       defaultChecked={s['monitoring-ie-enabled']} onChange={_.partial(this.changeSetting, 'monitoring-ie-enabled')}
                                                       type="checkbox" id="5.0i" />
                                                <label htmlFor="5.0i">{this.settingsText('Internet Explorer')}</label>
                                            </div>
                                            : null }
                                    </div>
                                    : null }
                                { /* fdmApp.platform == 'mac' ?
                                 <div>
                                 <input checked={s['monitoring-safari-enabled']}
                                 defaultChecked={s['monitoring-safari-enabled']} onChange={_.partial(this.changeSetting, 'monitoring-safari-enabled')}
                                 type="checkbox" id="5.1i" />
                                 <label htmlFor="5.1i">{__('Safari')}</label>
                                 </div>
                                 : null */}


                                <input checked={s['monitoring-ff-enabled']}
                                       defaultChecked={s['monitoring-ff-enabled']} onChange={_.partial(this.changeSetting, 'monitoring-ff-enabled')}
                                       type="checkbox" id="6i" />
                                <label htmlFor="6i"><span>{this.settingsText('Firefox')}</span>
                                    { s['monitoring-ff-enabled'] ?
                                        <div className="info" onClick={stopEventBubble}>
                                            {s['firefox-installed'] ?
                                                <div className="balloon ff" style={{marginTop: '8px'}}>
                                                    {this.settingsText('Verify if')}&nbsp;
                                                    <a onClick={function(){fdmApp.settings.openFirefoxPluginPage()}} href="#">{this.settingsText('extension')}</a>&nbsp;
                                                    {this.settingsText('is enabled')}
                                                </div>
                                                :
                                                <div className="balloon ff" style={{marginTop: '8px'}}>
                                                    {this.settingsText('Firefox isn\'t installed. Download it')} <a onClick={function(){fdmApp.settings.openFirefoxDownloadPage()}} href="#">{this.settingsText('here')}</a>.
                                                </div>
                                            }
                                        </div>
                                        : null }
                                </label>

                                <input checked={s['monitoring-chrome-enabled']}
                                       defaultChecked={s['monitoring-chrome-enabled']} onChange={_.partial(this.changeSetting, 'monitoring-chrome-enabled')}
                                       type="checkbox" id="7i" />
                                <label htmlFor="7i">{this.settingsText('Chrome')}

                                    { s['monitoring-chrome-enabled'] ?
                                        <div className="info" onClick={stopEventBubble}>
                                            {s['chrome-installed'] ?
                                                <div className="balloon" style={{marginTop: '8px'}}>
                                                    {this.settingsText('Verify if')}&nbsp;
                                                    <a onClick={function(){fdmApp.settings.openChromePluginPage()}} href="#">{this.settingsText('extension')}</a>&nbsp;
                                                    {this.settingsText('is enabled')}
                                                </div>
                                                :
                                                <div className="balloon" style={{marginTop: '8px'}}>
                                                    {this.settingsText('Chrome isn\'t installed. Download it')} <a onClick={function(){fdmApp.settings.openChromeDownloadPage()}} href="#">{this.settingsText('here')}</a>.
                                                </div>
                                            }
                                        </div>
                                        : null }
                                </label>
                            </div>

                            { fdmApp.platform == 'mac' ?
                                <span className="monitors">
                                    {this.settingsText('Safari: enable FDM')}&nbsp;
                                    <a href="#" onClick={this.openSafariExtension}>{this.settingsText('extension')}</a>&nbsp;
                                    {this.settingsText('for context menu')}
                                </span>
                                : null }
                        </div>
                        <br />


                        <div className="tab_title">{this.settingsText('Using Alt key')}</div>

                        <div className="wrap_group alt_group">

                            <input name="monitoring-alt-pressed-behaviour"
                                   checked={s['monitoring-alt-pressed-behaviour'] == 1}
                                   defaultChecked={s['monitoring-alt-pressed-behaviour'] == 1}
                                   value={1}
                                   onChange={_.partial(this.changeSetting, 'monitoring-alt-pressed-behaviour')}
                                   type="radio" id="alt-pressed-behaviour1" />
                            <label htmlFor="alt-pressed-behaviour1">{this.settingsText('Don\'t catch downloads when Alt is pressed')}</label>

                            <input name="monitoring-alt-pressed-behaviour"
                                   checked={s['monitoring-alt-pressed-behaviour'] == 0}
                                   defaultChecked={s['monitoring-alt-pressed-behaviour'] == 0}
                                   value={0}
                                   onChange={_.partial(this.changeSetting, 'monitoring-alt-pressed-behaviour')}
                                   type="radio" id="alt-pressed-behaviour0" />
                            <label htmlFor="alt-pressed-behaviour0">{this.settingsText('Catch downloads only when Alt is pressed')}</label>

                        </div>

                        <div className="tab_title">{this.settingsText('Automatically catch downloads from browsers')}</div>


                        <div className="wrap_group">

                            <input checked={s['monitoring-add-to-menu']}
                                   defaultChecked={s['monitoring-add-to-menu']} onChange={_.partial(this.changeSetting, 'monitoring-add-to-menu')}
                                   type="checkbox" id="11i" />
                            <label htmlFor="11i" className="float_none">{this.settingsText('Add FDM to browser context menu')}</label>

                            <input checked={s['monitoring-silent']}
                                   defaultChecked={s['monitoring-silent']}
                                   onChange={_.partial(this.changeSetting, 'monitoring-silent')}
                                   type="checkbox" id="monitoring-silent" />
                            <label htmlFor="monitoring-silent">{this.settingsText('Start downloading without confirmation')}</label>

                        </div>


                        <div className="wrap_group">

                            <div className="wrapper_group">
                                <input disabled={!selected_one_browser}
                                       checked={s['monitoring-skip-servers-enabled']}
                                       defaultChecked={s['monitoring-skip-servers-enabled']}
                                       onChange={_.partial(this.changeSetting, 'monitoring-skip-servers-enabled')}
                                       type="checkbox" id="monitoring-skip-servers-enabled" />
                                <label htmlFor="monitoring-skip-servers-enabled">{this.settingsText('Skip domains:')}</label>
                                <div className={rjs_class({
                                        absolute: true,
                                        disable: !s['monitoring-skip-servers-enabled'] || !selected_one_browser,
                                        error: ci.name == 'monitoring-skip-servers-value' && ci.error
                                        })}>
                                    {ci.name == 'monitoring-skip-servers-value' && ci.error ?
                                        <div className="block_error top">{ci.errorMessage}</div>
                                        : null }
                                    <input id="monitoring-skip-servers-value"
                                           disabled={!s['monitoring-skip-servers-enabled'] || !selected_one_browser}
                                           value={i['monitoring-skip-servers-value']}
                                           defaultValue={i['monitoring-skip-servers-value']}
                                           onChange={_.partial(this.changeInput, 'monitoring-skip-servers-value')}
                                           onFocus={_.partial(this.inputOnFocus, 'monitoring-skip-servers-value')}
                                           onBlur={_.partial(this.inputOnBlur, 'monitoring-skip-servers-value')}
                                           onKeyDown={_.partial(this.inputKeyDown, 'monitoring-skip-servers-value')}
                                           type="text" className="value" style={{width: '280px'}} />
                                </div>
                            </div>

                            <div className="wrapper_group">
                                <input disabled={!selected_one_browser}
                                       checked={s['monitoring-skip-extensions-enabled']}
                                       defaultChecked={s['monitoring-skip-extensions-enabled']}
                                       onChange={_.partial(this.changeSetting, 'monitoring-skip-extensions-enabled')}
                                       type="checkbox" id="12i" />
                                <label htmlFor="12i">{this.settingsText('Skip files with extensions:')}</label>
                                <div className={rjs_class({
                                        absolute: true,
                                        disable: !s['monitoring-skip-extensions-enabled'] || !selected_one_browser,
                                        error: ci.name == 'monitoring-skip-extensions-value' && ci.error
                                        })}>
                                    {ci.name == 'monitoring-skip-extensions-value' && ci.error ?
                                        <div className="block_error top">{ci.errorMessage}</div>
                                        : null }
                                    <input id="monitoring-skip-extensions-value"
                                           disabled={!s['monitoring-skip-extensions-enabled'] || !selected_one_browser}
                                           value={i['monitoring-skip-extensions-value']}
                                           defaultValue={i['monitoring-skip-extensions-value']}
                                           onChange={_.partial(this.changeInput, 'monitoring-skip-extensions-value')}
                                           onFocus={_.partial(this.inputOnFocus, 'monitoring-skip-extensions-value')}
                                           onBlur={_.partial(this.inputOnBlur, 'monitoring-skip-extensions-value')}
                                           onKeyDown={_.partial(this.inputKeyDown, 'monitoring-skip-extensions-value')}
                                           type="text" className="value" style={{width: '180px'}} />
                                </div>
                            </div>

                            <div className="wrapper_group">
                                <input disabled={!selected_one_browser}
                                       checked={s['monitoring-skip-smaller-enabled']}
                                       defaultChecked={s['monitoring-skip-smaller-enabled']}
                                       onChange={_.partial(this.changeSetting, 'monitoring-skip-smaller-enabled')}
                                       type="checkbox" id="10i" />
                                <label htmlFor="10i">{this.settingsText('Don\'t catch downloads smaller than')}</label>
                                <div className={rjs_class({
                                        absolute: true,
                                        disable: !s['monitoring-skip-smaller-enabled'] || !selected_one_browser,
                                        error: ci.name == 'monitoring-skip-smaller-value' && ci.error
                                        })}>
                                    <div className="spec_wrapper">
                                        {ci.name == 'monitoring-skip-smaller-value' && ci.error ?
                                            <div className="block_error top">{ci.errorMessage}</div>
                                            : null }
                                        <input id="monitoring-skip-smaller-value"
                                               className="width60"
                                               disabled={!s['monitoring-skip-smaller-enabled'] || !selected_one_browser}
                                               value={i['monitoring-skip-smaller-value']}
                                               defaultValue={i['monitoring-skip-smaller-value']}
                                               onChange={_.partial(this.changeInput, 'monitoring-skip-smaller-value')}
                                               onFocus={_.partial(this.inputOnFocus, 'monitoring-skip-smaller-value')}
                                               onBlur={_.partial(this.inputOnBlur, 'monitoring-skip-smaller-value')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'monitoring-skip-smaller-value')}
                                               type="text" />
                                        </div>
                                    <span className={rjs_class({disable: !s['monitoring-skip-smaller-enabled'] || !selected_one_browser})}>{this.settingsText('Kbytes')}</span>
                                </div>
                            </div>

                            <input disabled={!selected_one_browser}
                                   checked={s['monitoring-allow-download']}
                                   defaultChecked={s['monitoring-allow-download']} onChange={_.partial(this.changeSetting, 'monitoring-allow-download')}
                                   type="checkbox" id="9i" />
                            <label htmlFor="9i" className="float_none">{this.settingsText('Use browser if you cancel download via FDM')}</label>

                            {/*fdmApp.platform == 'win' && fdmApp.osversion >= 10 ?

                                <div>
                                    <input checked={s['monitoring-edge-httpportsonly']}
                                           defaultChecked={s['monitoring-edge-httpportsonly']} onChange={_.partial(this.changeSetting, 'monitoring-edge-httpportsonly')}
                                           disabled={ !s['monitoring-edge-enabled'] }
                                           type="checkbox" id="monitoring-edge-httpportsonly" />
                                    <label htmlFor="monitoring-edge-httpportsonly">
                                        {this.settingsText('Use only HTTP ports to catch downloads in Edge')}
                                    </label>
                                </div>

                                : null */}

                        </div>

                    </div>

                    </div>
                        : null }



                    {this.showBlock({
                        textList: [
                            'Proxy',
                            'No proxy',
                            'System proxy',
                            'Configure manually:',
                            'HTTP:',
                            'HTTPS:',
                            'FTP:',
                            'Address',
                            'Port',
                            'Login',
                            'Password',
                            'BitTorrent',
                            'DHT',
                            'Port forwarding',
                            'Local peer discovery',
                            'Peer exchange',
                            'uTP',
                            'Use ports in range:',
                            'to',
                            'Use proxy for P2P connections'
                        ]
                    }) ?

                    <div className="connection_tab">

                        <div id="connection_tab" className="group_title">{__('Network')}</div>

                        {this.showBlock({
                            textList: [
                                'Proxy',
                                'No proxy',
                                'System proxy',
                                'Configure manually:',
                                'HTTP:',
                                'HTTPS:',
                                'FTP:',
                                'Address',
                                'Port',
                                'Login',
                                'Password'
                            ]
                        }) ?
                        <div>

                        <div className="tab_title">{this.settingsText('Proxy')}</div>
                        <div className="wrap_group">

                            <input name="proxy-settings-source"
                                   checked={s['proxy-settings-source'] == 1}
                                   defaultChecked={s['proxy-settings-source'] == 1}
                                   value={1}
                                   onChange={_.partial(this.changeSetting, 'proxy-settings-source')}
                                   type="radio" id="system-proxy" />
                            <label htmlFor="system-proxy">{this.settingsText('System proxy')}</label>

                            <input name="proxy-settings-source"
                                   checked={s['proxy-settings-source'] == 0}
                                   defaultChecked={s['proxy-settings-source'] == 0}
                                   value={0}
                                   onChange={_.partial(this.changeSetting, 'proxy-settings-source')}
                                   type="radio" id="no-proxy" />
                            <label htmlFor="no-proxy">{this.settingsText('No proxy')}</label>

                            <input name="proxy-settings-source"
                                   checked={s['proxy-settings-source'] == 2}
                                   defaultChecked={s['proxy-settings-source'] == 2}
                                   value={2}
                                   onChange={_.partial(this.changeSetting, 'proxy-settings-source')}
                                   type="radio" id="specify-manually" />
                            <label htmlFor="specify-manually">{this.settingsText('Configure manually:')}</label>

                            {/*
                             <input type="radio" name="proxyDialog" id="no-proxy"/>
                             <label htmlFor="no-proxy">{__('No proxy')}</label>
                             <input type="radio" name="proxyDialog" id="system-proxy"/>
                             <label htmlFor="system-proxy">{__('System proxy')}</label>
                             <input type="radio" name="proxyDialog" id="specify-manually"/>
                             <label htmlFor="specify-manually">{__('Specify manually:')}</label>
                             */}

                            <div className={rjs_class({
                                wrap_fake_table: true,
                                disabled: s['proxy-settings-source'] == 0 || s['proxy-settings-source'] != 2 && fdmApp.platform == 'mac'
                            })}>
                                <div className="first_col column">
                                    <div>{this.settingsText('HTTP:')}</div>
                                    <div>{this.settingsText('HTTPS:')}</div>
                                    <div>{this.settingsText('FTP:')}</div>
                                </div>
                                <div className={rjs_class({
                                    second_col: true,
                                    column: true,
                                    disabled: s['proxy-settings-source'] != 2
                                })}>
                                    <div>{this.settingsText('Address')}</div>
                                    <div>
                                        <input id="proxy-http-settings-address"
                                               disabled={s['proxy-settings-source'] != 2}
                                               value={i['proxy-http-settings-address']}
                                               defaultValue={i['proxy-http-settings-address']}
                                               onChange={_.partial(this.changeInput, 'proxy-http-settings-address')}
                                               onFocus={_.partial(this.inputOnFocus, 'proxy-http-settings-address')}
                                               onBlur={_.partial(this.inputOnBlur, 'proxy-http-settings-address')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'proxy-http-settings-address')}
                                               type="text" />
                                    </div>
                                    <div>
                                        <input id="proxy-https-settings-address"
                                               disabled={s['proxy-settings-source'] != 2}
                                               value={i['proxy-https-settings-address']}
                                               defaultValue={i['proxy-https-settings-address']}
                                               onChange={_.partial(this.changeInput, 'proxy-https-settings-address')}
                                               onFocus={_.partial(this.inputOnFocus, 'proxy-https-settings-address')}
                                               onBlur={_.partial(this.inputOnBlur, 'proxy-https-settings-address')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'proxy-https-settings-address')}
                                               type="text" />
                                    </div>
                                    <div>
                                        <input id="proxy-ftp-settings-address"
                                               disabled={s['proxy-settings-source'] != 2}
                                               value={i['proxy-ftp-settings-address']}
                                               defaultValue={i['proxy-ftp-settings-address']}
                                               onChange={_.partial(this.changeInput, 'proxy-ftp-settings-address')}
                                               onFocus={_.partial(this.inputOnFocus, 'proxy-ftp-settings-address')}
                                               onBlur={_.partial(this.inputOnBlur, 'proxy-ftp-settings-address')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'proxy-ftp-settings-address')}
                                               type="text" />
                                    </div>
                                </div>
                                <div className={rjs_class({
                                    third_col: true,
                                    column: true,
                                    disabled: s['proxy-settings-source'] != 2
                                })}>
                                    <div>{this.settingsText('Port')}</div>
                                    <div>
                                        <div className={rjs_class({
                                        absolute: true,
                                        error: ci.name == 'proxy-http-settings-port' && ci.error
                                        })}>
                                            {ci.name == 'proxy-http-settings-port' && ci.error ?
                                                <div className="block_error top">{ci.errorMessage}</div>
                                                : null }
                                            <input id="proxy-http-settings-port"
                                                   className="short"
                                                   disabled={s['proxy-settings-source'] != 2}
                                                   value={i['proxy-http-settings-port']}
                                                   defaultValue={i['proxy-http-settings-port']}
                                                   onChange={_.partial(this.changeInput, 'proxy-http-settings-port')}
                                                   onFocus={_.partial(this.inputOnFocus, 'proxy-http-settings-port')}
                                                   onBlur={_.partial(this.inputOnBlur, 'proxy-http-settings-port')}
                                                   onKeyDown={_.partial(this.inputKeyDown, 'proxy-http-settings-port')}
                                                   type="text" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className={rjs_class({
                                        absolute: true,
                                        error: ci.name == 'proxy-https-settings-port' && ci.error
                                        })}>
                                            {ci.name == 'proxy-https-settings-port' && ci.error ?
                                                <div className="block_error top">{ci.errorMessage}</div>
                                                : null }
                                            <input id="proxy-https-settings-port"
                                                   className="short"
                                                   disabled={s['proxy-settings-source'] != 2}
                                                   value={i['proxy-https-settings-port']}
                                                   defaultValue={i['proxy-https-settings-port']}
                                                   onChange={_.partial(this.changeInput, 'proxy-https-settings-port')}
                                                   onFocus={_.partial(this.inputOnFocus, 'proxy-https-settings-port')}
                                                   onBlur={_.partial(this.inputOnBlur, 'proxy-https-settings-port')}
                                                   onKeyDown={_.partial(this.inputKeyDown, 'proxy-https-settings-port')}
                                                   type="text" />
                                        </div>
                                    </div>
                                    <div>

                                        <div className={rjs_class({
                                        absolute: true,
                                        error: ci.name == 'proxy-ftp-settings-port' && ci.error
                                        })}>
                                            {ci.name == 'proxy-ftp-settings-port' && ci.error ?
                                                <div className="block_error top">{ci.errorMessage}</div>
                                                : null }
                                            <input id="proxy-ftp-settings-port"
                                                   className="short"
                                                   disabled={s['proxy-settings-source'] != 2}
                                                   value={i['proxy-ftp-settings-port']}
                                                   defaultValue={i['proxy-ftp-settings-port']}
                                                   onChange={_.partial(this.changeInput, 'proxy-ftp-settings-port')}
                                                   onFocus={_.partial(this.inputOnFocus, 'proxy-ftp-settings-port')}
                                                   onBlur={_.partial(this.inputOnBlur, 'proxy-ftp-settings-port')}
                                                   onKeyDown={_.partial(this.inputKeyDown, 'proxy-ftp-settings-port')}
                                                   type="text" />
                                        </div>
                                    </div>
                                </div>
                                <div className="fourth_col column">
                                    <div>{this.settingsText('Login')}</div>
                                    <div>
                                        <input id="proxy-http-settings-login-name"
                                               className="medium"
                                               disabled={s['proxy-settings-source'] == 0 || s['proxy-settings-source'] != 2 && fdmApp.platform == 'mac'}
                                               value={i['proxy-http-settings-login-name']}
                                               defaultValue={i['proxy-http-settings-login-name']}
                                               onChange={_.partial(this.changeInput, 'proxy-http-settings-login-name')}
                                               onFocus={_.partial(this.inputOnFocus, 'proxy-http-settings-login-name')}
                                               onBlur={_.partial(this.inputOnBlur, 'proxy-http-settings-login-name')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'proxy-http-settings-login-name')}
                                               type="text" />
                                    </div>
                                    <div>
                                        <input id="proxy-https-settings-login-name"
                                               className="medium"
                                               disabled={s['proxy-settings-source'] == 0 || s['proxy-settings-source'] != 2 && fdmApp.platform == 'mac'}
                                               value={i['proxy-https-settings-login-name']}
                                               defaultValue={i['proxy-https-settings-login-name']}
                                               onChange={_.partial(this.changeInput, 'proxy-https-settings-login-name')}
                                               onFocus={_.partial(this.inputOnFocus, 'proxy-https-settings-login-name')}
                                               onBlur={_.partial(this.inputOnBlur, 'proxy-https-settings-login-name')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'proxy-https-settings-login-name')}
                                               type="text" />
                                    </div>
                                    <div>
                                        <input id="proxy-ftp-settings-login-name"
                                               className="medium"
                                               disabled={s['proxy-settings-source'] == 0 || s['proxy-settings-source'] != 2 && fdmApp.platform == 'mac'}
                                               value={i['proxy-ftp-settings-login-name']}
                                               defaultValue={i['proxy-ftp-settings-login-name']}
                                               onChange={_.partial(this.changeInput, 'proxy-ftp-settings-login-name')}
                                               onFocus={_.partial(this.inputOnFocus, 'proxy-ftp-settings-login-name')}
                                               onBlur={_.partial(this.inputOnBlur, 'proxy-ftp-settings-login-name')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'proxy-ftp-settings-login-name')}
                                               type="text" />
                                    </div>
                                </div>
                                <div className="fifth_col column">
                                    <div>{this.settingsText('Password')}</div>
                                    <div>
                                        <input id="proxy-http-settings-login-password"
                                               className="medium"
                                               disabled={s['proxy-settings-source'] == 0 || s['proxy-settings-source'] != 2 && fdmApp.platform == 'mac'}
                                               value={i['proxy-http-settings-login-password']}
                                               defaultValue={i['proxy-http-settings-login-password']}
                                               onChange={_.partial(this.changeInput, 'proxy-http-settings-login-password')}
                                               onFocus={_.partial(this.inputOnFocus, 'proxy-http-settings-login-password')}
                                               onBlur={_.partial(this.inputOnBlur, 'proxy-http-settings-login-password')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'proxy-http-settings-login-password')}
                                               type="password" />
                                    </div>
                                    <div>
                                        <input id="proxy-https-settings-login-password"
                                               className="medium"
                                               disabled={s['proxy-settings-source'] == 0 || s['proxy-settings-source'] != 2 && fdmApp.platform == 'mac'}
                                               value={i['proxy-https-settings-login-password']}
                                               defaultValue={i['proxy-https-settings-login-password']}
                                               onChange={_.partial(this.changeInput, 'proxy-https-settings-login-password')}
                                               onFocus={_.partial(this.inputOnFocus, 'proxy-https-settings-login-password')}
                                               onBlur={_.partial(this.inputOnBlur, 'proxy-https-settings-login-password')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'proxy-https-settings-login-password')}
                                               type="password" />
                                    </div>
                                    <div>
                                        <input id="proxy-ftp-settings-login-password"
                                               className="medium"
                                               disabled={s['proxy-settings-source'] == 0 || s['proxy-settings-source'] != 2 && fdmApp.platform == 'mac'}
                                               value={i['proxy-ftp-settings-login-password']}
                                               defaultValue={i['proxy-ftp-settings-login-password']}
                                               onChange={_.partial(this.changeInput, 'proxy-ftp-settings-login-password')}
                                               onFocus={_.partial(this.inputOnFocus, 'proxy-ftp-settings-login-password')}
                                               onBlur={_.partial(this.inputOnBlur, 'proxy-ftp-settings-login-password')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'proxy-ftp-settings-login-password')}
                                               type="password" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        </div>
                            : null }


                        {this.showBlock({
                            textList: [
                                'BitTorrent',
                                'DHT',
                                'Port forwarding',
                                'Local peer discovery',
                                'Peer exchange',
                                'uTP',
                                'Use ports in range:',
                                'to',
                                'Use proxy for P2P connections'
                            ]
                        }) ?
                            <div>

                        <div className="tab_title">{this.settingsText('BitTorrent')}</div>

                        <div className="wrap_group">

                            <input checked={s['bittorrent-enable-dht']}
                                   defaultChecked={s['bittorrent-enable-dht']} onChange={_.partial(this.changeSetting, 'bittorrent-enable-dht')}
                                   type="checkbox" id="b1a" />
                            <label htmlFor="b1a">{this.settingsText('DHT')}</label>

                            <input checked={s['bittorrent-enable-port-forwarding']}
                                   defaultChecked={s['bittorrent-enable-port-forwarding']} onChange={_.partial(this.changeSetting, 'bittorrent-enable-port-forwarding')}
                                   type="checkbox" id="b2a" />
                            <label htmlFor="b2a">{this.settingsText('Port forwarding')}</label>

                            <input checked={s['bittorrent-enable-local-peer-discovery']}
                                   defaultChecked={s['bittorrent-enable-local-peer-discovery']} onChange={_.partial(this.changeSetting, 'bittorrent-enable-local-peer-discovery')}
                                   type="checkbox" id="b3a" />
                            <label htmlFor="b3a">{this.settingsText('Local peer discovery')}</label>

                            <input checked={s['bittorrent-enable-utpex']}
                                   defaultChecked={s['bittorrent-enable-utpex']} onChange={_.partial(this.changeSetting, 'bittorrent-enable-utpex')}
                                   type="checkbox" id="b4a" />
                            <label htmlFor="b4a">{this.settingsText('Peer exchange')}</label>

                            <input checked={s['bittorrent-enable-utp']}
                                   defaultChecked={s['bittorrent-enable-utp']} onChange={_.partial(this.changeSetting, 'bittorrent-enable-utp')}
                                   type="checkbox" id="b5a" />
                            <label htmlFor="b5a">{this.settingsText('uTP')}</label>

                            <input checked={s['bittorrent-proxy-peer-connections']}
                                   defaultChecked={s['bittorrent-proxy-peer-connections']} onChange={_.partial(this.changeSetting, 'bittorrent-proxy-peer-connections')}
                                   type="checkbox" id="bittorrent-proxy-peer-connections" />
                            <label htmlFor="bittorrent-proxy-peer-connections">{this.settingsText('Use proxy for P2P connections')}</label>

                            <span style={{float: 'left'}}>{this.settingsText('Use ports in range:')}</span>

                            <div onClick={stopEventBubble}
                                 className={rjs_class({
                                        absolute: true,
                                        num_records: true,
                                        error: ci.name == 'bittorrent-port-from' && ci.error
                                        })}>

                                {ci.name == 'bittorrent-port-from' && ci.error ?
                                    <div className="block_error top">{ci.errorMessage}</div>
                                    : null }
                                <input style={{width: '50px'}}
                                       id="bittorrent-port-from"
                                    //disabled={!s['bittorrent-port-range-enabled']}
                                       value={i['bittorrent-port-from']}
                                       defaultValue={i['bittorrent-port-from']}
                                       onChange={_.partial(this.changeInput, 'bittorrent-port-from')}
                                       onFocus={_.partial(this.inputOnFocus, 'bittorrent-port-from')}
                                       onBlur={_.partial(this.inputOnBlur, 'bittorrent-port-from')}
                                       onKeyDown={_.partial(this.inputKeyDown, 'bittorrent-port-from')}
                                       type="text" />

                            </div>

                            <span style={{float: 'left'}} onClick={stopEventBubble}>{this.settingsText('to')}</span>

                            <div onClick={stopEventBubble}
                                 className={rjs_class({
                                        absolute: true,
                                        num_records: true,
                                        error: ci.name == 'bittorrent-port-to' && ci.error
                                        })}>

                                {ci.name == 'bittorrent-port-to' && ci.error ?
                                    <div className="block_error top">{ci.errorMessage}</div>
                                    : null }
                                <input style={{width: '50px'}}
                                       id="bittorrent-port-to"
                                    //disabled={!s['bittorrent-port-range-enabled']}
                                       value={i['bittorrent-port-to']}
                                       defaultValue={i['bittorrent-port-to']}
                                       onChange={_.partial(this.changeInput, 'bittorrent-port-to')}
                                       onFocus={_.partial(this.inputOnFocus, 'bittorrent-port-to')}
                                       onBlur={_.partial(this.inputOnBlur, 'bittorrent-port-to')}
                                       onKeyDown={_.partial(this.inputKeyDown, 'bittorrent-port-to')}
                                       type="text" />

                            </div>

                        </div>

                        </div>
                            : null }

                        <div className="clear"></div>

                    </div>
                        : null }


                    {this.showBlock({
                        textList: [
                            'Traffic Limits',
                            //'Parameters',
                            'Low',
                            'Medium',
                            'High',
                            'Download speed',
                            'Upload speed',
                            'Maximum number of connections',
                            'Maximum number of simultaneous downloads'
                        ]
                    }) ?

                    <div className="tum_tab">
                        <div id="tum_tab" className="group_title">{this.settingsText('Traffic Limits', false, 'settings')}</div>

                        <table>
                            <thead>
                            <tr>
                                <td>{/*this.settingsText('Parameters')*/}</td>
                                <td>{this.settingsText('Low')}</td>
                                <td>{this.settingsText('Medium')}</td>
                                <td>{this.settingsText('High')}</td>
                            </tr>
                            </thead>
                            <tbody>

                            {this.showBlock({
                                title: 'Traffic Limits',
                                textList: [
                                    'Download speed',
                                    'Low',
                                    'Medium',
                                    'High'
                                ]
                            }) ?
                            <tr>
                                <td>{this.settingsText('Download speed')}</td>
                                <td>

                                    <TUM ct={ct} ci={ci} name="tum-low-restriction-absolute" namet="tum-low-restriction-type"
                                         iv={i['tum-low-restriction-absolute']}
                                         tv={s['tum-low-restriction-type']}
                                         tumClickFn={_.bind(this.tumClick, this, 'tum-low-restriction-absolute')}
                                         onChangeFn={_.bind(this.changeInput, this, 'tum-low-restriction-absolute')}
                                         onFocusFn={_.bind(this.inputOnFocus, this, 'tum-low-restriction-absolute')}
                                         onBlurFn={_.bind(this.inputOnBlur, this, 'tum-low-restriction-absolute')}
                                         onKeyDownFn={_.bind(this.inputKeyDown, this, 'tum-low-restriction-absolute')}
                                         setSettingFn={_.bind(this.setSetting, this)}
                                        />
                                </td>
                                <td>

                                    <TUM ct={ct} ci={ci} name="tum-medium-restriction-absolute" namet="tum-medium-restriction-type"
                                         iv={i['tum-medium-restriction-absolute']}
                                         tv={s['tum-medium-restriction-type']}
                                         tumClickFn={_.bind(this.tumClick, this, 'tum-medium-restriction-absolute')}
                                         onChangeFn={_.bind(this.changeInput, this, 'tum-medium-restriction-absolute')}
                                         onFocusFn={_.bind(this.inputOnFocus, this, 'tum-medium-restriction-absolute')}
                                         onBlurFn={_.bind(this.inputOnBlur, this, 'tum-medium-restriction-absolute')}
                                         onKeyDownFn={_.bind(this.inputKeyDown, this, 'tum-medium-restriction-absolute')}
                                         setSettingFn={_.bind(this.setSetting, this)}
                                        />

                                </td>
                                <td>
                                    <div className="wrapper_inselect disable">
                                        <span>{__('Unlimited')}</span>
                                    </div>
                                </td>
                            </tr>
                                : null }

                            {this.showBlock({
                                title: 'Traffic Limits',
                                textList: [
                                    'Upload speed',
                                    'Low',
                                    'Medium',
                                    'High'
                                ]
                            }) ?
                            <tr>
                                <td>{this.settingsText('Upload speed')}</td>
                                <td>

                                    <TUM ct={ct} ci={ci} name="tum-low-upload-restriction-absolute" namet="tum-low-upload-restriction-type"
                                         iv={i['tum-low-upload-restriction-absolute']}
                                         tv={s['tum-low-upload-restriction-type']}
                                         tumClickFn={_.bind(this.tumClick, this, 'tum-low-upload-restriction-absolute')}
                                         onChangeFn={_.bind(this.changeInput, this, 'tum-low-upload-restriction-absolute')}
                                         onFocusFn={_.bind(this.inputOnFocus, this, 'tum-low-upload-restriction-absolute')}
                                         onBlurFn={_.bind(this.inputOnBlur, this, 'tum-low-upload-restriction-absolute')}
                                         onKeyDownFn={_.bind(this.inputKeyDown, this, 'tum-low-upload-restriction-absolute')}
                                         setSettingFn={_.bind(this.setSetting, this)}
                                        />

                                </td>
                                <td>
                                    <TUM ct={ct} ci={ci} name="tum-medium-upload-restriction-absolute" namet="tum-medium-upload-restriction-type"
                                         iv={i['tum-medium-upload-restriction-absolute']}
                                         tv={s['tum-medium-upload-restriction-type']}
                                         tumClickFn={_.bind(this.tumClick, this, 'tum-medium-upload-restriction-absolute')}
                                         onChangeFn={_.bind(this.changeInput, this, 'tum-medium-upload-restriction-absolute')}
                                         onFocusFn={_.bind(this.inputOnFocus, this, 'tum-medium-upload-restriction-absolute')}
                                         onBlurFn={_.bind(this.inputOnBlur, this, 'tum-medium-upload-restriction-absolute')}
                                         onKeyDownFn={_.bind(this.inputKeyDown, this, 'tum-medium-upload-restriction-absolute')}
                                         setSettingFn={_.bind(this.setSetting, this)}
                                        />
                                </td>
                                <td>
                                    <div className="wrapper_inselect disable">
                                        <span>{__('Unlimited')}</span>
                                    </div>
                                </td>
                            </tr>
                                : null }

                            {this.showBlock({
                                title: 'Traffic Limits',
                                textList: [
                                    'Maximum number of connections',
                                    'Low',
                                    'Medium',
                                    'High'
                                ]
                            }) ?
                            <tr>
                                <td className="two_lines">{this.settingsText('Maximum number of connections')}</td>
                                <td>

                                    <div className={rjs_class({
                                    relative: true,
                                    error: ci.name == 'tum-low-max-connections-value' && ci.error
                                    })}>
                                        {ci.name == 'tum-low-max-connections-value' && ci.error ?
                                            <div className="block_error top">{ci.errorMessage}</div>
                                            : null }
                                        <input id="tum-low-max-connections-value"
                                               value={i['tum-low-max-connections-value']}
                                               defaultValue={i['tum-low-max-connections-value']}
                                               onChange={_.partial(this.changeInput, 'tum-low-max-connections-value')}
                                               onFocus={_.partial(this.inputOnFocus, 'tum-low-max-connections-value')}
                                               onBlur={_.partial(this.inputOnBlur, 'tum-low-max-connections-value')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'tum-low-max-connections-value')}
                                               type="text" className="simple_input" />
                                    </div>
                                </td>
                                <td>

                                    <div className={rjs_class({
                                    relative: true,
                                    error: ci.name == 'tum-medium-max-connections-value' && ci.error
                                    })}>
                                        {ci.name == 'tum-medium-max-connections-value' && ci.error ?
                                            <div className="block_error top">{ci.errorMessage}</div>
                                            : null }
                                        <input id="tum-medium-max-connections-value"
                                               value={i['tum-medium-max-connections-value']}
                                               defaultValue={i['tum-medium-max-connections-value']}
                                               onChange={_.partial(this.changeInput, 'tum-medium-max-connections-value')}
                                               onFocus={_.partial(this.inputOnFocus, 'tum-medium-max-connections-value')}
                                               onBlur={_.partial(this.inputOnBlur, 'tum-medium-max-connections-value')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'tum-medium-max-connections-value')}
                                               type="text" className="simple_input" />
                                    </div>
                                </td>
                                <td>
                                    <div className={rjs_class({
                                    relative: true,
                                    error: ci.name == 'tum-high-max-connections-value' && ci.error
                                    })}>
                                        {ci.name == 'tum-high-max-connections-value' && ci.error ?
                                            <div className="block_error top">{ci.errorMessage}</div>
                                            : null }
                                        <input id="tum-high-max-connections-value"
                                               value={i['tum-high-max-connections-value']}
                                               defaultValue={i['tum-high-max-connections-value']}
                                               onChange={_.partial(this.changeInput, 'tum-high-max-connections-value')}
                                               onFocus={_.partial(this.inputOnFocus, 'tum-high-max-connections-value')}
                                               onBlur={_.partial(this.inputOnBlur, 'tum-high-max-connections-value')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'tum-high-max-connections-value')}
                                               type="text" className="simple_input" />
                                    </div>
                                </td>
                            </tr>
                                : null }

                            {this.showBlock({
                                title: 'Traffic Limits',
                                textList: [
                                    'Maximum number of simultaneous downloads',
                                    'Low',
                                    'Medium',
                                    'High'
                                ]
                            }) ?
                            <tr>
                                <td className="two_lines">{this.settingsText('Maximum number of simultaneous downloads')}</td>
                                <td>
                                    <div className={rjs_class({
                                    relative: true,
                                    error: ci.name == 'tum-low-max-tasks-value' && ci.error
                                    })}>
                                        {ci.name == 'tum-low-max-tasks-value' && ci.error ?
                                            <div className="block_error top">{ci.errorMessage}</div>
                                            : null }
                                        <input id="tum-low-max-tasks-value"
                                               value={i['tum-low-max-tasks-value']}
                                               defaultValue={i['tum-low-max-tasks-value']}
                                               onChange={_.partial(this.changeInput, 'tum-low-max-tasks-value')}
                                               onFocus={_.partial(this.inputOnFocus, 'tum-low-max-tasks-value')}
                                               onBlur={_.partial(this.inputOnBlur, 'tum-low-max-tasks-value')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'tum-low-max-tasks-value')}
                                               type="text" className="simple_input" />
                                    </div>
                                </td>
                                <td>
                                    <div className={rjs_class({
                                    relative: true,
                                    error: ci.name == 'tum-medium-max-tasks-value' && ci.error
                                    })}>
                                        {ci.name == 'tum-medium-max-tasks-value' && ci.error ?
                                            <div className="block_error top">{ci.errorMessage}</div>
                                            : null }
                                        <input id="tum-medium-max-tasks-value"
                                               value={i['tum-medium-max-tasks-value']}
                                               defaultValue={i['tum-medium-max-tasks-value']}
                                               onChange={_.partial(this.changeInput, 'tum-medium-max-tasks-value')}
                                               onFocus={_.partial(this.inputOnFocus, 'tum-medium-max-tasks-value')}
                                               onBlur={_.partial(this.inputOnBlur, 'tum-medium-max-tasks-value')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'tum-medium-max-tasks-value')}
                                               type="text" className="simple_input" />
                                    </div>
                                </td>
                                <td>
                                    <div className={rjs_class({
                                    relative: true,
                                    error: ci.name == 'tum-high-max-tasks-value' && ci.error
                                    })}>
                                        {ci.name == 'tum-high-max-tasks-value' && ci.error ?
                                            <div className="block_error top">{ci.errorMessage}</div>
                                            : null }
                                        <input id="tum-high-max-tasks-value"
                                               value={i['tum-high-max-tasks-value']}
                                               defaultValue={i['tum-high-max-tasks-value']}
                                               onChange={_.partial(this.changeInput, 'tum-high-max-tasks-value')}
                                               onFocus={_.partial(this.inputOnFocus, 'tum-high-max-tasks-value')}
                                               onBlur={_.partial(this.inputOnBlur, 'tum-high-max-tasks-value')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'tum-high-max-tasks-value')}
                                               type="text" className="simple_input" />
                                    </div>
                                </td>
                            </tr>
                                : null }
                            </tbody>
                        </table>

                        <div className="clear"></div>
                    </div>

                        : null }

                    {this.showBlock({
                        textList: [
                            'History',
                            'Remember all destination folders',
                            'Clear history older than',
                            'days',
                            'Maximum number of history records:',
                            'Disk usage',
                            'Preallocate disk space for files larger than',
                            'Gbytes',
                            'Delete button action',
                            'Remove only from download list',
                            'Delete files',
                            'Always ask',
                            'Prevent sleep if there are active downloads',
                            //'Power management',
                            //'After downloads are completed, computer will',
                            //'Hibernate',
                            //'Switch to sleep mode',
                            //'Shut down',
                            'Go back to default settings',
                            'Reset',
                            fdmApp.platform == 'mac' ? 'Open at Login' : 'Launch at startup (minimized)',
                            'Close button minimizes window',
                            !fdmApp.AssociateWithTorrentsDisabled ? 'Check if FDM is your default torrent client' : '',
                            'Associate with torrents'
                        ]
                    }) ?

                    <div className="advanced_tab">

                        <div id="advanced_tab" className="group_title">{__('Advanced')}</div>


                        {this.showBlock({
                            title: 'Notifications',
                            textList: [
                                'Notify me of completed downloads via Notification Center',
                                'Only when FDM window is inactive'
                            ]
                        }) ?
                            <div>

                                <div className="tab_title">{this.settingsText('Notifications')}</div>
                                <div className="wrap_group">
                                    <input checked={s['notify-about-completed-downloads']}
                                           defaultChecked={s['notify-about-completed-downloads']} onChange={_.partial(this.changeSetting, 'notify-about-completed-downloads')}
                                           type="checkbox" id="1f" />
                                    <label htmlFor="1f">{this.settingsText('Notify me of completed downloads via Notification Center')}</label>

                                    <div className="sub_group">
                                        <input disabled={!s['notify-about-completed-downloads']}
                                               checked={s['notify-only-window-is-inactive']}
                                               defaultChecked={s['notify-only-window-is-inactive']} onChange={_.partial(this.changeSetting, 'notify-only-window-is-inactive')}
                                               type="checkbox" id="2f" />
                                        <label htmlFor="2f">{this.settingsText('Only when FDM window is inactive')}</label>
                                    </div>
                                </div>

                            </div>
                            : null }

                        {this.showBlock({
                            textList: [
                                'Don\'t put your computer to sleep if there is an active download',
                                'Power management',
                                'Don\'t put your computer to sleep if there is a scheduled download'
                            ]
                        }) ?
                            <div>
                                <div className="tab_title">{this.settingsText('Power management')}</div>

                                <div className="wrapper_group wrap_group power">

                                    {this.showBlock({
                                        textList: [
                                            'Don\'t put your computer to sleep if there is an active download',
                                            'Power management'
                                        ]
                                    }) ?
                                        <div>
                                            <input checked={s['prevent-sleep-if-active-downloads']}
                                                   defaultChecked={s['prevent-sleep-if-active-downloads']}
                                                   onChange={_.partial(this.changeSetting, 'prevent-sleep-if-active-downloads')}
                                                   type="checkbox" id="prevent-sleep-if-active-downloads" />
                                            <label htmlFor="prevent-sleep-if-active-downloads">{this.settingsText('Don\'t put your computer to sleep if there is an active download')}</label>
                                        </div>
                                        : null }

                                    {this.showBlock({
                                        textList: [
                                            'Don\'t put your computer to sleep if there is a scheduled download',
                                            'Power management'
                                        ]
                                    }) ?

                                        <div>
                                            <input checked={s['prevent-sleep-if-scheduled-downloads']}
                                                   defaultChecked={s['prevent-sleep-if-scheduled-downloads']}
                                                   onChange={_.partial(this.changeSetting, 'prevent-sleep-if-scheduled-downloads')}
                                                   type="checkbox" id="prevent-sleep-if-scheduled-downloads" />
                                            <label htmlFor="prevent-sleep-if-scheduled-downloads">
                                                {this.settingsText('Don\'t put your computer to sleep if there is a scheduled download')}
                                            </label>
                                        </div>
                                        : null }

                                    {this.showBlock({
                                        textList: [
                                            'Enable sleep mode while seeding torrents',
                                            'Power management'
                                        ]
                                    }) ?
                                        <div>
                                            <input checked={s['prevent-sleep-if-uploading-downloads-active']}
                                                   defaultChecked={s['prevent-sleep-if-uploading-downloads-active']}
                                                   onChange={_.partial(this.changeSetting, 'prevent-sleep-if-uploading-downloads-active')}
                                                   type="checkbox" id="prevent-sleep-if-uploading-downloads-active" />
                                            <label htmlFor="prevent-sleep-if-uploading-downloads-active">{this.settingsText('Enable sleep mode while seeding torrents')}</label>
                                        </div>
                                        : null }

                                </div>
                            </div>

                            : null }


                        {this.showBlock({
                            //title: fdmApp.platform == "mac" ? 'Login' : 'Startup',
                            title: 'Options',
                            textList: [
                                fdmApp.platform == 'mac' ? 'Open at Login' : 'Launch at startup (minimized)',
                                'Close button minimizes window',
                                !fdmApp.AssociateWithTorrentsDisabled ? 'Check if FDM is your default torrent client' : '',
                                'Associate with torrents',
                                //'Send anonymous statistics'
                            ]
                        }) ?
                            <div>
                                {/*<div className="tab_title">{this.settingsText(fdmApp.platform == "mac" ? 'Login' : 'Startup', false, 'settings')}</div>*/}
                                <div className="tab_title">{this.settingsText('Options', false, 'Advanced')}</div>
                                <div className="wrap_group">

                                    {this.showBlock({
                                        //title: fdmApp.platform == "mac" ? 'Login' : 'Startup',
                                        title: 'Options',
                                        textList: [
                                            fdmApp.platform == 'mac' ? 'Open at Login' : 'Launch at startup (minimized)'
                                        ]
                                    }) ?
                                        <div>
                                            <input checked={s['general-load-on-startup']}
                                                   defaultChecked={s['general-load-on-startup']} onChange={_.partial(this.changeSetting, 'general-load-on-startup')}
                                                   type="checkbox" id="1i" />
                                            <label htmlFor="1i">{this.settingsText(fdmApp.platform == 'mac' ? 'Open at Login' : 'Launch at startup (minimized)')}</label>
                                        </div>
                                        : null }

                                    {this.showBlock({
                                        //title: fdmApp.platform == "mac" ? 'Login' : 'Startup',
                                        title: 'Options',
                                        textList: [
                                            'Close button minimizes window'
                                        ]
                                    }) ?
                                        <div>
                                            <input checked={s['behavior-close-as-minimize']}
                                                   defaultChecked={s['behavior-close-as-minimize']} onChange={_.partial(this.changeSetting, 'behavior-close-as-minimize')}
                                                   type="checkbox" id="2i" />
                                            <label htmlFor="2i">{this.settingsText('Close button minimizes window')}</label>
                                        </div>
                                        : null }

                                    { /*this.showBlock({
                                        title: 'Options',
                                        textList: [
                                            'Send anonymous statistics'
                                        ]
                                    }) ?
                                        <div>

                                            <input checked={s['send-anon-usage-stats']}
                                                   defaultChecked={s['send-anon-usage-stats']} onChange={_.partial(this.changeSetting, 'send-anon-usage-stats')}
                                                   type="checkbox" id="3_1i" />
                                            <label htmlFor="3_1i">{this.settingsText('Send anonymous statistics')}</label>

                                        </div>
                                        : null */}

                                    {!fdmApp.AssociateWithTorrentsDisabled && this.showBlock({
                                        //title: fdmApp.platform == "mac" ? 'Login' : 'Startup',
                                        title: 'Options',
                                        textList: [
                                            'Check if FDM is your default torrent client',
                                            'Associate with torrents'
                                        ]
                                    }) ?
                                        <div>
                                            <div className="wrapper_group">
                                                <input checked={s['check-default-torrent-client-at-startup']}
                                                       defaultChecked={s['check-default-torrent-client-at-startup']}
                                                       onChange={_.partial(this.changeSetting, 'check-default-torrent-client-at-startup')}
                                                       type="checkbox" id="check-default-torrent-client-at-startup" />
                                                <label htmlFor="check-default-torrent-client-at-startup">
                                                    {__('Check if FDM is your default torrent client')}
                                                </label>
                                            </div>
                                            <button className="associate" disabled={this.state.defaultTrtClient}
                                                    onClick={this.setDefaultTrtClient}>{__('Associate with torrents')}</button>
                                        </div>
                                        : null }

                                </div>
                            </div>
                            : null }


                        {this.showBlock({
                            textList: [
                                'History',
                                'Remember all destination folders',
                                'Clear history older than',
                                'days',
                                'Maximum number of history records:'
                            ]
                        }) ?
                            <div>
                        <div className="tab_title">{this.settingsText('History')}</div>

                        <div className="wrap_group">
                            <input checked={s['folder-history-enabled']}
                                   defaultChecked={s['folder-history-enabled']} onChange={_.partial(this.changeSetting, 'folder-history-enabled')}
                                   type="checkbox" id="13i" />
                            <label htmlFor="13i">{this.settingsText('Remember all destination folders')}</label>

                            <div className="sub_group">
                                <div className="wrapper_group">
                                    <input type="checkbox" id="14i"
                                           disabled={!s['folder-history-enabled']}
                                           checked={s['folder-history-keep-records-enabled']}
                                           defaultChecked={s['folder-history-keep-records-enabled']}
                                           onChange={_.partial(this.changeSetting, 'folder-history-keep-records-enabled')}
                                        />
                                    <label htmlFor="14i">{this.settingsText('Clear history older than', i['folder-history-keep-records-value'])}</label>
                                    <div onClick={stopEventBubble}
                                         className={rjs_class({
                                        absolute: true,
                                        records: true,
                                        error: ci.name == 'folder-history-keep-records-value' && ci.error
                                        })}>
                                        <div className="spec_wrapper">
                                            {ci.name == 'folder-history-keep-records-value' && ci.error ?
                                                <div className="block_error top">{ci.errorMessage}</div>
                                                : null }
                                            <input id="folder-history-keep-records-value"
                                                   disabled={!s['folder-history-keep-records-enabled'] || !s['folder-history-enabled']}
                                                   value={i['folder-history-keep-records-value']}
                                                   defaultValue={i['folder-history-keep-records-value']}
                                                   onChange={_.partial(this.changeInput, 'folder-history-keep-records-value')}
                                                   onFocus={_.partial(this.inputOnFocus, 'folder-history-keep-records-value')}
                                                   onBlur={_.partial(this.inputOnBlur, 'folder-history-keep-records-value')}
                                                   onKeyDown={_.partial(this.inputKeyDown, 'folder-history-keep-records-value')}
                                                   type="text" />
                                        </div>
                                        <span className={rjs_class({disable: !s['folder-history-keep-records-enabled'] || !s['folder-history-enabled']})}>
                                            {this.settingsText('days', i['folder-history-keep-records-value'])}
                                        </span>
                                    </div>
                                </div>

                                <div className="wrapper_group">
                                    <input type="checkbox" id="15i"
                                           disabled={!s['folder-history-enabled']}
                                           checked={s['folder-history-max-records-enabled']}
                                           defaultChecked={s['folder-history-max-records-enabled']}
                                           onChange={_.partial(this.changeSetting, 'folder-history-max-records-enabled')}

                                        />
                                    <label htmlFor="15i">{this.settingsText('Maximum number of history records:')}</label>
                                    <div onClick={stopEventBubble}
                                         className={rjs_class({
                                        absolute: true,
                                        num_records: true,
                                        error: ci.name == 'folder-history-max-records-value' && ci.error
                                        })}>
                                        {ci.name == 'folder-history-max-records-value' && ci.error ?
                                            <div className="block_error top">{ci.errorMessage}</div>
                                            : null }
                                        <input id="folder-history-max-records-value"
                                               disabled={!s['folder-history-max-records-enabled'] || !s['folder-history-enabled']}
                                               value={i['folder-history-max-records-value']}
                                               defaultValue={i['folder-history-max-records-value']}
                                               onChange={_.partial(this.changeInput, 'folder-history-max-records-value')}
                                               onFocus={_.partial(this.inputOnFocus, 'folder-history-max-records-value')}
                                               onBlur={_.partial(this.inputOnBlur, 'folder-history-max-records-value')}
                                               onKeyDown={_.partial(this.inputKeyDown, 'folder-history-max-records-value')}
                                               type="text" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                            : null }

                        {this.showBlock({
                            textList: [
                                'Disk usage',
                                'Preallocate disk space for files larger than',
                                'Gbytes'
                            ]
                        }) ?
                        <div>

                        <div className="tab_title">{this.settingsText('Disk usage')}</div>

                        <div className="wrapper_group wrap_group">
                            <input checked={s['reserve-file-space-larger-enabled']}
                                   defaultChecked={s['reserve-file-space-larger-enabled']}
                                   onChange={_.partial(this.changeSetting, 'reserve-file-space-larger-enabled')}
                                   type="checkbox" id="reserve-file-space-larger-enabled" />
                            <label htmlFor="reserve-file-space-larger-enabled">{this.settingsText('Preallocate disk space for files larger than')}</label>
                            <div className={rjs_class({
                                        absolute: true,
                                        disable: !s['reserve-file-space-larger-enabled'],
                                        error: ci.name == 'reserve-file-space-larger-value' && ci.error
                                        })}>
                                <div className="spec_wrapper">
                                    {ci.name == 'reserve-file-space-larger-value' && ci.error ?
                                        <div className="block_error top">{ci.errorMessage}</div>
                                        : null }
                                    <input id="reserve-file-space-larger-value"
                                           disabled={!s['reserve-file-space-larger-enabled']}
                                           value={i['reserve-file-space-larger-value']}
                                           defaultValue={i['reserve-file-space-larger-value']}
                                           onChange={_.partial(this.changeInput, 'reserve-file-space-larger-value')}
                                           onFocus={_.partial(this.inputOnFocus, 'reserve-file-space-larger-value')}
                                           onBlur={_.partial(this.inputOnBlur, 'reserve-file-space-larger-value')}
                                           onKeyDown={_.partial(this.inputKeyDown, 'reserve-file-space-larger-value')}
                                           type="text" className="value" style={{width: '50px'}} />
                                </div>
                                <span className={rjs_class({disable: !s['reserve-file-space-larger-enabled']})}>{this.settingsText('Gbytes')}</span>
                            </div>
                        </div>

                        </div>
                            : null }


                        {/*this.showBlock({
                            textList: [
                                'After downloads are completed, computer will',
                                'Hibernate',
                                'Switch to sleep mode',
                                'Shut down'
                            ]
                        }) ?
                            <div className="downloads_tab">
                                <div className="tab_title">{this.settingsText('After downloads are completed, computer will')}</div>

                                <div className="wrap_group">


                                    {fdmApp.platform == 'win' ?
                                        <div>
                                            <input name="prevent_sleep_action"
                                                   checked={s['prevent-sleep-action'] == fdm.models.preventSleepAction.Hibernate}
                                                   defaultChecked={s['prevent-sleep-action'] == fdm.models.preventSleepAction.Hibernate}
                                                   value={fdm.models.preventSleepAction.Hibernate}
                                                   onChange={_.partial(this.changeSetting, 'prevent-sleep-action')}
                                                   type="radio" id="prevent_sleep_action_c" />
                                            <label htmlFor="prevent_sleep_action_c">{this.settingsText('Hibernate')}</label>
                                        </div>
                                        : null }

                                    <input name="prevent_sleep_action"
                                           checked={s['prevent-sleep-action'] == fdm.models.preventSleepAction.Sleep }
                                           defaultChecked={s['prevent-sleep-action'] == fdm.models.preventSleepAction.Sleep}
                                           value={fdm.models.preventSleepAction.Sleep}
                                           onChange={_.partial(this.changeSetting, 'prevent-sleep-action')}
                                           type="radio" id="prevent_sleep_action_a" />
                                    <label htmlFor="prevent_sleep_action_a">{this.settingsText('Switch to sleep mode')}</label>

                                    <input name="prevent_sleep_action"
                                           checked={s['prevent-sleep-action'] == fdm.models.preventSleepAction.Shutdown}
                                           defaultChecked={s['prevent-sleep-action'] == fdm.models.preventSleepAction.Shutdown}
                                           value={fdm.models.preventSleepAction.Shutdown}
                                           onChange={_.partial(this.changeSetting, 'prevent-sleep-action')}
                                           type="radio" id="prevent_sleep_action_b" />
                                    <label htmlFor="prevent_sleep_action_b">{this.settingsText('Shut down')}</label>

                                </div>
                            </div>

                            : null */}

                        {this.showBlock({
                            textList: [
                                'Delete button action',
                                'Remove only from download list',
                                'Delete files',
                                'Always ask'
                            ]
                        }) ?
                        <div className="downloads_tab">
                            <div className="tab_title">{this.settingsText('Delete button action')}</div>
                            <div className="wrap_group">

                                <input name="deleteDialogChoice"
                                       checked={this.state.deleteDialogChoice == fdm.models.deleteDialogChoice.fromList}
                                       defaultChecked={this.state.deleteDialogChoice == fdm.models.deleteDialogChoice.fromList}
                                       value={fdm.models.deleteDialogChoice.fromList}
                                       onChange={this.changeDeleteDialogChoice}
                                       type="radio" id="4a" />
                                <label htmlFor="4a">{this.settingsText('Remove only from download list')}</label>

                                <input name="deleteDialogChoice"
                                       checked={this.state.deleteDialogChoice == fdm.models.deleteDialogChoice.fromDisk}
                                       defaultChecked={this.state.deleteDialogChoice == fdm.models.deleteDialogChoice.fromDisk}
                                       value={fdm.models.deleteDialogChoice.fromDisk}
                                       onChange={this.changeDeleteDialogChoice}
                                       type="radio" id="4b" />
                                <label htmlFor="4b">{this.settingsText('Delete files')}</label>

                                <input name="deleteDialogChoice"
                                       checked={this.state.deleteDialogChoice == fdm.models.deleteDialogChoice.notSave}
                                       defaultChecked={this.state.deleteDialogChoice == fdm.models.deleteDialogChoice.notSave}
                                       value={fdm.models.deleteDialogChoice.notSave}
                                       onChange={this.changeDeleteDialogChoice}
                                       type="radio" id="4c" />
                                <label htmlFor="4c">{this.settingsText('Always ask')}</label>

                            </div>
                        </div>
                            : null }

                        {this.showBlock({
                            textList: [
                                'Go back to default settings',
                                'Reset'
                            ]
                        }) ?
                            <div>
                                <div className="tab_title">{this.settingsText('Go back to default settings')}</div>
                                <div className="wrap_group">
                                    <button onClick={this.resetSettings} className="grey_btn">
                                        {this.settingsText('Reset')}
                                    </button>
                                </div>
                            </div>

                            : null }

                    </div>

                        : null }

                </div>
            </div>

        );
    }
});


var TUM = React.createClass({

    divClick: function(e){

        if (this.props.ci.name != this.props.name)
            this.props.tumClickFn('select', e);
    },

    selectClick: function(name, value, e){

        this.props.tumClickFn('select', e);
        this.props.setSettingFn(name, value, e);

    },

    render: function() {

        var ct = this.props.ct;
        var name = this.props.name;
        var namet = this.props.namet;

        var input_val = this.props.iv;
        var type_val = this.props.tv;
        var ci = this.props.ci;

        return (

            <div onMouseDown={this.divClick} className="wrapper_inselect">

                { ct.name == name ?

                    <div>

                        <span onMouseDown={_.partial(this.props.tumClickFn, 'input')}
                              style={{display: ct.stage == 'select' ? 'block' : 'none'}}>
                            {
                                (type_val == 0 ? __('Unlimited') :
                                    __('%1 KB/s', input_val))
                            }
                        </span>

                        <div style={{display: ct.stage == 'input' ? 'block' : 'none'}}
                             className={rjs_class({
                                wrap_input: true,
                                error: ci.name == name && ci.error
                             })}>

                            {ci.name == name && ci.error ?
                                <div className="block_error top">{ci.errorMessage}</div>
                                : null }

                            <input type="text"
                                   id={name}
                                   value={input_val}
                                   defaultValue={input_val}
                                   onChange={this.props.onChangeFn}
                                   onFocus={this.props.onFocusFn}
                                   onBlur={this.props.onBlurFn}
                                   onKeyDown={this.props.onKeyDownFn}/>
                            <div>{__('KB/s')}</div>
                        </div>

                        <div className="list">

                            {fdm.models.speedValues.map(function(limit, index){

                                return (
                                    <div key={index}
                                         onMouseDown={_.partial(this.selectClick, name, limit.value)}>

                                        {__(limit.text_tpl.tpl, limit.text_tpl.value)}
                                    </div>
                                );

                            }.bind(this))}

                            <div key="unlim"
                                 onMouseDown={_.partial(this.selectClick, namet, 0)}
                                 className="unlim">{__('Unlimited')}</div>
                        </div>

                    </div>

                    :

                    <span>
                        {
                            (type_val == 0 ? __('Unlimited') :
                                __('%1 KB/s', input_val))
                        }
                    </span>

                }

            </div>

        );

    }


});

