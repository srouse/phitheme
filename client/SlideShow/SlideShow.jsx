
var SlideShow = React.createClass({

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
        if ( RouteState.route.slideshow == "slideshow" ) {
            RouteState.merge({slideshow:'',image:''});
        }else{
            RouteState.merge({project:'',image:'',slideshow:''});
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
            {slideshow:'slideshow'},
            {slideshow:''}
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

    render: function() {

        var fullimage = PhiModel.project.fullimage;
        var fullimage_title = "";
        var image_context = "";

        if ( PhiModel.project && PhiModel.project.images ) {
            var image_index = 0;

            if ( RouteState.route.image ) {
                image_index = RouteState.route.image-1;
            }

            fullimage = PhiModel.project.images[image_index].image_url;
            fullimage_title = PhiModel.project.images[image_index].title;

            image_context = image_index+1 + " / " + PhiModel.project.images.length;
        }


        return  <div className="c-slideShow">
                    <div className="c-slideShow__title">
                        { fullimage_title }
                        <span className="imageIndex">
                            { image_context }
                        </span>
                    </div>
                    <img src={ fullimage }
                        className="c-slideShow__img" />
                    <div className="
                            o-slideShow__btn o-slideShow__btn--close
                            a-position-top-right"
                        onClick={ this.closeProject }></div>
                    <div className="
                            o-slideShow__btn o-slideShow__btn--nextProject
                            a-position-left
                            a-transform-vcenter"
                        onClick={ this.nextImage }></div>
                    <div className="
                            o-slideShow__btn o-slideShow__btn--prevProject
                            a-position-right
                            a-transform-vcenter"
                        onClick={ this.prevImage }></div>
                </div>;
    }

});
