


var PhiModel = PhiModelSingleton();
var PhiThemeBootstrap = function () {};

PhiThemeBootstrap.run = function ( data_dom ) {

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
            styles[".listPage .listPage_rowContainer .listPage_header"] = {
                "border-bottom-color":PhiModel.style.line_highlight_color
            };
        }
        if ( PhiModel.style.text_highlight_color ) {
            styles[".homePage .homePage_centerNav .homePage_link:hover"] = {
                "color":PhiModel.style.text_highlight_color
            };
        }
        if ( PhiModel.style.side_gradient ) {
            styles[".listPage.nano > .nano-pane > .nano-slider"] = {
                "background-image":"url('"+ PhiModel.style.side_gradient + "')"
            };
            styles[".homePage .homePage_rightGradient"] = {
                "background-image":"url('"+ PhiModel.style.side_gradient + "')"
            };
            styles[".homePage"] = {
                "background-image":"url('"+ PhiModel.style.side_gradient + "')"
            };
        }
        if ( PhiModel.style.home_background_color ) {
            styles[".homePage"] = styles[".homePage"] || {};
            styles[".homePage"]['background-color']
                = PhiModel.style.home_background_color;
        }
        if ( PhiModel.style.home_main_nav_text_color ) {
            styles[".homePage .homePage_centerNav .homePage_link"] = {
                "color":PhiModel.style.home_main_nav_text_color
            };
        }
        if ( PhiModel.style.home_secondary_nav_text_color ) {
            styles[".phiTheme .phitheme_copyrightNav .homePage_bottomNav .homePage_bottomNavLink"] = {
                "color":PhiModel.style.home_secondary_nav_text_color
            };
            styles[".phiTheme .phitheme_copyrightNav .homePage_bottomNav .homePage_copyright"] = {
                "color":PhiModel.style.home_secondary_nav_text_color
            };
        }
        if ( PhiModel.style.logo ) {
            styles[".homePage .homePage_logo"] = {
                "background-image":"url('"+ PhiModel.style.logo + "')"
            };
        }
        if ( PhiModel.style.logo_mark ) {
            styles[".homePage .homePage_logo_small"] = {
                "background-image":"url('"+ PhiModel.style.logo_mark + "')"
            };
        }
        $.injectCSS( styles );


        React.render(
            React.createElement(
                PhiTheme,
                {
                    PhiModel:PhiModel
                }
            ),
            document.body
        );
    });
}
