
var IdentityNav = React.createClass({


    gotoTag: function ( tag ) {
        RouteState.replace(
            {
                list:tag,
                project:'',
                image:''
            },
            true
        );
    },

    render: function() {

        var gradient_style = {};
        if ( PhiModel.style.side_gradient ) {
            gradient_style = {
                backgroundImage:
                "url('" + PhiModel.style.side_gradient + "');"
            };
        }

        var logo_style = {};
        if ( PhiModel.style.logo ) {
            logo_style = {
                backgroundImage:
                "url('" + PhiModel.style.logo + "');"
            };
        }

        var logo_small_style = {};
        if ( PhiModel.style.logo_mark ) {
            logo_small_style = {
                backgroundImage:
                "url('" + PhiModel.style.logo_mark + "');"
            };
        }

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

        return  <div className="identityNav"
                    style={ gradient_style }>
                    <div className="identityNav_gradOffset">
                        <div className="identityNav_logo"
                            style={ logo_style }
                            onClick={ this.gotoTag.bind( this , "") }></div>
                        <div className="identityNav_logo_small"
                            style={ logo_small_style }
                            onClick={ this.gotoTag.bind( this , "") }></div>

                        <div className="identityNav_centerNav">
                            { project_links }
                        </div>
                    </div>
                </div>;
    }

});
