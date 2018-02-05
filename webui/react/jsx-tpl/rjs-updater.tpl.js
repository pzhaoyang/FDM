
var Updater= React.createClass({

    mixins: [ToolbarDragMixin],

    toolbarDragId: 'download-wiz-add-source',

    getInitialState: function () {

        var state = app.controllers.updater.model.toJSON();
        state.modalDialogOpened = app.controllers.downloadWizard.model.get('addSourcePageIsShown')
            || app.controllers.downloadWizard.model.get('sourceInfoPageIsShown');

        return state;
    },

    _onChange: function() {

        this.setState(app.controllers.updater.model.toJSON());
    },

    componentDidMount: function() {

        app.controllers.downloadWizard.model.on('change:addSourcePageIsShown', this.downloadWizardChangeState, this);
        app.controllers.downloadWizard.model.on('change:sourceInfoPageIsShown', this.downloadWizardChangeState, this);
        app.controllers.updater.model.on("change", this._onChange, this);
    },

    componentWillUnmount: function() {

        app.controllers.downloadWizard.model.off('change:addSourcePageIsShown', this.downloadWizardChangeState, this);
        app.controllers.downloadWizard.model.off('change:sourceInfoPageIsShown', this.downloadWizardChangeState, this);
        app.controllers.updater.model.off("change", this._onChange, this);
    },

    downloadWizardChangeState: function () {

        this.setState({
            modalDialogOpened: app.controllers.downloadWizard.model.get('addSourcePageIsShown')
            || app.controllers.downloadWizard.model.get('sourceInfoPageIsShown')
        });
    },

    showDialog: function(){
        app.controllers.updater.model.set("dialogShown", true);
    },

    closeDialog: function(e){
        stopEventBubble(e);
        app.controllers.updater.model.set("dialogShown", false);
    },

    resetClick: function(){

        app.controllers.updater.model.reset();
        app.controllers.updater.model.set("dialogShown", false);
    },

    downloadUpdates: function(){

        app.controllers.updater.model.downloadUpdates();
    },

    render: function () {

        if (fdmApp.appUpdateDisabled)
            return null;

        var m = app.controllers.updater.model;

        var waiting =
            (
                (
                    this.state.stage == fdm.models.UpdaterStages.check_updates
                    || this.state.stage == fdm.models.UpdaterStages.download_updates
                    || this.state.stage == fdm.models.UpdaterStages.post_download_check
                    || this.state.stage == fdm.models.UpdaterStages.pre_install_check
                    || this.state.stage == fdm.models.UpdaterStages.install_updates
                )
                && this.state.state == fdm.models.UpdaterStates.in_progress
            )
            ||
            (
                (
                    this.state.stage == fdm.models.UpdaterStages.download_updates
                    || this.state.stage == fdm.models.UpdaterStages.post_download_check
                    || this.state.stage == fdm.models.UpdaterStages.pre_install_check
                    || this.state.stage == fdm.models.UpdaterStages.install_updates
                )
                && this.state.state == fdm.models.UpdaterStates.ready
            )
            ||
            (
                (
                    this.state.stage == fdm.models.UpdaterStages.download_updates
                    || this.state.stage == fdm.models.UpdaterStages.pre_install_check
                )
                && this.state.state == fdm.models.UpdaterStates.finished
            );

        if (this.state.stage == fdm.models.UpdaterStages.check_updates
            && this.state.state == fdm.models.UpdaterStates.ready){
            return null;
        }


        if (!this.state.dialogShown || this.state.modalDialogOpened){

            if (this.state.stage == fdm.models.UpdaterStages.check_updates
                && !(this.state.state == fdm.models.UpdaterStates.finished && this.state.updatesAvailable))
                return null;

            var title = __('Update');
            if (this.state.stage == fdm.models.UpdaterStages.check_updates &&
                (this.state.state != fdm.models.UpdaterStates.finished
                    || !this.state.updatesAvailable))
                title = __('Check for updates');

            return (
                <div title={title}
                     onClick={this.showDialog} className="update_button">
                    <div className={'update_icon' + (waiting ? ' waiting' : '') }></div>
                </div>
            );
        }

        var error_class = this.state.state == fdm.models.UpdaterStates.failed
            && (this.state.stage != fdm.models.UpdaterStages.pre_install_check
                || this.state.getPreInstallCheckFailureReason != 1);

        var progress = 0;
        if (this.state.state == fdm.models.UpdaterStates.in_progress
            && this.state.stage == fdm.models.UpdaterStages.download_updates){

            if (this.state.progress.current > 0 && this.state.progress.max > 0){
                progress =  Math.round(this.state.progress.current/this.state.progress.max * 100);
            }
        }

        return (

            <div onClick={this.closeDialog} onMouseDown={this.closeDialog} className="update_button pushed" >
                <div className={'update_icon' + (waiting ? ' waiting' : '') }></div>

                <div id="download-wiz-add-source"
                     onMouseDown={this.toolbarDragStart} onDoubleClick={this.toolbarDoubleClick}
                     className="trnsprtnt_for_updates"></div>

                <div className="transparent_updates" style={{display: 'block'}}
                     onContextMenu={this.closeDialog} onClick={this.closeDialog}></div>

                <div onClick={stopEventBubble} onMouseDown={stopEventBubble} className={rjs_class({
                    wrapper_updates: true,
                    error: error_class
                })}>

                    { this.state.stage == fdm.models.UpdaterStages.check_updates
                        && !( (+ new Date() ) - this.state.preDownloadCheck <= 60000
                    || (+ new Date() ) - this.state.lastDownloadClick <= 10000 ) ?


                        <div>

                            { this.state.state == fdm.models.UpdaterStates.ready ?

                                <div>
                                    <div className="btn" onClick={_.bind(m.checkForUpdates, m)}>{__('Check for updates')}</div>
                                </div>

                                : null }
                            { this.state.state == fdm.models.UpdaterStates.in_progress ?

                                <div className="checking">
                                    <div>{__('Checking for updates...')}</div><br />
                                    <div>
                                        <div className="compact-progress-line"></div>
                                    </div>
                                </div>

                                : null }
                            { this.state.state == fdm.models.UpdaterStates.failed ?

                                <div>
                                    <div>
                                        <span>{__('Error:')}</span>
                                        <div className="errors_msg" title={this.state.getLastErrorDescription}>
                                            {this.state.getLastErrorDescription}
                                            </div>
                                    </div>
                                    <div className="btn" onClick={_.bind(m.checkForUpdates, m)}>{__('Retry')}</div>
                                </div>

                                : null }
                            { this.state.state == fdm.models.UpdaterStates.finished ?

                                <div>

                                    { this.state.updatesAvailable ?

                                        <div>
                                            <div>{__('New version is available')}</div>
                                            <div className="btn" onClick={this.downloadUpdates}>{__('Update')}</div>
                                        </div>

                                        :

                                        <div>
                                            <div>{__('FDM is up to date!')}</div>
                                            { (+ new Date()) - this.state.lastFinishedCheckForUpdates < 600000 ?
                                                <div className="btn" onClick={this.closeDialog}>{__('OK')}</div>
                                                :
                                                <div className="btn" onClick={_.bind(m.checkForUpdates, m)}>{__('Check for updates')}</div>
                                            }
                                        </div>

                                    }


                                </div>

                                : null }


                        </div>

                        : null }

                    { this.state.stage == fdm.models.UpdaterStages.check_updates
                        && ( (+ new Date() ) - this.state.preDownloadCheck <= 60000
                            || (+ new Date() ) - this.state.lastDownloadClick <= 10000 ) ?

                        <div className="downloading">
                            <span>{__('Downloading update')}</span><br />
                            <div>
                                <div className="info-time">
                                    <span className="percents">0%</span>
                                </div>
                                <div className="compact-progress-line">
                                    <div className="compact-download-progress" style={{width: '0%', display: 'block'}}></div>
                                </div>
                                <a href="#" onClick={this.resetClick} className="cancel_btn"></a>
                            </div>
                        </div>

                        : null }

                    { this.state.stage == fdm.models.UpdaterStages.download_updates ?


                        <div>

                            { this.state.state == fdm.models.UpdaterStates.ready ?

                                <div className="downloading">
                                    <span>{__('Downloading update')}</span><br />
                                    <div>
                                        <div className="info-time">
                                            <span className="percents">0%</span>
                                        </div>
                                        <div className="compact-progress-line">
                                            <div className="compact-download-progress" style={{width: '0%', display: 'block'}}></div>
                                        </div>
                                            <a href="#" onClick={this.resetClick} className="cancel_btn"></a>
                                    </div>
                                </div>

                                : null }

                            { this.state.state == fdm.models.UpdaterStates.in_progress ?


                                <div className="downloading">
                                    <div>{__('Downloading update')}</div>
                                    <div>
                                        <div className="info-time">
                                            <span className="percents">{progress + '%'}</span>
                                        </div>
                                        <div className="compact-progress-line">
                                            <div className="compact-download-progress"
                                                 style={{width: progress + '%'}}></div>
                                        </div>
                                            <a href="#" onClick={this.resetClick} className="cancel_btn"></a>
                                    </div>
                                </div>

                                : null }


                            { this.state.state == fdm.models.UpdaterStates.failed ?

                                <div>
                                    <div>
                                        <span>{__('Error downloading update:')}</span>
                                        <div className="errors_msg" title={this.state.getLastErrorDescription}>
                                            {this.state.getLastErrorDescription}
                                            </div>
                                    </div>
                                    <div className="btn left" onClick={_.bind(m.checkForUpdates, m)}>{__('Retry')}</div>
                                    <div className="btn right" onClick={this.resetClick}>{__('Cancel')}</div>
                                </div>

                                : null }
                            { this.state.state == fdm.models.UpdaterStates.finished ?

                                <div className="downloading">
                                    <div>{__('Downloading update')}</div>
                                    <div>
                                        <div className="info-time">
                                            <span className="percents">100%</span>
                                        </div>
                                        <div className="compact-progress-line">
                                            <div className="compact-download-progress"
                                                 style={{width: '100%', display: 'block'}}></div>
                                        </div>
                                            <a href="#" onClick={this.resetClick} className="cancel_btn"></a>
                                    </div>
                                </div>

                                : null }

                        </div>

                        : null }

                    { this.state.stage == fdm.models.UpdaterStages.post_download_check ?

                        <div>

                            { this.state.state == fdm.models.UpdaterStates.ready
                            || this.state.state == fdm.models.UpdaterStates.in_progress
                            || (+ new Date() ) - this.state.lastDownloadClick < 5 * 60000
                                && this.state.state != fdm.models.UpdaterStates.failed ?

                                <div className="checking">
                                    <div>{__('Checking...')}</div><br />
                                    <div>
                                        <div className="compact-progress-line"></div>
                                    </div>
                                </div>

                                : null }

                            { this.state.state == fdm.models.UpdaterStates.failed ?

                                <div>
                                    <div>
                                        <span>{__('Error:')}</span>
                                        <div className="errors_msg" title={this.state.getLastErrorDescription}>
                                            {this.state.getLastErrorDescription}
                                            </div>
                                    </div>
                                    <div className="btn left" onClick={_.bind(m.checkForUpdates, m)}>{__('Retry')}</div>
                                    <div className="btn right" onClick={this.resetClick}>{__('Cancel')}</div>
                                </div>

                                : null }
                            { this.state.state == fdm.models.UpdaterStates.finished
                            && (+ new Date() ) - this.state.lastDownloadClick >= 5 * 60000 ?

                                <div>
                                    <div>{__('Update downloaded')}</div>
                                    <div className="btn" onClick={_.bind(m.installUpdates, m)}>{__('Install update')}</div>
                                </div>

                                : null }

                        </div>


                        : null }

                    { this.state.stage == fdm.models.UpdaterStages.pre_install_check ?


                        <div>

                            { this.state.state == fdm.models.UpdaterStates.ready
                                || this.state.state == fdm.models.UpdaterStates.in_progress
                                || this.state.state == fdm.models.UpdaterStates.finished?

                                <div className="checking">
                                    <div>{__('Installing updates')}</div><br />
                                    <div>
                                        <div className="compact-progress-line"></div>
                                    </div>
                                </div>

                                : null }

                            { this.state.state == fdm.models.UpdaterStates.failed
                                && this.state.getPreInstallCheckFailureReason == 1? //enum class failure_reason {unspecified, module_running}

                                <div>
                                    <div>{__('Relaunch FDM to update')}</div>
                                    <div className="btn" onClick={_.bind(m.shutdownUpdateTargetModule, m)}>{__('Relaunch')}</div>
                                </div>

                                : null }

                            { this.state.state == fdm.models.UpdaterStates.failed
                            && this.state.getPreInstallCheckFailureReason != 1 ?

                                <div>
                                    <div>
                                        <span>{__('Error occurred during installation:')}</span>
                                        <div className="errors_msg" title={this.state.getLastErrorDescription}>
                                            {this.state.getLastErrorDescription}
                                            </div>
                                    </div>
                                    <div className="btn left" onClick={_.bind(m.checkForUpdates, m)}>{__('Retry')}</div>
                                    <div className="btn right" onClick={this.resetClick}>{__('Cancel')}</div>
                                </div>

                                : null }

                        </div>


                        : null }

                    { this.state.stage == fdm.models.UpdaterStages.install_updates ?


                        <div>

                            { this.state.state == fdm.models.UpdaterStates.ready
                                || this.state.state == fdm.models.UpdaterStates.in_progress?

                                <div className="checking">
                                    <div>{__('Installing updates')}</div><br />
                                    <div>
                                        <div className="compact-progress-line"></div>
                                    </div>
                                </div>

                                : null }

                            { this.state.state == fdm.models.UpdaterStates.failed ?

                                <div>
                                    <div>
                                        <span>{__('Error occurred during installation:')}</span>
                                        <div className="errors_msg" title={this.state.getLastErrorDescription}>{this.state.getLastErrorDescription}</div>
                                    </div>
                                    <div className="btn left" onClick={_.bind(m.checkForUpdates, m)}>{__('Retry')}</div>
                                    <div className="btn right" onClick={this.resetClick}>{__('Cancel')}</div>
                                </div>

                                : null }

                            { this.state.state == fdm.models.UpdaterStates.finished
                                && (this.state.getRestartRequired == fdm.models.UpdaterRestartType.module)?

                                <div>
                                    <div>{__('Relaunch FDM to update')}</div>
                                    <div className="btn" onClick={_.bind(m.performRestart, m)}>{__('Relaunch')}</div>
                                </div>

                                : null }

                            { this.state.state == fdm.models.UpdaterStates.finished && false // not used
                                && (this.state.getRestartRequired == fdm.models.UpdaterRestartType.os)?


                                <div>
                                    <div>{__('Restart computer to complete installation')}</div>
                                    <div className="btn" onClick={_.bind(m.performRestart, m)}>{__('Restart')}</div>
                                </div>

                                : null }

                            { this.state.state == fdm.models.UpdaterStates.finished
                                && (this.state.getRestartRequired == fdm.models.UpdaterRestartType.none)?

                                <div>
                                    <div>{__('FDM is up to date')}</div>
                                    <div className="btn" onClick={_.bind(m.checkForUpdates, m)}>{__('Check for updates')}</div>
                                </div>

                                : null }

                        </div>

                        : null }

                </div>
            </div>

        );

    }
});