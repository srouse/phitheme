
var ProjectPage = React.createClass({

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"project",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "project_listeners"
    	);

        RouteState.addDiffListener(
    		"image",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "project_listeners"
    	);

        RouteState.addDiffListener(
    		"private",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "project_listeners"
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "project_listeners" );
    },

    closeProject: function ( e ) {
        if ( RouteState.route.fullscreen == "fullscreen" ) {
            RouteState.merge({fullscreen:''});
        }else{
            RouteState.merge({project:'',image:'',fullscreen:''});
        }

        this.stopPropagation( e );
    },

    _getImageIndex: function () {
        var image_index = 0;
        if ( RouteState.route.image ) {
            image_index = RouteState.route.image-1;
        }
        return image_index;
    },

    prevProject: function ( e ) {
        var project = PhiModel.getPrevProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug}
        );
        this.stopPropagation( e );
    },

    nextProject: function ( e ) {
        var project = PhiModel.getNextProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug}
        );
        this.stopPropagation( e );
    },

    nextImage: function ( e ) {
        var image_index = this._getImageIndex();

        var new_img_index = 0;
        if ( image_index < PhiModel.project.images.length-1 ) {
            new_img_index = image_index+1;
        }

        RouteState.merge(
            {image:new_img_index+1}
        );
        this.stopPropagation( e );
    },

    prevImage: function ( e ) {
        var image_index = this._getImageIndex();

        var new_img_index = PhiModel.project.images.length-1;
        if ( image_index > 0 ) {
            new_img_index = image_index-1;
        }

        RouteState.merge(
            {image:new_img_index+1}
        );
        this.stopPropagation( e );
    },

    imageToFullscreen: function ( e ) {
        RouteState.toggle(
            {fullscreen:'fullscreen'},
            {fullscreen:''}
        );
        this.stopPropagation( e );
    },

    changeImage: function ( index , e ) {
        RouteState.merge(
            {image:index+""}
        );
        this.stopPropagation( e );
    },

    stopPropagation: function ( e ) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    },

    getExternalLink: function ( link_name ) {
        if ( PhiModel.project.external_links ) {
            if (
                PhiModel.project.external_links[ link_name ]
            ) {
                var do_show = false;
                if ( PhiModel.project.external_links[ link_name ].private == true ) {
                    if ( RouteState.route.private == "private" ) {
                        do_show = true;
                    }
                }else{
                    do_show = true;
                }

                var className = "projectPage_leftLink";
                if ( link_name == "link_right" )
                    className = "projectPage_rightLink"

                if ( do_show ) {
                    return <div className={ className }
                                key={ className }>
                                <a href={ PhiModel.project.external_links[ link_name ].location }
                                    onClick={ this.stopPropagation }
                                     className="projectPage_link" target="_new_left">
                                    { PhiModel.project.external_links[ link_name ].title }
                                </a>
                            </div>;
                }
            }
        }
        return "";
    },

    render: function() {

        var fullimage = PhiModel.project.fullimage;
        var fullimage_title = "";
        var images = "";

        if ( PhiModel.project.images ) {
            var image_index = 0;

            if ( RouteState.route.image ) {
                image_index = RouteState.route.image-1;
            }

            fullimage = PhiModel.project.images[image_index].image_url;
            fullimage_title = PhiModel.project.images[image_index].title;

            images = <div className="projectPage_imgNav"
                        onClick={ this.stopPropagation }>
                        <div className="projectPage_imgNav_icons">
                            <div className="projectPage_imgNav_prev"
                                onClick={ this.prevImage }></div>
                            <div className="projectPage_imgNav_text">
                                { image_index+1 } / {  PhiModel.project.images.length }
                            </div>
                            <div className="projectPage_imgNav_next"
                                onClick={ this.nextImage }></div>
                        </div>
                    </div>;
        }

        var links = [];
        links.push( this.getExternalLink( "link_left" ) );
        links.push( this.getExternalLink( "link_right" ) );

        return  <div className="projectPage"
                    onClick={ this.closeProject }>
                    <div className="projectPage_title">
                        { PhiModel.project.title } - { fullimage_title }
                    </div>
                    <img src={ fullimage }
                        className="projectPage_img"
                        onClick={ this.imageToFullscreen } />
                    { images }
                    { links }
                    <div className="projectPage_close"
                        onClick={ this.closeProject }></div>

                    <div className="projectPage_nextProject"
                        onClick={ this.nextProject }></div>
                    <div className="projectPage_prevProject"
                        onClick={ this.prevProject }></div>
                </div>;
    }

});
