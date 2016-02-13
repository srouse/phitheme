
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

        Ps.initialize( $(".c-projectPage")[0] );
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "contenttitle_listeners" );
        Ps.destroy( $(".c-projectPage")[0] );
    },

    componentDidUpdate: function () {
        Ps.update( $(".c-projectPage")[0] );
    },

    closeProject: function () {
        RouteState.merge({
            project:false
        })
    },

    prevProject: function () {
        var project = PhiModel.getPrevProject( RouteState.route.project );

        RouteState.merge({
            project:project.slug
        });
    },

    nextProject: function () {
        var project = PhiModel.getNextProject( RouteState.route.project );

        RouteState.merge({
            project:project.slug
        });
    },

    gotoProject: function ( nav_link ) {
        RouteState.merge({
            project:nav_link.project,
            list:nav_link.list
        });
    },

    openSlideShow: function () {
        RouteState.toggle(
            {'project:slideshow':'slideshow'},
            {'project:slideshow':''}
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
                        <div className="c-projectPage__summaryEntry">
                            <div className="c-projectPage__navLinkButton"
                                onClick={
                                    this.gotoProject.bind( this , nav_link )
                                }>
                                { nav_link.title }
                            </div>
                        </div>
                    );
                }else{
                    nav_links_children.push(
                        <div className="c-projectPage__summaryEntry">
                            <a className="c-projectPage__navLinkButton"
                                href={ nav_link.location } target="nav_link">
                                { nav_link.title }
                            </a>
                        </div>
                    );
                }


            }

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

            /*if ( RouteState.route.image ) {
                image_index = RouteState.route.image-1;
            }*/

            fullimage = PhiModel.project.images[image_index].image_url;
            fullimage_title = PhiModel.project.images[image_index].title;
        }

        var description = "",summary_cls = "c-projectPage__summary--noDescription";
        if ( project.description && project.description.length > 0 ) {
            description =   <div className="c-projectPage__text"
                                contentEditable={ pseudo_edit }
                                dangerouslySetInnerHTML={{__html:project.description}}>
                            </div>;
            summary_cls = "";
        }

        return  <div className="c-projectPage">
                    <div className="c-projectPage__container">
                        <div className="o-pageHeader">
                            <div className="o-pageHeader__title">
                                { project.title }
                            </div>
                            <div className="o-pageHeader__nav">
                                <div className="o-pageHeader__closeBtn"
                                    onClick={ this.closeProject }>
                                </div>
                            </div>
                        </div>

                        <div className="c-projectPage__content">

                            { description }
                            <div className={ "c-projectPage__summary " + summary_cls }>
                                <div className="c-projectPage__summaryEntry
                                    c-projectPage__summaryEntry--previewImage"
                                    onClick={ this.openSlideShow }>
                                    <image src={ fullimage } />
                                    <div className="c-projectPage__summaryText">
                                        1/{ total_images }
                                    </div>
                                </div>
                                { nav_links_children }
                            </div>

                        </div>
                    </div>
                </div>;
    }

});
