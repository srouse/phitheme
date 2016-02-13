
var SlideShow = React.createClass({

    componentDidMount: function() {
        var me = this;
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

    close: function ( e ) {
        RouteState.merge({
            'slideshow':false
        });
        this.stopPropagation( e );
    },

    _getImageIndex: function () {
        var image_index = 0;
        if ( RouteState.route.image ) {
            image_index = RouteState.route.image-1;
        }
        return image_index;
    },

    nextImage: function ( e ) {
        var image_index = this._getImageIndex();

        var new_img_index = 0;
        if ( image_index < PhiModel.project.images.length-1 ) {
            new_img_index = image_index+1;
        }

        RouteState.merge({
            'slideshow:image':new_img_index+1
        });
        this.stopPropagation( e );
    },

    prevImage: function ( e ) {
        var image_index = this._getImageIndex();

        var new_img_index = PhiModel.project.images.length-1;
        if ( image_index > 0 ) {
            new_img_index = image_index-1;
        }

        RouteState.merge({
            'slideshow:image':new_img_index+1
        });
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

        var next = "";
        var prev = "";

        if ( PhiModel.project && PhiModel.project.images ) {
            var image_index = 0;

            if ( RouteState.route.image ) {
                image_index = RouteState.route.image-1;
            }

            fullimage = PhiModel.project.images[image_index].image_url;
            fullimage_title = PhiModel.project.images[image_index].title;

            image_context = image_index+1 + " / " + PhiModel.project.images.length;

            if ( PhiModel.project.images.length > image_index+1 ) {
                next = <div className="
                            c-slideShow__btn c-slideShow__btn--nextProject
                            a-position-right
                            a-transform-vcenter"
                        onClick={ this.nextImage }></div>;
            }

            if ( image_index > 0 ) {
                prev = <div className="
                            c-slideShow__btn c-slideShow__btn--prevProject
                            a-position-left
                            a-transform-vcenter"
                        onClick={ this.prevImage }></div>;
            }
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
                            c-slideShow__btn c-slideShow__btn--close
                            a-position-top-right"
                        onClick={ this.close }></div>
                    { prev }{ next }
                </div>;
    }

});
