
var HomePage = React.createClass({


    gotoTag: function ( tag ) {
        if ( PhiModel.getBreakpoint() == "smartphone" ) {
            RouteState.merge(
                {
                    list:tag,
                    project:''
                },
                true
            );
        }else{
            RouteState.merge(
                {
                    list:tag,
                    project:''
                },
                true
            );
        }
    },

    gotoHome: function ( ) {
        RouteState.merge({
                list:'',
                project:''
            },
            true
        );
    },

    openProject: function ( slug ) {
        RouteState.merge({
            project:slug
        });
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
                    <div className="c-homePage__link"
                        style={ style } key={ product.title }
                        onClick={ this.gotoTag.bind( this , product.filters ) }>
                        { product.title }
                    </div>
                );
            }

        }

        var contact_links = [];
        if ( PhiModel.contact_links ) {
            var contact_link;
            for ( var c=0; c<PhiModel.contact_links.length; c++ ) {
                contact_link = PhiModel.contact_links[c];
                contact_links.push(
                    <a  className="c-homePage__contactLink"
                        href={ contact_link.location } target="_new"
                        key={ contact_link.title }>
                        { contact_link.title }
                    </a>
                );
            }
        }

        var highlights = PhiModel.getHighlightedProjects();
        var highlights_html = [],highlight;
        for ( var h=0; h<highlights.length;h++ ) {
            highlight = highlights[h];
            highlights_html.push(
                <div className="c-homePage__highlight"
                    onClick={ this.openProject.bind( this , highlight.slug ) }>
                    <div className="c-homePage__highlight__title">
                        { highlight.title }
                    </div>
                    <div className="c-homePage__highlight__description">
                        { highlight.summary }
                    </div>
                    <div className="c-homePage__highlight__moreBtn">
                        More
                    </div>
                </div>
            );
        }


        return  <div className="c-homePage">

                    <div className="c-homePage__logo"
                        onClick={ this.gotoHome }>
                        <div className="c-homePage__contactLinks">
                            { contact_links }
                        </div>
                    </div>

                    <div className="c-homePage__highlights">
                        { highlights_html }
                    </div>

                    <div className="c-homePage__logo--small"
                            onClick={ this.gotoHome }></div>
                    <div className="c-homePage__nav">
                        { project_links }
                    </div>
                    <div className="c-homePage__rightGradient"></div>

                </div>;
    }

});
