


var PhiModel = PhiModelSingleton();
var PhiThemeBootstrap = function () {};

PhiThemeBootstrap.run = function ( data_dom , route , cache, root, site_data ) {

    $(window).ready(function () {

        //HTMLtoJSON( data_dom , PhiModel );
        $("body").addClass( "body--loading" );

        if ( !cache ) {
            cache = "";
        }

        var finishedFunk = function () {
            $("body").removeClass( "body--loading" );
            $("body").addClass( "body--loaded" );

            // some defaults...
            PhiModel.project = {};
            PhiModel.page = {};
            PhiModel.root = root;

            RouteState.listenToHash();

            if (
                route &&
                !RouteState.route.list &&
                !RouteState.route.project
            ) {
                RouteState.merge( route );
            }
            PhiModel.processProjects( PhiModel.projects );

            //console.log( PhiModel );

            //inject CSS here...only want this to happen once...
            var styles = {};
            if ( PhiModel.style.line_highlight_color ) {
                styles[".listPage__row:hover"] = {
                    "border-bottom-color":PhiModel.style.line_highlight_color
                };
            }

            if ( PhiModel.style.text_highlight_color ) {
                styles[".c-homePage__link:hover"] = {
                    "color":PhiModel.style.text_highlight_color
                };
            }

            if ( PhiModel.style.contact_color ) {
                styles[".c-homePage__contactLink"] = {
                    "color":PhiModel.style.contact_color
                };
            }

            if ( PhiModel.style.contact_hover_color ) {
                styles[".c-homePage__contactLink:hover"] = {
                    "color":PhiModel.style.contact_hover_color
                };
            }

            if ( PhiModel.style.home_links_width_padding ) {
                styles[".c-homePage__contactLinks"] = {
                    "padding":"0 " + PhiModel.style.home_links_width_padding
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

            if ( PhiModel.style.project_link_hover ) {
                styles[".c-projectPage__navLinkButton:hover"] = {
                    "color":PhiModel.style.project_link_hover
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


        if ( site_data ) {
            $.extend( PhiModel, site_data );
            finishedFunk();
        }else{
            HTMLtoJSONImportReplace( data_dom , cache , root,
                function ( html_dom ) {
                    HTMLtoJSON( html_dom , PhiModel );
                    console.log( JSON.stringify( PhiModel ) );
                    finishedFunk();
                }
            );
        }



    });
}
