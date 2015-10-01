
var IdentityNav = React.createClass({


    gotoTag: function ( tag ) {
        RouteState.merge(
            {
                list:tag,
                project:'',
                image:'',
                page:''
            },
            true
        );
    },

    render: function() {

        var project_links = [];
        if ( PhiModel.product_nav ) {
            var product,style;

            var list_arr;
            if ( RouteState.route.list instanceof Array ) {
                list_arr = RouteState.route.list;
            }else{
                list_arr = [RouteState.route.list];
            }

            for ( var p=0; p<PhiModel.product_nav.length; p++ ) {
                product = PhiModel.product_nav[p];
                style = {"width":(100/PhiModel.product_nav.length) + "%"};
                var filter;
                var color_style = PhiModel.style.text_highlight_color;
                for ( var f=0; f<product.filters.length; f++ ) {
                    filter = product.filters[f];
                    if ( list_arr.indexOf( filter ) == -1 ) {
                        color_style = false;
                        break;
                    }
                }
                if ( color_style ) {
                    style.color = color_style;
                }
                project_links.push(
                    <div className="identityNav_link"
                        style={ style } key={ product.title }
                        onClick={ this.gotoTag.bind( this , product.filters ) }>
                        { product.title }
                    </div>
                );
            }

        }

        return  <div className="identityNav">
                    <div className="identityNav_gradOffset">
                        <div className="identityNav_logo"
                            onClick={ this.gotoTag.bind( this , "") }></div>
                        <div className="identityNav_logo_small"
                            onClick={ this.gotoTag.bind( this , "") }></div>
                        <div className="identityNav_centerNav">
                            { project_links }
                        </div>
                    </div>
                    <div className="identityNav_rightGradient"></div>
                </div>;
    }

});
