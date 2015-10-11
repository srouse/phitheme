


var PhiModel = PhiModelSingleton();
var PhiTheme = function () {};

PhiTheme.run = function ( data_dom ) {

    $(window).ready(function () {

        HTMLtoJSON( $(data_dom) , PhiModel );
        // some defaults...
        PhiModel.project = {};
        PhiModel.page = {};

        RouteState.listenToHash();
        PhiModel.processProjects( PhiModel.projects );

        console.log( PhiModel );

        //inject CSS here...only want this to happen once...
        var styles = {};
        if ( PhiModel.style.line_highlight_color ) {
            styles[".page .page_content h1"] = {
                "border-bottom-color":PhiModel.style.line_highlight_color
            };
            styles[".examplesList .examplesList_rowContainer .examplesList_header"] = {
                "border-bottom-color":PhiModel.style.line_highlight_color
            };
        }
        if ( PhiModel.style.text_highlight_color ) {
            styles[".identityNav .identityNav_centerNav .identityNav_link:hover"] = {
                "color":PhiModel.style.text_highlight_color
            };
        }
        if ( PhiModel.style.side_gradient ) {
            styles[".examplesList.nano > .nano-pane > .nano-slider"] = {
                "background-image":"url('"+ PhiModel.style.side_gradient + "')"
            };
            styles[".identityNav .identityNav_rightGradient"] = {
                "background-image":"url('"+ PhiModel.style.side_gradient + "')"
            };
            styles[".identityNav"] = {
                "background-image":"url('"+ PhiModel.style.side_gradient + "')"
            };
        }
        if ( PhiModel.style.home_background_color ) {
            styles[".identityNav"] = styles[".identityNav"] || {};
            styles[".identityNav"]['background-color']
                = PhiModel.style.home_background_color;
        }
        if ( PhiModel.style.home_main_nav_text_color ) {
            styles[".identityNav .identityNav_centerNav .identityNav_link"] = {
                "color":PhiModel.style.home_main_nav_text_color
            };
        }
        if ( PhiModel.style.home_secondary_nav_text_color ) {
            styles[".phiTheme .phitheme_copyrightNav .identityNav_bottomNav .identityNav_bottomNavLink"] = {
                "color":PhiModel.style.home_secondary_nav_text_color
            };
            styles[".phiTheme .phitheme_copyrightNav .identityNav_bottomNav .identityNav_copyright"] = {
                "color":PhiModel.style.home_secondary_nav_text_color
            };
        }
        if ( PhiModel.style.logo ) {
            styles[".identityNav .identityNav_logo"] = {
                "background-image":"url('"+ PhiModel.style.logo + "')"
            };
        }
        if ( PhiModel.style.logo_mark ) {
            styles[".identityNav .identityNav_logo_small"] = {
                "background-image":"url('"+ PhiModel.style.logo_mark + "')"
            };
        }
        $.injectCSS( styles );


        React.render(
            React.createElement(
                Home,
                {
                    PhiModel:PhiModel
                }
            ),
            document.body
        );
    });
}
