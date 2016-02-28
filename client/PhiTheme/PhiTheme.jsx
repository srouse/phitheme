
var PhiTheme = React.createClass({

    refreshPhiModelState: function () {

        // mobile opens new projects/list half way down...
        if (
            !RouteState.route.project ||
            !RouteState.prev_route.project
        ) {
            $(window).scrollTop(0);
        }

        if ( RouteState.route.project ) {
            PhiModel.project = PhiModel.slugs[ RouteState.route.project ];
            if ( !PhiModel.project ) {
                PhiModel.project = {};
                RouteState.merge({
                    project:false
                });
            }
        }else{
            PhiModel.project = {};
        }

        var list = RouteState.route.list;
        PhiModel.project_list = [];

        if ( list ) {
            if ( list instanceof Array && list.length > 0 ) {
                PhiModel.project_list = [];
                for ( var l=0; l<list.length; l++ ) {
                    if ( PhiModel.tags[list[l]] )
                        PhiModel.project_list.push( PhiModel.tags[list[l]] );
                }
            }else{
                if ( PhiModel.tags[list] ) {
                    PhiModel.project_list = [PhiModel.tags[list]];
                }else if ( list.length > 0 ){
                    PhiModel.project_list = [{
                        title:"No Projects Found",
                        projects:[]
                    }];
                }
            }
        }

        this.forceUpdate();
    },

    componentWillMount: function(){
        this.refreshPhiModelState();

        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"project",
    		function ( route , prev_route ) {
                me.refreshPhiModelState();
                ga('send', 'pageview', location.hash );
    		},
            "home"
    	);

        this.route_listener_list = RouteState.addDiffListener(
    		"list",
    		function ( route , prev_route ) {
                me.refreshPhiModelState();
                ga('send', 'pageview', location.hash );
    		},
            "home"
    	);

        /*this.route_listener_list = RouteState.addDiffListener(
    		"page",
    		function ( route , prev_route ) {
                me.refreshPhiModelState();
    		},
            "home"
    	);*/

        this.route_listener_list = RouteState.addDiffListener(
    		"private",
    		function ( route , prev_route ) {
                PhiModel.reprocessProjects();
                me.refreshPhiModelState();
    		},
            "home"
    	);
    },

    componentDidMount: function() {

    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "home" );
    },

    render: function() {
        return  <div className="c-phiTheme">
                    <div className="c-phiTheme__homePage">
                        <HomePage />
                    </div>
                    <SlideShow />
                    <div className="c-phiTheme__contentArea">
                        <Page />
                    </div>
                    <ListPage />
                    <ProjectPage />

                    { /* needed here for layering */ }
                    { /* <div className="c-phiTheme__copyrightNav">
                        <div className="c-phiTheme__copyrightNav__bottomNav">
                            { page_links }
                            <div className="c-phiTheme__copyrightNav__copyright">
                                { PhiModel.copyright }
                            </div>
                        </div>
                    </div> */ }

                </div>;
    }

});
