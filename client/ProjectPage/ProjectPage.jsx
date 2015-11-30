
var ProjectPage = React.createClass({

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

    openSlideShow: function () {
        RouteState.toggle(
            {slideshow:'slideshow'},
            {slideshow:''}
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

                if ( nav_link.internal && nav_link.internal == true ) {
                    nav_links_children.push(
                        <div className="projectPage_navLinkContainer"
                            style={{width: 100/total_filtered_links + "%" }}
                            key={ "nav_link_" + p }>
                            <div className="projectPage_navLinkButton"
                                onClick={
                                    this.gotoProject.bind( this , nav_link )
                                }>
                                { nav_link.title }
                            </div>
                        </div>
                    );
                }else{
                    nav_links_children.push(
                        <div className="projectPage_navLinkContainer"
                            style={{width: 100/total_filtered_links + "%" }}
                            key={ "nav_link_" + p }>
                            <a className="projectPage_navLinkButton"
                                href={ nav_link.location } target="nav_link">
                                { nav_link.title }
                            </a>
                        </div>
                    );
                }


            }

            nav_links_dom = <div className="projectPage_navLinks">
                                { nav_links_children }
                            </div>;
        }

        var pseudo_edit = "false";
        if ( RouteState.route.edit == "edit" ) {
            pseudo_edit = "true";
        }

        fullimage = '';
        fullimage_title = '';
        var total_images = false;
        if ( project.images ) {
            var image_index = 0;
            total_images = project.images.length;

            if ( RouteState.route.image ) {
                image_index = RouteState.route.image-1;
            }

            fullimage = PhiModel.project.images[image_index].image_url;
            fullimage_title = PhiModel.project.images[image_index].title;
        }

        return  <div className="c-projectPage">

                    <div className="c-projectPage__titleSection">

                        <div className="c-projectPage__titleSection__titles">
                            <div className="c-projectPage__totalImgs"
                                onClick={ this.openSlideShow }>
                                <div className="c-projectPage__totalImgs__num">
                                    { total_images }
                                </div>
                                <div className="c-projectPage__totalImgs__images">
                                    images
                                </div>
                            </div>
                            <div className="c-projectPage__title">
                                { project.title }
                            </div>
                            <div className="c-projectPage__subTitle">
                                { project.medium }
                            </div>
                        </div>

                    </div>
                    <div className="c-projectPage__previewImage" style={{
                            'background-image':'url(\'' + fullimage + '\')'}}
                            onClick={ this.openSlideShow }>
                    </div>
                    <div className="c-projectPage__body"
                        contentEditable={ pseudo_edit }
                        dangerouslySetInnerHTML={{__html:project.description}}>
                    </div>

                    { nav_links_dom }
                    <div className="c-projectPage__close"
                        onClick={ this.closeProject }></div>
                </div>;
    }

});
