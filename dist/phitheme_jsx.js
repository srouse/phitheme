
var HomePage = React.createClass({displayName: "HomePage",


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
                    React.createElement("div", {className: "c-homePage__link", 
                        style:  style, key:  product.title, 
                        onClick:  this.gotoTag.bind( this , product.filters) }, 
                         product.title
                    )
                );
            }

        }

        return  React.createElement("div", {className: "c-homePage"}, 

                    React.createElement("div", {className: "c-homePage__content"}, 
                        React.createElement("div", {className: "c-homePage__logo", 
                            onClick:  this.gotoHome}), 
                        React.createElement("div", {className: "c-homePage__logo--small", 
                            onClick:  this.gotoHome})
                    ), 
                    React.createElement("div", {className: "c-homePage__nav"}, 
                         project_links 
                    )

                    /* <div className="c-homePage__rightGradient"></div> */
                );
    }

});


var ListPage = React.createClass({displayName: "ListPage",

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
            React.createElement("div", {className: "listPage_header", 
                key:  "listPage_header" }, 
                tagTitle
            )
        );

        var image;
        for ( var i=0; i<list.projects.length; i++ ) {
            item = list.projects[i];

            image = "";
            if ( item.image )
                image = React.createElement("div", {className: "listPage_rowImage"}, 
                    React.createElement("div", {className: "listPage_rowImageChild", 
                        style: {
                            backgroundImage:
                                "url('"+item.image+"')"
                        }})
                )

            var className = "listPage_row index_" + i%3;
            rows.push(
                React.createElement("div", {className:  className, 
                    onClick:  this.openProject.bind( this , item.slug), 
                    key:  "listPage_row_" + item.slug}, 
                    React.createElement("div", {className: "listPage_rowText"}, 
                        React.createElement("div", {className: "listPage_rowTitle"}, 
                             item.title
                        ), 
                        React.createElement("div", {className: "listPage_rowSubTitle"}, 
                             item.medium
                        ), 
                        React.createElement("div", {className: "listPage_rowDescription"}, 
                             item.summary
                        )
                    ), 
                     image 
                )
            );
        }

        rows.push(
            React.createElement("div", {className: "listPage_spacer", 
                key: "listPage_spacer"}
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

        return  React.createElement("div", {className: "nano listPage"}, 
                    React.createElement("div", {className: "nano-content"}, 
                        React.createElement("div", {className: "listPage_rowContainer"}, 
                             rows 
                        )
                    )
                    /*<div className="listPage_typeToggle"
                        onClick={ this.toggleThumbs }></div>*/ 
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
                    React.createElement("div", {className: "page_content o-document", 
                        dangerouslySetInnerHTML: { __html:content}})
                )
    }

});


var PhiTheme = React.createClass({displayName: "PhiTheme",

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
                    React.createElement("div", {className: "c-phiTheme__copyrightNav__bottomNavLink", 
                        key:  "homePage_bottomNavLink_" + p, 
                        style:  style, 
                        onClick:  this.gotoPage.bind( this , page_str) }, 
                         page.title
                    )
                );
            }

        }

        return  React.createElement("div", {className: "c-phiTheme"}, 
                    React.createElement("div", {className: "c-phiTheme__homePage"}, 
                        React.createElement(HomePage, null)
                    ), 
                    React.createElement(SlideShow, null), 
                    React.createElement("div", {className: "c-phiTheme__contentArea"}, 
                        React.createElement(Page, null)
                    ), 
                    React.createElement(ListPage, null), 
                    React.createElement(ProjectPage, null), 

                    /*needed here for layering*/ 
                    React.createElement("div", {className: "c-phiTheme__copyrightNav"}, 
                        React.createElement("div", {className: "c-phiTheme__copyrightNav__bottomNav"}, 
                             page_links, 
                            React.createElement("div", {className: "c-phiTheme__copyrightNav__copyright"}, 
                                 PhiModel.copyright
                            )
                        )
                    )

                );
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
            {slideshow:'slideshow'},
            {slideshow:''}
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
                        React.createElement("div", {className: "c-projectPage__summaryEntry"}, 
                            React.createElement("div", {className: "projectPage_navLinkButton", 
                                onClick: 
                                    this.gotoProject.bind( this , nav_link)
                                }, 
                                 nav_link.title
                            )
                        )
                    );
                }else{
                    nav_links_children.push(
                        React.createElement("div", {className: "c-projectPage__summaryEntry"}, 
                            React.createElement("a", {className: "projectPage_navLinkButton", 
                                href:  nav_link.location, target: "nav_link"}, 
                                 nav_link.title
                            )
                        )
                    );
                }


            }

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

        return  React.createElement("div", {className: "c-projectPage"}, 
                    React.createElement("div", {className: "c-projectPage__container"}, 

                        React.createElement("div", {className: "c-projectPage__titleSection"}, 

                            React.createElement("div", {className: "c-projectPage__titleSection__titles"}, 
                                React.createElement("div", {className: "c-projectPage__title"}, 
                                     project.title
                                )
                                /* <div className="c-projectPage__subTitle">
                                    { project.medium }
                                </div> */
                            ), 

                            React.createElement("div", {className: "c-projectPage__close", 
                                onClick:  this.closeProject})

                        ), 

                        React.createElement("div", {className: "c-projectPage__content"}, 

                            React.createElement("div", {className: "c-projectPage__summary"}, 
                                React.createElement("div", {className: "c-projectPage__summaryEntry" + ' ' +
                                        "c-projectPage__summaryEntry--previewImage", 
                                        onClick:  this.openSlideShow}, 
                                    React.createElement("image", {src:  fullimage })
                                ), 
                                React.createElement("div", {className: "c-projectPage__summaryEntry", 
                                        onClick:  this.openSlideShow}, 
                                     "view " + total_images + " images"
                                ), 
                                 nav_links_children 
                            ), 


                            React.createElement("div", {className: "c-projectPage__text", 
                                contentEditable:  pseudo_edit, 
                                dangerouslySetInnerHTML: {__html:project.description}}
                            )
                        )





                    )
                );
    }

});


var SlideShow = React.createClass({displayName: "SlideShow",

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
        if ( RouteState.route.slideshow == "slideshow" ) {
            RouteState.merge({slideshow:'',image:''});
        }else{
            RouteState.merge({project:'',image:'',slideshow:''});
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
            {slideshow:'slideshow'},
            {slideshow:''}
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


        return  React.createElement("div", {className: "c-slideShow"}, 
                    React.createElement("div", {className: "c-slideShow__title"}, 
                         fullimage_title, 
                        React.createElement("span", {className: "imageIndex"}, 
                             image_context 
                        )
                    ), 
                    React.createElement("img", {src:  fullimage, 
                        className: "c-slideShow__img"}), 
                    React.createElement("div", {className: 
                            "o-slideShow__btn o-slideShow__btn--close" + ' ' +
                            "a-position-top-right", 
                        onClick:  this.closeProject}), 
                    React.createElement("div", {className: 
                            "o-slideShow__btn o-slideShow__btn--nextProject" + ' ' +
                            "a-position-left" + ' ' +
                            "a-transform-vcenter", 
                        onClick:  this.nextImage}), 
                    React.createElement("div", {className: 
                            "o-slideShow__btn o-slideShow__btn--prevProject" + ' ' +
                            "a-position-right" + ' ' +
                            "a-transform-vcenter", 
                        onClick:  this.prevImage})
                );
    }

});
