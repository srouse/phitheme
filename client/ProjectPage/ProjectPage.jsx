
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

        return  <div className="projectPage"
                    onClick={ this.closeProject }>
                    <div className="projectPage_title">
                        { PhiModel.project.title } - { fullimage_title }
                    </div>
                    <img src={ fullimage }
                        className="projectPage_img"
                        onClick={ this.imageToFullscreen } />
                    { images }
                    <div className="projectPage_close"
                        onClick={ this.closeProject }></div>
                </div>;
    }

});
