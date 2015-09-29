
var ExamplesList = React.createClass({

    openProject: function ( slug ) {
        RouteState.merge(
            {
                project:slug
            }
        );
    },

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"list",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		}
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    componentDidUpdate: function () {
        $(".nano").nanoScroller();
    },

    renderRows: function( list , rows ) {

        var tagTitle = PhiModel.tag_titles[list.title];

        if ( !tagTitle )
            tagTitle = list.title.capitalizeEachWord();

        rows.push(
            <div className="examplesList_header">{
                tagTitle
            }</div>
        );

        var image;
        for ( var i=0; i<list.projects.length; i++ ) {
            item = list.projects[i];

            image = "";
            if ( item.image )
                image = <img className="examplesList_rowImage"
                                src={ item.image } />

            rows.push(
                <div className="examplesList_row"
                    onClick={ this.openProject.bind( this , item.slug ) }>
                    <div className="examplesList_rowText">
                        <div className="examplesList_rowTitle">
                            { item.title }
                        </div>
                        <div className="examplesList_rowSubTitle">
                            { item.medium }
                        </div>
                    </div>
                    { image }
                </div>
            );
        }

        rows.push( <div className="examplesList_spacer"></div> );
        return rows;
    },

    render: function() {

        var rows = [];

        var project_list;
        for ( var i=0; i<PhiModel.project_list.length; i++ ) {
            project_list = PhiModel.project_list[i];
            this.renderRows( project_list, rows );
        }

        return  <div className="nano examplesList">
                    <div className="nano-content">
                        { rows }
                    </div>
                </div>;
    }

});
