
var ContentTitleSection = React.createClass({

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"project",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "contenttitle_listeners"
    	);

        RouteState.addDiffListener(
    		"private",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "contenttitle_listeners"
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "contenttitle_listeners" );
    },

    closeProject: function () {
        RouteState.merge({project:''})
    },

    prevProject: function () {
        var project = PhiModel.getPrevProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug,image:""}
        );
    },

    nextProject: function () {
        var project = PhiModel.getNextProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug,image:""}
        );
    },

    gotoProject: function ( nav_link ) {
        RouteState.merge({
            project:nav_link.project,
            list:nav_link.list
        });
    },

    render: function() {

        var project = PhiModel.project;
        var nav_links_dom = "";
        if ( project.navigation_links ) {
            var nav_link;

            // filter for private
            var filtered_children = [];
            var total_links = project.navigation_links.length;
            for ( var p=0; p<total_links; p++ ) {
                nav_link = project.navigation_links[p];
                if (
                    nav_link.private === true &&
                    RouteState.route.private != "private"
                ) {
                    continue;
                }
                filtered_children.push( nav_link );
            }

            // put links together with filtered list
            var total_filtered_links = filtered_children.length;
            var nav_links_children = [];
            for ( var p=0; p<total_filtered_links; p++ ) {
                nav_link = filtered_children[p];

                if ( nav_link.internal && nav_link.internal == true ) {
                    nav_links_children.push(
                        <div className="contentTitleSection_navLinkContainer"
                            style={{width: 100/total_filtered_links + "%" }}
                            key={ "nav_link_" + p }>
                            <div className="contentTitleSection_navLinkButton"
                                onClick={
                                    this.gotoProject.bind( this , nav_link )
                                }>
                                { nav_link.title }
                            </div>
                        </div>
                    );
                }else{
                    nav_links_children.push(
                        <div className="contentTitleSection_navLinkContainer"
                            style={{width: 100/total_filtered_links + "%" }}
                            key={ "nav_link_" + p }>
                            <a className="contentTitleSection_navLinkButton"
                                href={ nav_link.location } target="nav_link">
                                { nav_link.title }
                            </a>
                        </div>
                    );
                }


            }

            nav_links_dom = <div className="contentTitleSection_navLinks">
                                { nav_links_children }
                            </div>;
        }

        var pseudo_edit = "false";
        if ( RouteState.route.edit == "edit" ) {
            pseudo_edit = "true";
        }

        return  <div className="contentTitleSection">
                    <div className="contentTitleSection_titleSection">
                        <div className="titleSection_titles">
                            <div className="titleSection_title">
                                { project.title }
                            </div>
                            <div className="titleSection_subTitle">
                                { project.medium }
                            </div>
                        </div>
                        <div className="titleSection_next"
                            onClick={ this.nextProject }></div>
                        <div className="titleSection_prev"
                            onClick={ this.prevProject }></div>
                    </div>
                    <div className="contentTitleSection_summarySection"
                        contentEditable={ pseudo_edit }>
                        { project.description }
                    </div>
                    { nav_links_dom }
                </div>;
    }

});
