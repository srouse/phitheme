
var ListPage = React.createClass({

    openProject: function ( slug ) {
        RouteState.merge(
            {
                'project':slug
            }
        );
    },

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"list",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "examples_list"
    	);

        RouteState.addDiffListener(
    		"thumbs",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "examples_list"
    	);

        Ps.initialize( $(".listPage")[0] , {
            suppressScrollX: true
        });
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "examples_list" );
        Ps.destroy( $(".listPage")[0] );
    },

    componentDidUpdate: function () {
        Ps.update( $(".listPage")[0] );
    },

    toggleThumbs: function () {
        RouteState.toggle({
            'thumbs':"thumbs"
        },{
            'thumbs':false
        });
    },

    closeList: function () {
        RouteState.merge({
            list:false
        });
    },

    renderRows: function( list , rows ) {

        var tagTitle = PhiModel.tag_titles[list.title];

        if ( !tagTitle )
            tagTitle = list.title.capitalizeEachWord();

        rows.push(
            <div className="o-pageHeader" key={ "listPage_header" }>
                <div className="o-pageHeader__title">
                    { tagTitle }
                </div>
                <div className="o-pageHeader__nav">
                    {/*<div className="o-pageHeader__thumbsBtn"
                        onClick={ this.toggleThumbs }>
                    </div>*/}
                    <div className="o-pageHeader__closeBtn"
                        onClick={ this.closeList }>
                    </div>
                </div>
            </div>
        );

        var image,row_items=[];
        for ( var i=0; i<list.projects.length; i++ ) {
            item = list.projects[i];

            image = "";
            if ( item.image )
                image = <div className="listPage__rowImage">
                    <div className="listPage__rowImageChild"
                        style={{
                            backgroundImage:
                                "url('" + item.image + "')"
                        }}></div>
                </div>

            row_items.push(
                <div className="listPage__row"
                    onClick={ this.openProject.bind( this , item.slug ) }
                    key={ "listPage__row_" + item.slug }>
                    { image }
                    <div className="listPage__rowText">
                        <div className="listPage__rowTitle">
                            { item.title }
                        </div>
                        <div className="listPage__rowSubTitle">
                            { item.medium }
                        </div>
                        <div className="listPage__rowDescription">
                            { item.summary }
                            { ( item.description ) ?
                                <span className="listPage__more">more...</span>
                                : ""
                            }
                        </div>
                    </div>

                </div>
            );
        }


        var left_to_complete__row = 4 - ( list.projects.length % 4 );
        for ( var i=0; i<left_to_complete__row; i++ ) {
            row_items.push(
                <div className="listPage__row listPage__row--empty"
                    key={ "listPage__row_spacer_" + i }>
                </div>
            );
        }

        row_items.push(
            <div className="listPage__spacer"
                key="listPage__spacer">
            </div>
        );

        rows.push(
            <div className="listPage__rowItemsContainer">
                { row_items }
            </div>
        );


        return rows;
    },

    render: function() {

        var rows = [];

        var project_list;
        for ( var i=0; i<PhiModel.project_list.length; i++ ) {
            project_list = PhiModel.project_list[i];
            this.renderRows( project_list, rows );
        }

        return  <div className="listPage">
                    <div className="listPage__rowContainer">
                        { rows }
                    </div>
                </div>;
    }

});
