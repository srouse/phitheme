
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

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "examples_list" );
    },

    componentDidUpdate: function () {
        $(".nano").nanoScroller();

        // compensate for animation...
        setTimeout( function () {
            $(".nano").nanoScroller();
        },400);
    },

    toggleThumbs: function () {
        RouteState.toggle({
            thumbs:"thumbs"
        },{
            thumbs:""
        });
    },

    renderRows: function( list , rows ) {

        var tagTitle = PhiModel.tag_titles[list.title];

        if ( !tagTitle )
            tagTitle = list.title.capitalizeEachWord();

        rows.push(
            <div className="examplesList_header"
                key={ "examplesList_header" }>{
                tagTitle
            }</div>
        );

        var image;
        for ( var i=0; i<list.projects.length; i++ ) {
            item = list.projects[i];

            image = "";
            if ( item.image )
                image = <div className="examplesList_rowImage">
                    <div className="examplesList_rowImageChild"
                        style={{
                            backgroundImage:
                                "url('"+item.image+"')"
                        }}></div>
                </div>

            var className = "examplesList_row index_" + i%3;
            rows.push(
                <div className={ className }
                    onClick={ this.openProject.bind( this , item.slug ) }
                    key={ "examplesList_row_" + item.slug }>
                    <div className="examplesList_rowText">
                        <div className="examplesList_rowTitle">
                            { item.title }
                        </div>
                        <div className="examplesList_rowSubTitle">
                            { item.medium }
                        </div>
                        <div className="examplesList_rowDescription">
                            { item.summary }
                        </div>
                    </div>
                    { image }
                </div>
            );
        }

        rows.push(
            <div className="examplesList_spacer"
                key="examplesList_spacer">
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

        return  <div className="nano examplesList">
                    <div className="nano-content">
                        <div className="examplesList_rowContainer">
                            { rows }
                        </div>
                    </div>
                    { /*<div className="examplesList_typeToggle"
                        onClick={ this.toggleThumbs }></div>*/ }
                </div>;
    }

});
