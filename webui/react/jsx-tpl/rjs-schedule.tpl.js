

var Schedule = React.createClass({

    dispatcherIndexKeyDown: false,

    schedulerSelectIntervals: [
        0,
        (60 * 60 * 1000),
        (2 * 60 * 60 * 1000),
        (3 * 60 * 60 * 1000),
        (4 * 60 * 60 * 1000),
        (5 * 60 * 60 * 1000),
        (6 * 60 * 60 * 1000),
        (7 * 60 * 60 * 1000),
        (8 * 60 * 60 * 1000),
        (9 * 60 * 60 * 1000),
        (10 * 60 * 60 * 1000),
        (11 * 60 * 60 * 1000),
        (12 * 60 * 60 * 1000),
        (13 * 60 * 60 * 1000),
        (14 * 60 * 60 * 1000),
        (15 * 60 * 60 * 1000),
        (16 * 60 * 60 * 1000),
        (17 * 60 * 60 * 1000),
        (18 * 60 * 60 * 1000),
        (19 * 60 * 60 * 1000),
        (20 * 60 * 60 * 1000),
        (21 * 60 * 60 * 1000),
        (22 * 60 * 60 * 1000),
        (23 * 60 * 60 * 1000),
        (23 * 60 * 60 * 1000 + 59 * 60 * 1000)
    ],

    selectStates: {
        closed: 0,
        select: 1,
        input: 2
    },

    getInitialState: function () {

        var state = this.props.timetable.toJSON();
        state.timeStartState = this.selectStates.closed;
        state.timeEndState = this.selectStates.closed;
        state.enableScheduler = true;

        return state;
    },

    componentDidMount: function() {

        this.dispatcherIndexKeyDown = FdmDispatcher.register(function(payload) {

            if (payload.source == 'VIEW_ACTION'){
                if (payload.action.actionType == 'GlobalKeyDown')
                    return this.globalKeyDown(payload.action.content);
            }

            return true; // No errors. Needed by promise in Dispatcher.
        }.bind(this));

        this.props.timetable.on('change', this._onChange, this);

    },

    componentWillUnmount: function() {

        FdmDispatcher.unregister(this.dispatcherIndexKeyDown);

        this.props.timetable.off('change', this._onChange, this);

        app.states.ScheduleSelectOpened = false;
    },

    _onChange: function() {

        this.setState(this.props.timetable.toJSON());
    },

    closeSelect: function(name){

        app.states.ScheduleSelectOpened = false;

        if (name == 'start'){
            this.setState({
                timeStartState: this.selectStates.closed
            });
        }
        else{
            this.setState({
                timeEndState: this.selectStates.closed
            });
        }
    },

    closeSelectClick: function(name){

        if (name == 'start'){

            if (this.state.timeStartState == this.selectStates.input)
                this.commitInputValues(name);
        }
        else{

            if (this.state.timeEndState == this.selectStates.input)
                this.commitInputValues(name);
        }

        this.closeSelect(name);
    },

    toggleSelect: function(name){

        if (name == 'start'){

            if (this.state.timeEndState != this.selectStates.closed)
                this.closeSelectClick('end');

            if (this.state.timeStartState == this.selectStates.select){
                this.setState({
                    timeStartState: this.selectStates.input,
                    timeStartInputH: this.msecToTime(this.state.data.startTime, 'h'),
                    timeStartInputM: this.msecToTime(this.state.data.startTime, 'm')
                });

                app.states.ScheduleSelectOpened = true;
            }
            else{
                this.setState({
                    timeStartState: this.selectStates.select
                });

                app.states.ScheduleSelectOpened = true;
            }
        }
        else{

            if (this.state.timeStartState != this.selectStates.closed)
                this.closeSelectClick('start');

            if (this.state.timeEndState == this.selectStates.select){
                this.setState({
                    timeEndState: this.selectStates.input,
                    timeEndInputH: this.msecToTime(this.state.data.endTime, 'h'),
                    timeEndInputM: this.msecToTime(this.state.data.endTime, 'm')
                });

                app.states.ScheduleSelectOpened = true;
            }
            else{
                this.setState({
                    timeEndState: this.selectStates.select
                });

                app.states.ScheduleSelectOpened = true;
            }
        }
    },

    toggleDay: function(day, e){

        this.state.data.daysEnabled[day] = e.target.checked;
        this.props.timetable.trigger('change');
    },

    setTime: function(name, time, e){

        stopEventBubble(e);

        if (name == 'start')
            this.state.data.startTime = time;
        else
            this.state.data.endTime = time;
        this.closeSelect(name);
        this.props.timetable.trigger('change');
    },

    setInputTime: function(name, type, e){

        var val = parseInt(e.target.value);

        if (type == 'h' && val > 23)
            val = 23;
        if (type == 'm' && val > 59)
            val = 59;

        if (name == 'start'){

            if (type == 'h'){

                this.setState({
                    timeStartInputH: val
                });
            }
            else {
                this.setState({
                    timeStartInputM: val
                });
            }
        }
        else {

            if (type == 'h'){

                this.setState({
                    timeEndInputH: val
                });
            }
            else {
                this.setState({
                    timeEndInputM: val
                });
            }
        }
    },

    msecToTime: function(msec, format){

        var min = msec/60000;

        var h = Math.floor(min/60);
        var m = min%60;

        if (format == 'h')
            return h;
        if (format == 'm')
            return m;

        return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    },

    commitInputValues: function(name){

        var c = 60000;

        if (!this.state.timeStartInputH)
            this.state.timeStartInputH = 0;
        if (!this.state.timeStartInputM)
            this.state.timeStartInputM = 0;
        if (!this.state.timeEndInputH)
            this.state.timeEndInputH = 0;
        if (!this.state.timeEndInputM)
            this.state.timeEndInputM = 0;

        if (name == 'start')
            this.state.data.startTime = parseInt(this.state.timeStartInputH) * 60 * c + parseInt(this.state.timeStartInputM) * c;
        else
            this.state.data.endTime = parseInt(this.state.timeEndInputH) * 60 * c + parseInt(this.state.timeEndInputM) * c;

        this.props.timetable.trigger('change');
    },

    changeEnableScheduler: function(e){

        this.setState({
            enableScheduler: e.target.checked
        });
    },

    inputKeyDown: function(name, e){

        if (e.keyCode === 27)
            this.closeSelect(name);
        if (e.keyCode === 13)
            this.closeSelectClick(name);
    },

    dropdownButtonMouseDown: function (name, e) {

        if (name == 'start' && this.state.timeStartState == this.selectStates.closed ||
            name == 'end' && this.state.timeEndState == this.selectStates.closed)
            return;

        stopEventBubble(e);
        this.closeSelectClick(name);
    },

    globalKeyDown: function (e) {

        if (e.keyCode === 27){

            if (this.state.timeStartState != this.selectStates.closed)
                this.closeSelect('start');
            if (this.state.timeEndState != this.selectStates.closed)
                this.closeSelect('end');
        }
    },

    render: function() {

        var days = this.state.data.daysEnabled;
        var startTime = this.state.data.startTime;
        var endTime = this.state.data.endTime;

        return (

            <div>

                <div className="wrapper_days">

                    {!this.props.type || this.props.type != 'wizard' ?
                        <div>
                            <input
                                defaultChecked={this.props.enableScheduler}
                                checked={this.props.enableScheduler}
                                onChange={this.props.changeEnableScheduler}
                                type="checkbox" id="enable-scheduler"/>
                            <label htmlFor="enable-scheduler">
                                {__('Enable Scheduler')}
                            </label>
                        </div>
                        : null }

                    <input defaultChecked={days[7]} checked={days[7]}
                           onChange={_.partial(this.toggleDay, 7)}
                           disabled={!this.props.enableScheduler}
                           type="checkbox" id="day7"/>
                    <label htmlFor="day7">{__('Sun')}</label>

                    <input defaultChecked={days[1]} checked={days[1]}
                           onChange={_.partial(this.toggleDay, 1)}
                           disabled={!this.props.enableScheduler}
                           type="checkbox" id="day1"/>
                    <label htmlFor="day1">{__('Mon')}</label>

                    <input defaultChecked={days[2]} checked={days[2]}
                           onChange={_.partial(this.toggleDay, 2)}
                           disabled={!this.props.enableScheduler}
                           type="checkbox" id="day2"/>
                    <label htmlFor="day2">{__('Tue')}</label>

                    <input defaultChecked={days[3]} checked={days[3]}
                           onChange={_.partial(this.toggleDay, 3)}
                           disabled={!this.props.enableScheduler}
                           type="checkbox" id="day3"/>
                    <label htmlFor="day3">{__('Wed')}</label>

                    <input defaultChecked={days[4]} checked={days[4]}
                           onChange={_.partial(this.toggleDay, 4)}
                           disabled={!this.props.enableScheduler}
                           type="checkbox" id="day4"/>
                    <label htmlFor="day4">{__('Thu')}</label>

                    <input defaultChecked={days[5]} checked={days[5]}
                           onChange={_.partial(this.toggleDay, 5)}
                           disabled={!this.props.enableScheduler}
                           type="checkbox" id="day5"/>
                    <label htmlFor="day5">{__('Fri')}</label>

                    <input defaultChecked={days[6]} checked={days[6]}
                           onChange={_.partial(this.toggleDay, 6)}
                           disabled={!this.props.enableScheduler}
                           type="checkbox" id="day6"/>
                    <label htmlFor="day6">{__('Sat')}</label>

                </div>
                <div className={rjs_class({
                                    wrapper_times: true,
                                    disabled: !this.props.enableScheduler
                                })}>
                    <span>{__('From:')}</span>
                    <div className="choose">
                        <div className="transparent_select"
                             onClick={_.partial(this.closeSelectClick, 'start')}
                             style={{display: this.state.timeStartState != this.selectStates.closed ? 'block' : 'none'}}></div>
                        <div className={rjs_class({
                                    wrapper_inselect: true,
                                    top_position: this.props.top_position
                                })}
                             onClick={_.partial(this.toggleSelect, 'start')}>

                            {this.state.timeStartState == this.selectStates.input ?
                                <span onClick={stopEventBubble} className="wrap_numbers">
                                                    <input defaultValue={this.state.timeStartInputH}
                                                           value={this.state.timeStartInputH}
                                                           onChange={_.partial(this.setInputTime, 'start', 'h')}
                                                           onKeyDown={_.partial(this.inputKeyDown, 'start')}
                                                           type="number" max="23" min="0"/> :
                                                    <input defaultValue={this.state.timeStartInputM}
                                                           value={this.state.timeStartInputM}
                                                           onChange={_.partial(this.setInputTime, 'start', 'm')}
                                                           onKeyDown={_.partial(this.inputKeyDown, 'start')}
                                                           type="number" max="59" min="0"/>
                                                </span>
                                :
                                <span>{this.msecToTime(startTime)}</span>
                            }

                            <div className="dropdown_button" onClick={_.partial(this.dropdownButtonMouseDown, 'start')}></div>

                            <div className="list" style={{display: this.state.timeStartState != this.selectStates.closed ? 'block' : 'none'}}>

                                {_.map(this.schedulerSelectIntervals, function(val, i){

                                    return (
                                        <div key={i} onClick={_.partial(this.setTime, 'start', val)}><span>{this.msecToTime(val)}</span></div>
                                    );

                                }.bind(this))}
                            </div>
                        </div>
                    </div>
                    <span>{__('To:')}</span>
                    <div className="choose">
                        <div className="transparent_select"
                             onClick={_.partial(this.closeSelectClick, 'end')}
                             style={{display: this.state.timeEndState != this.selectStates.closed ? 'block' : 'none'}}></div>
                        <div className={rjs_class({
                                    wrapper_inselect: true,
                                    top_position: this.props.top_position
                                })}
                             onClick={_.partial(this.toggleSelect, 'end')}>

                            {this.state.timeEndState == this.selectStates.input ?
                                <span onClick={stopEventBubble} className="wrap_numbers">
                                                    <input defaultValue={this.state.timeEndInputH}
                                                           value={this.state.timeEndInputH}
                                                           onChange={_.partial(this.setInputTime, 'end', 'h')}
                                                           onKeyDown={_.partial(this.inputKeyDown, 'end')}
                                                           type="number" max="23" min="0" /> :
                                                    <input defaultValue={this.state.timeEndInputM}
                                                           value={this.state.timeEndInputM}
                                                           onChange={_.partial(this.setInputTime, 'end', 'm')}
                                                           onKeyDown={_.partial(this.inputKeyDown, 'end')}
                                                           type="number" max="59" min="0"/>
                                                </span>
                                :
                                <span onClick={_.partial(this.closeSelectClick, 'end')}>{this.msecToTime(endTime)}</span>
                            }

                            <div className="dropdown_button" onClick={_.partial(this.dropdownButtonMouseDown, 'end')}></div>

                            <div className="list" style={{display: this.state.timeEndState != this.selectStates.closed ? 'block' : 'none'}}>

                                {_.map(this.schedulerSelectIntervals, function(val, i){

                                    return (
                                        <div key={i} onClick={_.partial(this.setTime, 'end', val)}><span>{this.msecToTime(val)}</span></div>
                                    );

                                }.bind(this))}
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        );
    }
});


var ScheduleDialog = React.createClass({

    mixins: [ButtonMixin, ToolbarDragMixin],

    toolbarDragId: 'download-popup-overlay2',

    dispatcherIndexKeyDown: false,

    schedulerSelectIntervals: [
        0,
        (60 * 60 * 1000),
        (2 * 60 * 60 * 1000),
        (3 * 60 * 60 * 1000),
        (4 * 60 * 60 * 1000),
        (5 * 60 * 60 * 1000),
        (6 * 60 * 60 * 1000),
        (7 * 60 * 60 * 1000),
        (8 * 60 * 60 * 1000),
        (9 * 60 * 60 * 1000),
        (10 * 60 * 60 * 1000),
        (11 * 60 * 60 * 1000),
        (12 * 60 * 60 * 1000),
        (13 * 60 * 60 * 1000),
        (14 * 60 * 60 * 1000),
        (15 * 60 * 60 * 1000),
        (16 * 60 * 60 * 1000),
        (17 * 60 * 60 * 1000),
        (18 * 60 * 60 * 1000),
        (19 * 60 * 60 * 1000),
        (20 * 60 * 60 * 1000),
        (21 * 60 * 60 * 1000),
        (22 * 60 * 60 * 1000),
        (23 * 60 * 60 * 1000),
        (23 * 60 * 60 * 1000 + 59 * 60 * 1000)
    ],

    selectStates: {
        closed: 0,
        select: 1,
        input: 2
    },

    getInitialState: function () {

        var state = app.controllers.scheduleDialog.model.toJSON();
        state.timeStartState = this.selectStates.closed;
        state.timeEndState = this.selectStates.closed;
        state.enableScheduler = true;

        return state;
    },

    componentDidMount: function() {

        app.controllers.scheduleDialog.model.on('change', this._onChange, this);
        app.controllers.scheduleDialog.model.get('timetable').on('change', this._onChange, this);

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

        app.controllers.scheduleDialog.model.off('change', this._onChange, this);
        app.controllers.scheduleDialog.model.get('timetable').off('change', this._onChange, this);

        FdmDispatcher.unregister(this.dispatcherIndexKeyDown);
    },

    _onChange: function() {

        var json = app.controllers.scheduleDialog.model.toJSON();

        if (json.dialogOpened != this.state.dialogOpened){

            json.timeStartState = this.selectStates.closed;
            json.timeEndState = this.selectStates.closed;
            json.enableScheduler = true;
        }

        this.setState(json);
    },

    globalKeyDown: function(content){

        if (content.keyCode === 27){

            if (app.states.ScheduleSelectOpened)
                return;

            this.close();
        }

    },

    close: function(){

        app.controllers.scheduleDialog.close();
    },

    cancel: function(){

        app.controllers.scheduleDialog.close();
    },

    apply: function(){

        var days = this.state.timetable.get('data').daysEnabled;

        if (this.state.enableScheduler && (days[1] + days[2] + days[3] + days[4] + days[5] + days[6] + days[7]) > 0)
            app.controllers.scheduleDialog.apply();
        else
            app.controllers.scheduleDialog.cancel();
    },

    closeSelect: function(name){

        if (name == 'start'){
            this.setState({
                timeStartState: this.selectStates.closed
            });
        }
        else{
            this.setState({
                timeEndState: this.selectStates.closed
            });
        }
    },

    closeSelectClick: function(name){

        if (name == 'start'){

            if (this.state.timeStartState == this.selectStates.input)
                this.commitInputValues(name);
        }
        else{

            if (this.state.timeEndState == this.selectStates.input)
                this.commitInputValues(name);
        }

        this.closeSelect(name);
    },

    timeInputValue: function(){

    },

    toggleSelect: function(name){

        if (name == 'start'){

            if (this.state.timeEndState != this.selectStates.closed)
                this.closeSelectClick('end');

            if (this.state.timeStartState == this.selectStates.select){
                this.setState({
                    timeStartState: this.selectStates.input,
                    timeStartInputH: this.msecToTime(this.state.timetable.data.startTime, 'h'),
                    timeStartInputM: this.msecToTime(this.state.timetable.data.startTime, 'm')
                });
            }
            else{
                this.setState({
                    timeStartState: this.selectStates.select
                });
            }
        }
        else{

            if (this.state.timeStartState != this.selectStates.closed)
                this.closeSelectClick('start');

            if (this.state.timeEndState == this.selectStates.select){
                this.setState({
                    timeEndState: this.selectStates.input,
                    timeEndInputH: this.msecToTime(this.state.timetable.data.endTime, 'h'),
                    timeEndInputM: this.msecToTime(this.state.timetable.data.endTime, 'm')
                });
            }
            else{
                this.setState({
                    timeEndState: this.selectStates.select
                });
            }
        }
    },

    toggleDay: function(day, e){

        this.state.timetable.data.daysEnabled[day] = e.target.checked;
        this._onChange();
    },

    setTime: function(name, time, e){

        stopEventBubble(e);

        if (name == 'start')
            this.state.timetable.data.startTime = time;
        else
            this.state.timetable.data.endTime = time;
        this.closeSelect(name);
        this._onChange();
    },

    setInputTime: function(name, type, e){

        var val = parseInt(e.target.value);

        if (type == 'h' && val > 23)
            val = 23;
        if (type == 'm' && val > 59)
            val = 59;

        if (name == 'start'){

            if (type == 'h'){

                this.setState({
                    timeStartInputH: val
                });
            }
            else {
                this.setState({
                    timeStartInputM: val
                });
            }
        }
        else {

            if (type == 'h'){

                this.setState({
                    timeEndInputH: val
                });
            }
            else {
                this.setState({
                    timeEndInputM: val
                });
            }
        }
    },

    msecToTime: function(msec, format){

        var min = msec/60000;

        var h = Math.floor(min/60);
        var m = min%60;

        if (format == 'h')
            return h;
        if (format == 'm')
            return m;

        return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    },

    commitInputValues: function(name){

        var c = 60000;

        if (!this.state.timeStartInputH)
            this.state.timeStartInputH = 0;
        if (!this.state.timeStartInputM)
            this.state.timeStartInputM = 0;
        if (!this.state.timeEndInputH)
            this.state.timeEndInputH = 0;
        if (!this.state.timeEndInputM)
            this.state.timeEndInputM = 0;

        if (name == 'start')
            this.state.timetable.data.startTime = parseInt(this.state.timeStartInputH) * 60 * c + parseInt(this.state.timeStartInputM) * c;
        else
            this.state.timetable.data.endTime = parseInt(this.state.timeEndInputH) * 60 * c + parseInt(this.state.timeEndInputM) * c;

        this._onChange();
    },

    changeEnableScheduler: function(e){

        this.setState({
            enableScheduler: e.target.checked
        });
    },

    inputKeyDown: function(name, e){

        if (e.keyCode === 27)
            this.closeSelect(name);
        if (e.keyCode === 13)
            this.closeSelectClick(name);
    },

    render: function() {

        if (!this.state.dialogOpened)
            return null;

        var days = this.state.timetable.get('data').daysEnabled;

        var show_message = this.state.enableScheduler && (days[1] + days[2] + days[3] + days[4] + days[5] + days[6] + days[7]) == 0;

        return (

            <div id="download-popup-overlay2"
                 onMouseDown={this.toolbarDragStart} onDoubleClick={this.toolbarDoubleClick}
                 className="temporary-style popup__overlay_adddownload">
                <div className="mount"></div>
                <div className="popup_window scheduler">
                    <div>

                        <div className="header">
                            <div>{__('Sсheduler')}</div>
                            <div className="close_button" onClick={this.close}></div>
                        </div>

                        <div className="center center_add_ul">
                            <div className="note">{__('Start and pause downloads at specified time')}</div>

                            <Schedule timetable={this.state.timetable}
                                      enableScheduler={this.state.enableScheduler}
                                      changeEnableScheduler={this.changeEnableScheduler} />

                        </div>

                        <div className="bottom_add_ul bottom">

                            {show_message ?
                                <span className="error-message" style={{color: "#585759", fontSize: '13px'}}>
                                    <span>{__('Set days of the week to enable Scheduler')}</span>
                                </span>
                                : null }

                            <div className="group_button">
                                <button onClick={this.cancel}
                                        className="left_button cancel linkblock"
                                        onMouseDown={this.buttonMouseDown}>{__('Cancel')}</button>
                                <button onClick={this.apply}
                                        className="right_button linkblock" title=""
                                        onMouseDown={this.buttonMouseDown}>{__('Apply')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
});