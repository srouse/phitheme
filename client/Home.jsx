
var Home = React.createClass({

    refreshPhiModelState: function () {

        // mobile opens new projects/list half way down...
        if (
            RouteState.route.project == "" ||
            RouteState.prev_route.project == ""
        ) {
            $(window).scrollTop(0);
        }

        if ( RouteState.route.page ) {
            PhiModel.page = PhiModel.content[ RouteState.route.page ];
            if ( !PhiModel.page ) {
                PhiModel.page = {};
                RouteState.merge(
                    {page:""}
                )
            }
        }else{
            PhiModel.page = {};
        }

        if ( RouteState.route.project ) {
            PhiModel.project = PhiModel.slugs[ RouteState.route.project ];
            if ( !PhiModel.project ) {
                PhiModel.project = {};
                RouteState.merge(
                    {project:""}
                )
            }
        }else{
            PhiModel.project = {};
        }

        var list = RouteState.route.list;
        PhiModel.project_list = [
            PhiModel.tags["product"],
            PhiModel.tags["design"],
            PhiModel.tags["poster"]
        ];
        if ( list && list != "" ) {
            if ( list instanceof Array && list.length > 0 ) {
                if ( PhiModel.project_list.length > 0 ) {
                    PhiModel.project_list = [];
                    for ( var l=0; l<list.length; l++ ) {
                        if ( PhiModel.tags[list[l]] )
                            PhiModel.project_list.push( PhiModel.tags[list[l]] );
                    }
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
    },

    componentWillMount: function(){
        this.refreshPhiModelState();

        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"project",
    		function ( route , prev_route ) {
                me.refreshPhiModelState();
    		},
            "home"
    	);

        this.route_listener_list = RouteState.addDiffListener(
    		"list",
    		function ( route , prev_route ) {
                me.refreshPhiModelState();
    		},
            "home"
    	);

        this.route_listener_list = RouteState.addDiffListener(
    		"page",
    		function ( route , prev_route ) {
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

    gotoPage: function ( page ) {
        RouteState.replace(
            {
                page:page
            }
        );
    },

    render: function() {
        return  <div className="catapultStudio">
                    <IdentityNav />
                    <div className="contentArea">
                        <ProjectPage />
                        <ExamplesList />
                        <Page />
                    </div>
                    <ContentTitleSection />

                    { /*needed here for layering*/ }
                    <div className="catapultStudio_copyrightNav">
                        <div className="identityNav_bottomNav">
                            <div className="identityNav_aboutNavLink"
                                onClick={ this.gotoPage.bind( this , "about" ) }>
                                About
                            </div>
                            <div className="identityNav_contactNavLink"
                                onClick={ this.gotoPage.bind( this , "contact" ) }>
                                Contact
                            </div>
                            <div className="identityNav_copyright">
                                copyright 2015, CatapultStudio.com
                            </div>
                        </div>
                    </div>

                </div>;
    }

});
