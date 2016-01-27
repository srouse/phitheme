


var PhiModel = PhiModelSingleton();
var PhiThemeBootstrap = function () {};

PhiThemeBootstrap.run = function ( data_dom , route ) {

    $(window).ready(function () {

        //HTMLtoJSON( data_dom , PhiModel );

        HTMLtoJSONImportReplace( data_dom ,
            function ( html_dom ) {

                // return;

                HTMLtoJSON( html_dom , PhiModel );

                $("body").addClass( "body--loaded" );

                // some defaults...
                PhiModel.project = {};
                PhiModel.page = {};

                RouteState.listenToHash();
                if ( route ) {
                    RouteState.merge( route );
                }
                PhiModel.processProjects( PhiModel.projects );

                console.log( PhiModel );

                //inject CSS here...only want this to happen once...
                var styles = {};
                if ( PhiModel.style.line_highlight_color ) {
                    styles[".page_content h1"] = {
                        "border-bottom-color":PhiModel.style.line_highlight_color
                    };
                    styles[".listPage_header"] = {
                        "border-bottom-color":PhiModel.style.line_highlight_color
                    };
                }
                if ( PhiModel.style.text_highlight_color ) {
                    styles[".c-homePage__link:hover"] = {
                        "color":PhiModel.style.text_highlight_color
                    };
                }
                if ( PhiModel.style.side_gradient ) {
                    styles[".listPage.ps-container > .ps-scrollbar-y-rail > .ps-scrollbar-y"] = {
                        "background-image":"url('"+ PhiModel.style.side_gradient + "')"
                    };
                    styles[".c-projectPage.ps-container > .ps-scrollbar-y-rail > .ps-scrollbar-y"] = {
                        "background-image":"url('"+ PhiModel.style.side_gradient + "')"
                    };
                    styles[".c-homePage__rightGradient"] = {
                        "background-image":"url('"+ PhiModel.style.side_gradient + "')"
                    };
                    styles[".c-homePage"] = {
                        "background-image":"url('"+ PhiModel.style.side_gradient + "')"
                    };
                }
                if ( PhiModel.style.home_background_color ) {
                    styles[".c-homePage"] = styles[".c-homePage"] || {};
                    styles[".c-homePage"]['background-color']
                        = PhiModel.style.home_background_color;
                }
                if ( PhiModel.style.home_main_nav_text_color ) {
                    styles[".c-homePage__link"] = {
                        "color":PhiModel.style.home_main_nav_text_color
                    };
                }
                if ( PhiModel.style.home_secondary_nav_text_color ) {
                    styles[".c-homePage__bottomNavLink"] = {
                        "color":PhiModel.style.home_secondary_nav_text_color
                    };
                    styles[".c-homePage__copyright"] = {
                        "color":PhiModel.style.home_secondary_nav_text_color
                    };
                }
                if ( PhiModel.style.logo ) {
                    styles[".c-homePage__logo"] = {
                        "background-image":"url('"+ PhiModel.style.logo + "')"
                    };
                }
                if ( PhiModel.style.logo_mark ) {
                    styles[".c-homePage__logo--small"] = {
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
            }
        );


    });
}
