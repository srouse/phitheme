
var ContentTitleSection = React.createClass({displayName: "ContentTitleSection",

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"project",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "contenttitle_listeners"
    	);

        RouteState.addDiffListener(
    		"private",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "contenttitle_listeners"
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "contenttitle_listeners" );
    },

    closeProject: function () {
        RouteState.merge({project:''})
    },

    prevProject: function () {
        var project = PhiModel.getPrevProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug,image:""}
        );
    },

    nextProject: function () {
        var project = PhiModel.getNextProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug,image:""}
        );
    },

    gotoProject: function ( nav_link ) {
        RouteState.merge({
            project:nav_link.project,
            list:nav_link.list
        });
    },

    openSlideShow: function () {
        RouteState.toggle(
            {fullscreen:'fullscreen'},
            {fullscreen:''}
        );
    },

    render: function() {

        var project = PhiModel.project;
        var nav_links_dom = "";
        if ( project.navigation_links ) {
            var nav_link;

            // filter for private
            var filtered_children = [];
            var total_links = project.navigation_links.length;
            for ( var p=0; p<total_links; p++ ) {
                nav_link = project.navigation_links[p];
                if (
                    nav_link.private === true &&
                    RouteState.route.private != "private"
                ) {
                    continue;
                }
                filtered_children.push( nav_link );
            }

            // put links together with filtered list
            var total_filtered_links = filtered_children.length;
            var nav_links_children = [];
            for ( var p=0; p<total_filtered_links; p++ ) {
                nav_link = filtered_children[p];

                if ( nav_link.internal && nav_link.internal == true ) {
                    nav_links_children.push(
                        React.createElement("div", {className: "contentTitleSection_navLinkContainer", 
                            style: {width: 100/total_filtered_links + "%"}, 
                            key:  "nav_link_" + p}, 
                            React.createElement("div", {className: "contentTitleSection_navLinkButton", 
                                onClick: 
                                    this.gotoProject.bind( this , nav_link)
                                }, 
                                 nav_link.title
                            )
                        )
                    );
                }else{
                    nav_links_children.push(
                        React.createElement("div", {className: "contentTitleSection_navLinkContainer", 
                            style: {width: 100/total_filtered_links + "%"}, 
                            key:  "nav_link_" + p}, 
                            React.createElement("a", {className: "contentTitleSection_navLinkButton", 
                                href:  nav_link.location, target: "nav_link"}, 
                                 nav_link.title
                            )
                        )
                    );
                }


            }

            nav_links_dom = React.createElement("div", {className: "contentTitleSection_navLinks"}, 
                                 nav_links_children 
                            );
        }

        var pseudo_edit = "false";
        if ( RouteState.route.edit == "edit" ) {
            pseudo_edit = "true";
        }

        fullimage = '';
        fullimage_title = '';
        var total_images = false;
        if ( project.images ) {
            var image_index = 0;
            total_images = project.images.length;

            if ( RouteState.route.image ) {
                image_index = RouteState.route.image-1;
            }

            fullimage = PhiModel.project.images[image_index].image_url;
            fullimage_title = PhiModel.project.images[image_index].title;
        }

        return  React.createElement("div", {className: "contentTitleSection"}, 

                    React.createElement("div", {className: "contentTitleSection_titleSection"}, 
                        React.createElement("div", {className: "titleSection_titles"}, 
                            React.createElement("div", {className: "titleSection_title"}, 
                                 project.title
                            ), 
                            React.createElement("div", {className: "titleSection_subTitle"}, 
                                 project.medium
                            )
                        ), 
                        /*<div className="titleSection_next"
                            onClick={ this.nextProject }></div>
                        <div className="titleSection_prev"
                            onClick={ this.prevProject }></div> */ 
                        React.createElement("div", {className: "titleSection_totalImgs", 
                            onClick:  this.openSlideShow}, 
                            React.createElement("div", {className: "titleSection_totalImgs__num"}, 
                                 total_images 
                            ), 
                            React.createElement("div", {className: "titleSection_totalImgs__images"}, 
                                "images"
                            )
                        )
                    ), 
                    React.createElement("div", {className: "titleSection_mainImage", style: {
                            'background-image':'url(\'' + fullimage + '\')'}, 
                            onClick:  this.openSlideShow}), 

                    React.createElement("div", {className: "contentTitleSection_summarySection", 
                        contentEditable:  pseudo_edit, 
                        dangerouslySetInnerHTML: {__html:project.description}}
                    ), 
                     nav_links_dom, 
                    React.createElement("div", {className: "contentTitleSection_close", 
                        onClick:  this.closeProject})
                );
    }

});


var ExamplesList = React.createClass({displayName: "ExamplesList",

    openProject: function ( slug ) {
        RouteState.merge(
            {
                project:slug
            }
        );
    },

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"list",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "examples_list"
    	);

        RouteState.addDiffListener(
    		"thumbs",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "examples_list"
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "examples_list" );
    },

    componentDidUpdate: function () {
        $(".nano").nanoScroller();

        // compensate for animation...
        setTimeout( function () {
            $(".nano").nanoScroller();
        },400);
    },

    toggleThumbs: function () {
        RouteState.toggle({
            thumbs:"thumbs"
        },{
            thumbs:""
        });
    },

    renderRows: function( list , rows ) {

        var tagTitle = PhiModel.tag_titles[list.title];

        if ( !tagTitle )
            tagTitle = list.title.capitalizeEachWord();

        rows.push(
            React.createElement("div", {className: "examplesList_header", 
                key:  "examplesList_header" }, 
                tagTitle
            )
        );

        var image;
        for ( var i=0; i<list.projects.length; i++ ) {
            item = list.projects[i];

            image = "";
            if ( item.image )
                image = React.createElement("div", {className: "examplesList_rowImage"}, 
                    React.createElement("div", {className: "examplesList_rowImageChild", 
                        style: {
                            backgroundImage:
                                "url('"+item.image+"')"
                        }})
                )

            var className = "examplesList_row index_" + i%3;
            rows.push(
                React.createElement("div", {className:  className, 
                    onClick:  this.openProject.bind( this , item.slug), 
                    key:  "examplesList_row_" + item.slug}, 
                    React.createElement("div", {className: "examplesList_rowText"}, 
                        React.createElement("div", {className: "examplesList_rowTitle"}, 
                             item.title
                        ), 
                        React.createElement("div", {className: "examplesList_rowSubTitle"}, 
                             item.medium
                        ), 
                        React.createElement("div", {className: "examplesList_rowDescription"}, 
                             item.summary
                        )
                    ), 
                     image 
                )
            );
        }

        rows.push(
            React.createElement("div", {className: "examplesList_spacer", 
                key: "examplesList_spacer"}
            )
        );
        return rows;
    },

    render: function() {

        var rows = [];

        var project_list;
        for ( var i=0; i<PhiModel.project_list.length; i++ ) {
            project_list = PhiModel.project_list[i];
            this.renderRows( project_list, rows );
        }

        return  React.createElement("div", {className: "nano examplesList"}, 
                    React.createElement("div", {className: "nano-content"}, 
                        React.createElement("div", {className: "examplesList_rowContainer"}, 
                             rows 
                        )
                    )
                    /*<div className="examplesList_typeToggle"
                        onClick={ this.toggleThumbs }></div>*/ 
                );
    }

});


var Home = React.createClass({displayName: "Home",

    refreshPhiModelState: function () {



        // mobile opens new projects/list half way down...
        if (
            RouteState.route.project == "" ||
            RouteState.prev_route.project == ""
        ) {
            $(window).scrollTop(0);
        }

        if ( RouteState.route.page ) {
            PhiModel.page = false;//PhiModel.pages[ RouteState.route.page ];
            var page;
            for ( var p=0; p<PhiModel.pages.length; p++ ) {
                page = PhiModel.pages[p];
                if ( page.title.slugify() == RouteState.route.page ) {
                    PhiModel.page = page;
                    break;
                }
            }
            if ( !PhiModel.page ) {
                PhiModel.page = {};
                RouteState.merge(
                    {page:""}
                )
            }
        }else{
            PhiModel.page = {};
        }

        if ( RouteState.route.project ) {
            PhiModel.project = PhiModel.slugs[ RouteState.route.project ];
            if ( !PhiModel.project ) {
                PhiModel.project = {};
                RouteState.merge(
                    {project:""}
                )
            }
        }else{
            PhiModel.project = {};
        }

        var list = RouteState.route.list;
        PhiModel.project_list = [];

        if ( list && list != "" ) {
            if ( list instanceof Array && list.length > 0 ) {
                PhiModel.project_list = [];
                for ( var l=0; l<list.length; l++ ) {
                    if ( PhiModel.tags[list[l]] )
                        PhiModel.project_list.push( PhiModel.tags[list[l]] );
                }
            }else{
                if ( PhiModel.tags[list] ) {
                    PhiModel.project_list = [PhiModel.tags[list]];
                }else if ( list.length > 0 ){
                    PhiModel.project_list = [{
                        title:"No Projects Found",
                        projects:[]
                    }];
                }
            }
        }

        this.forceUpdate();
    },

    componentWillMount: function(){
        this.refreshPhiModelState();

        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"project",
    		function ( route , prev_route ) {
                me.refreshPhiModelState();
    		},
            "home"
    	);

        this.route_listener_list = RouteState.addDiffListener(
    		"list",
    		function ( route , prev_route ) {
                me.refreshPhiModelState();
    		},
            "home"
    	);

        this.route_listener_list = RouteState.addDiffListener(
    		"page",
    		function ( route , prev_route ) {
                me.refreshPhiModelState();
    		},
            "home"
    	);

        this.route_listener_list = RouteState.addDiffListener(
    		"private",
    		function ( route , prev_route ) {
                PhiModel.reprocessProjects();
                me.refreshPhiModelState();
    		},
            "home"
    	);
    },

    componentDidMount: function() {

    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "home" );
    },

    gotoPage: function ( page ) {
        RouteState.merge(
            {
                page:page,
                list:"",
                image:"",
                project:""
            }
        );
    },

    render: function() {

        // bottom links are dynamic...
        var page_links = [];
        if ( PhiModel.pages ) {
            var page,style,page_str;

            for ( var p=0; p<PhiModel.pages.length; p++ ) {
                page = PhiModel.pages[p];
                page_str = page.title.slugify();
                style = {"width":(100/PhiModel.pages.length) + "%"};
                if ( RouteState.route.page == page_str ) {
                    style.color = PhiModel.style.text_highlight_color;
                }
                page_links.push(
                    React.createElement("div", {className: "identityNav_bottomNavLink", 
                        key:  "identityNav_bottomNavLink_" + p, 
                        style:  style, 
                        onClick:  this.gotoPage.bind( this , page_str) }, 
                         page.title
                    )
                );
            }

        }

        return  React.createElement("div", {className: "phiTheme"}, 
                    React.createElement(IdentityNav, null), 
                    React.createElement("div", {className: "contentArea"}, 
                        React.createElement(ProjectPage, null), 
                        React.createElement(Page, null)
                    ), 

                    React.createElement(ExamplesList, null), 
                    React.createElement(ContentTitleSection, null), 

                    /*needed here for layering*/ 
                    React.createElement("div", {className: "phitheme_copyrightNav"}, 
                        React.createElement("div", {className: "identityNav_bottomNav"}, 
                             page_links, 
                            React.createElement("div", {className: "identityNav_copyright"}, 
                                 PhiModel.copyright
                            )
                        )
                    )

                );
    }

});


var IdentityNav = React.createClass({displayName: "IdentityNav",


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
                    React.createElement("div", {className: "identityNav_link", 
                        style:  style, key:  product.title, 
                        onClick:  this.gotoTag.bind( this , product.filters) }, 
                         product.title
                    )
                );
            }

        }

        return  React.createElement("div", {className: "identityNav"}, 
                    React.createElement("div", {className: "identityNav_gradOffset"}, 
                        React.createElement("div", {className: "identityNav_logo", 
                            onClick:  this.gotoHome}), 
                        React.createElement("div", {className: "identityNav_logo_small", 
                            onClick:  this.gotoHome}), 
                        React.createElement("div", {className: "identityNav_centerNav"}, 
                             project_links 
                        )
                    ), 
                    React.createElement("div", {className: "identityNav_rightGradient"})
                );
    }

});


var Page = React.createClass({displayName: "Page",

    componentDidMount: function() {
        var me = this;
        RouteState.addDiffListener(
    		"page",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		},
            "page_listeners"
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "page_listeners" );
    },

    render: function() {

        var content = "No Page";
        if ( PhiModel.page && PhiModel.page.content )
            content = PhiModel.page.content;

        return  React.createElement("div", {className: "page"}, 
                    React.createElement("div", {className: "page_content", 
                        dangerouslySetInnerHTML: { __html:content}})
                )
    }

});


var ProjectPage = React.createClass({displayName: "ProjectPage",

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

    prevProject: function ( e ) {
        var project = PhiModel.getPrevProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug}
        );
        this.stopPropagation( e );
    },

    nextProject: function ( e ) {
        var project = PhiModel.getNextProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug}
        );
        this.stopPropagation( e );
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

    getExternalLink: function ( link_name ) {
        if ( PhiModel.project.external_links ) {
            if (
                PhiModel.project.external_links[ link_name ]
            ) {
                var do_show = false;
                if ( PhiModel.project.external_links[ link_name ].private == true ) {
                    if ( RouteState.route.private == "private" ) {
                        do_show = true;
                    }
                }else{
                    do_show = true;
                }

                var className = "projectPage_leftLink";
                if ( link_name == "link_right" )
                    className = "projectPage_rightLink"

                if ( do_show ) {
                    return React.createElement("div", {className:  className, 
                                key:  className }, 
                                React.createElement("a", {href:  PhiModel.project.external_links[ link_name ].location, 
                                    onClick:  this.stopPropagation, 
                                     className: "projectPage_link", target: "_new_left"}, 
                                     PhiModel.project.external_links[ link_name ].title
                                )
                            );
                }
            }
        }
        return "";
    },

    render: function() {

        var fullimage = PhiModel.project.fullimage;
        var fullimage_title = "";
        var image_context = "";

        if ( PhiModel.project && PhiModel.project.images ) {
            var image_index = 0;

            if ( RouteState.route.image ) {
                image_index = RouteState.route.image-1;
            }

            fullimage = PhiModel.project.images[image_index].image_url;
            fullimage_title = PhiModel.project.images[image_index].title;

            image_context = image_index+1 + " / " + PhiModel.project.images.length;
        }

        var links = [];
        links.push( this.getExternalLink( "link_left" ) );
        links.push( this.getExternalLink( "link_right" ) );

        return  React.createElement("div", {className: "projectPage"}, 
                    React.createElement("div", {className: "projectPage_title"}, 
                         fullimage_title, 
                        React.createElement("span", {className: "imageIndex"},  image_context )
                    ), 
                    React.createElement("img", {src:  fullimage, 
                        className: "projectPage_img"}), 
                     links, 
                    React.createElement("div", {className: "projectPage_close", 
                        onClick:  this.closeProject}), 

                    React.createElement("div", {className: "projectPage_nextProject", 
                        onClick:  this.nextImage}), 
                    React.createElement("div", {className: "projectPage_prevProject", 
                        onClick:  this.prevImage})
                );
    }

});
