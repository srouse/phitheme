
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
            PhiModel.page = false;//PhiModel.pages[ RouteState.route.page ];
            var page;
            for ( var p=0; p<PhiModel.pages.length; p++ ) {
                page = PhiModel.pages[p];
                if ( page.title.slugify() == RouteState.route.page ) {
                    PhiModel.page = page;
                    break;
                }
            }
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
        console.log( list );
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

        this.forceUpdate();
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

        // bottom links are dynamic...
        var page_links = [];
        if ( PhiModel.pages ) {
            var page,style,page_str;

            for ( var p=0; p<PhiModel.pages.length; p++ ) {
                page = PhiModel.pages[p];
                page_str = page.title.slugify();
                style = {"width":(100/PhiModel.pages.length) + "%"};
                if ( RouteState.route.page == page_str ) {
                    style.color = PhiModel.style.text_highlight_color;
                }
                page_links.push(
                    <div className="identityNav_bottomNavLink"
                        style={ style }
                        onClick={ this.gotoPage.bind( this , page_str ) }>
                        { page.title }
                    </div>
                );
            }

        }

        return  <div className="phiTheme">
                    <IdentityNav />
                    <div className="contentArea">
                        <ProjectPage />
                        <ExamplesList />
                        <Page />
                    </div>
                    <ContentTitleSection />

                    { /*needed here for layering*/ }
                    <div className="phitheme_copyrightNav">
                        <div className="identityNav_bottomNav">
                            { page_links }
                            <div className="identityNav_copyright">
                                { PhiModel.copyright }
                            </div>
                        </div>
                    </div>

                </div>;
    }

});
