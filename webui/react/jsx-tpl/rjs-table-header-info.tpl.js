

var TableHeaderInfo = React.createClass({

    getInitialState: function() {

        return {
            allSelected: app.controllers.downloads.model.get('allSelected'),
            sortOptions: app.controllers.downloads.model.get('sortOptions'),
            statusFilter: app.controllers.downloads.model.get('statusFilter')
        };
    },

    componentDidMount: function(){

        app.controllers.downloads.model.on('change:allSelected change:sortOptions change:statusFilter', this.changeState, this);
    },

    componentWillUnmount:function(){

        app.controllers.downloads.model.off('change:allSelected change:sortOptions change:statusFilter', this.changeState, this);
    },

    changeState: function(){
        this.setState({
            allSelected: app.controllers.downloads.model.get('allSelected'),
            sortOptions: app.controllers.downloads.model.get('sortOptions'),
            statusFilter: app.controllers.downloads.model.get('statusFilter')
        });
    },

    lastToggleSelectAll: 0,

    toggleSelectAll: function(e){

        var current_date = +new Date();
        if (current_date - this.lastToggleSelectAll < 250)
            return;
        this.lastToggleSelectAll = current_date;
        app.controllers.downloads.toggleSelectAll();
    },

    sort: function(sort_column){

        app.controllers.downloads.sort(sort_column);
    },

    render: function() {

        var sortOptions = this.state.sortOptions;
        var allSelected = this.state.allSelected;

        return (
            <div id="compact-view-info" className="compact-view-info">
                <ul >
                    <li className="compact-view-checkbox-wrap" data-prop="state" data-direction="asc">
                        <input className={rjs_class({
                            indeterminate: allSelected === undefined
                        })}
                            type="checkbox" id="compact-header-checkbox"
                            checked={allSelected === true} />
                        <label htmlFor="compact-header-checkbox" title={__('Select All')} onClick={this.toggleSelectAll}></label>
                        <b className="resizer"></b>
                    </li>
                    <li onClick={_.partial(this.sort, 'fileName')}
                        className={rjs_class({
                    'compact-view-name': true,
                    'sort-up': sortOptions.sortProp == 'fileName' && sortOptions.descending,
                    'sort-down': sortOptions.sortProp == 'fileName' && !sortOptions.descending
                    })}>
                        <span className="rubber-ellipsis">{__('Name')}</span>
                        <b className="resizer"></b>
                    </li>
                    <li onClick={_.partial(this.sort, 'progress')}
                        className={rjs_class({
                    'compact-view-progress': true,
                    'sort-up': sortOptions.sortProp == 'progress' && sortOptions.descending,
                    'sort-down': sortOptions.sortProp == 'progress' && !sortOptions.descending
                    })}>
                        <span className="rubber-ellipsis">{__('Status')}</span>
                        <b className="resizer"></b>
                    </li>
                    <li onClick={_.partial(this.sort, 'downloadSpeedBytes')}
                        className={rjs_class({
                    'compact-view-speed': true,
                    'sort-up': sortOptions.sortProp == 'downloadSpeedBytes' && sortOptions.descending,
                    'sort-down': sortOptions.sortProp == 'downloadSpeedBytes' && !sortOptions.descending
                    })}>
                        <span className="rubber-ellipsis">{__('Speed')}</span>
                        <b className="resizer"></b>
                    </li>
                    <li onClick={_.partial(this.sort, 'totalBytes')}
                        className={rjs_class({
                    'compact-view-size': true,
                    'sort-up': sortOptions.sortProp == 'totalBytes' && sortOptions.descending,
                    'sort-down': sortOptions.sortProp == 'totalBytes' && !sortOptions.descending
                    })}>
                        <span className="rubber-ellipsis">{__('Size')}</span>
                        <b className="resizer"></b>
                    </li>
                    <li onClick={_.partial(this.sort, 'createdDate')}
                        style={{overflow: 'hidden'}}
                        className={rjs_class({
                    'compact-view-date': true,
                    'sort-up': sortOptions.sortProp == 'createdDate' && sortOptions.descending,
                    'sort-down': sortOptions.sortProp == 'createdDate' && !sortOptions.descending
                    })}>
                        <span className="rubber-ellipsis">{ this.state.statusFilter == fdm.models.DownloadStateFilters.Completed ? __('Completed') : __('Added')}</span>
                    </li>
                </ul>
            </div>
        );
    }
});