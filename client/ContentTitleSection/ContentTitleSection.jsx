
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

    getProjectIndex: function ( project_slug ) {
        var list,project;
        for ( var i=0; i<PhiModel.project_list.length; i++ ) {
            list = PhiModel.project_list[i];
            for ( var p=0; p<list.projects.length; p++ ) {
                project = list.projects[p];

                if ( project.slug == project_slug ) {
                    return {list:i,project:p};
                }
            }
        }
        return {list:-1,project:-1};
    },

    getFlatProjectList: function () {
        var flat_list = [];
        for ( var i=0; i<PhiModel.project_list.length; i++ ) {
            list = PhiModel.project_list[i];
            for ( var p=0; p<list.projects.length; p++ ) {
                project = list.projects[p];
                flat_list.push( project );
            }
        }

        return flat_list;
    },

    getPrevProject: function ( project_slug ) {
        var flat_list = this.getFlatProjectList();

        for ( var i=0; i<flat_list.length; i++ ) {
            project = flat_list[i];
            if ( project.slug == project_slug ) {
                if ( i == 0 ) {
                    return flat_list[flat_list.length-1];
                }else{
                    return flat_list[i-1];
                }
            }
        }

        return flat_list[0];
    },

    getNextProject: function ( project_slug ) {
        var flat_list = this.getFlatProjectList();

        for ( var i=0; i<flat_list.length; i++ ) {
            project = flat_list[i];
            if ( project.slug == project_slug ) {
                if ( i == flat_list.length-1 ) {
                    return flat_list[0];
                }else{
                    return flat_list[i+1];
                }
            }
        }

        return flat_list[0];
    },

    prevProject: function () {
        var project = this.getPrevProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug,image:""}
        );
    },

    nextProject: function () {
        var project = this.getNextProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug,image:""}
        );
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

            nav_links_dom = <div className="contentTitleSection_navLinks">
                                { nav_links_children }
                            </div>;
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
                    <div className="contentTitleSection_summarySection">
                        { project.description }
                    </div>
                    { nav_links_dom }
                </div>;
    }

});
