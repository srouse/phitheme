
var HomePage = React.createClass({


    gotoTag: function ( tag ) {
        if ( PhiModel.getBreakpoint() == "smartphone" ) {
            RouteState.merge(
                {
                    list:tag,
                    project:'',
                    image:'',
                    page:''
                },
                true
            );
        }else{
            RouteState.merge(
                {
                    list:tag
                },
                true
            );
        }
    },

    gotoHome: function ( ) {
        RouteState.merge(
            {
                list:'',
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
                style = {};
                // style = {"width":(100/PhiModel.product_nav.length) + "%"};
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
                    <div className="homePage_link"
                        style={ style } key={ product.title }
                        onClick={ this.gotoTag.bind( this , product.filters ) }>
                        { product.title }
                    </div>
                );
            }

        }

        return  <div className="homePage">
                    <div className="homePage_gradOffset">
                        <div className="homePage_logo"
                            onClick={ this.gotoHome }></div>
                        <div className="homePage_logo_small"
                            onClick={ this.gotoHome }></div>
                        <div className="homePage_centerNav">
                            { project_links }
                        </div>
                    </div>
                    <div className="homePage_rightGradient"></div>
                </div>;
    }

});
