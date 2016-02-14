
var HomePage = React.createClass({displayName: "HomePage",


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
                    list:tag
                },
                true
            );
        }
    },

    gotoHome: function ( ) {
        RouteState.replace(
            {
                list:'',
                project:''
            },
            true
        );
    },

    openProject: function ( slug ) {
        RouteState.merge(
            {
                project:slug
            }
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

        var highlights = PhiModel.getHighlightedProjects();
        var highlights_html = [],highlight;
        for ( var h=0; h<highlights.length;h++ ) {
            highlight = highlights[h];
            highlights_html.push(
                React.createElement("div", {className: "c-homePage__highlight", 
                    onClick:  this.openProject.bind( this , highlight.slug) }, 
                    React.createElement("div", {className: "c-homePage__highlight__title"}, 
                         highlight.title
                    ), 
                    React.createElement("div", {className: "c-homePage__highlight__description"}, 
                         highlight.summary
                    ), 
                    React.createElement("div", {className: "c-homePage__highlight__moreBtn"}, 
                        "Read More"
                    )
                )
            );
        }


        return  React.createElement("div", {className: "c-homePage"}, 

                    React.createElement("div", {className: "c-homePage__logo", 
                        onClick:  this.gotoHome}
                    ), 
                    React.createElement("div", {className: "c-homePage__highlights"}, 
                         highlights_html 
                    ), 

                    React.createElement("div", {className: "c-homePage__logo--small", 
                            onClick:  this.gotoHome}), 
                    React.createElement("div", {className: "c-homePage__nav"}, 
                         project_links 
                    ), 
                    React.createElement("div", {className: "c-homePage__rightGradient"})

                );
    }

});


var ListPage = React.createClass({displayName: "ListPage",

    openProject: function ( slug ) {
        RouteState.merge(
            {
                'project':slug
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

        Ps.initialize( $(".listPage")[0] , {
            suppressScrollX: true
        });
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "examples_list" );
        Ps.destroy( $(".listPage")[0] );
    },

    componentDidUpdate: function () {
        Ps.update( $(".listPage")[0] );
    },

    toggleThumbs: function () {
        RouteState.toggle({
            'list.thumbs':"thumbs"
        },{
            'list.thumbs':""
        });
    },

    closeList: function () {
        RouteState.merge({
            list:false
        });
    },

    renderRows: function( list , rows ) {

        var tagTitle = PhiModel.tag_titles[list.title];

        if ( !tagTitle )
            tagTitle = list.title.capitalizeEachWord();

        rows.push(
            React.createElement("div", {className: "o-pageHeader", key:  "listPage_header" }, 
                React.createElement("div", {className: "o-pageHeader__title"}, 
                     tagTitle 
                ), 
                React.createElement("div", {className: "o-pageHeader__nav"}, 
                    /* <div className="o-pageHeader__thumbsBtn"
                        onClick={ this.toggleThumbs }>
                    </div> */ 
                    React.createElement("div", {className: "o-pageHeader__closeBtn", 
                        onClick:  this.closeList}
                    )
                )
            )
        );

        var image;
        for ( var i=0; i<list.projects.length; i++ ) {
            item = list.projects[i];

            image = "";
            if ( item.image )
                image = React.createElement("div", {className: "listPage__rowImage"}, 
                    React.createElement("div", {className: "listPage__rowImageChild", 
                        style: {
                            backgroundImage:
                                "url('"+item.image+"')"
                        }})
                )

            rows.push(
                React.createElement("div", {className: "listPage__row", 
                    onClick:  this.openProject.bind( this , item.slug), 
                    key:  "listPage__row_" + item.slug}, 
                     image, 
                    React.createElement("div", {className: "listPage__rowText"}, 
                        React.createElement("div", {className: "listPage__rowTitle"}, 
                             item.title
                        ), 
                        React.createElement("div", {className: "listPage__rowSubTitle"}, 
                             item.medium
                        ), 
                        React.createElement("div", {className: "listPage__rowDescription"}, 
                             item.summary, 
                             ( item.description ) ?
                                    React.createElement("span", {className: "listPage__more"}, " more...") : ""
                        )
                    )

                )
            );
        }


        var left_to_complete__row = 4 - ( list.projects.length % 4 );
        for ( var i=0; i<left_to_complete__row; i++ ) {
            rows.push(
                React.createElement("div", {className: "listPage__row listPage__row--empty", 
                    key:  "listPage__row_spacer_" + i}
                )
            );
        }

        rows.push(
            React.createElement("div", {className: "listPage__spacer", 
                key: "listPage__spacer"}
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

        return  React.createElement("div", {className: "listPage"}, 
                    React.createElement("div", {className: "listPage__rowContainer"}, 
                         rows 
                    )
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
            !RouteState.route.project ||
            !RouteState.prev_route.project
        ) {
            $(window).scrollTop(0);
        }


        if ( RouteState.route.project ) {
            PhiModel.project = PhiModel.slugs[ RouteState.route.project ];
            if ( !PhiModel.project ) {
                PhiModel.project = {};
                RouteState.merge({
                    project:false
                });
            }
        }else{
            PhiModel.project = {};
        }

        var list = RouteState.route.list;
        PhiModel.project_list = [];

        if ( list ) {
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

    render: function() {
        return  React.createElement("div", {className: "c-phiTheme"}, 
                    React.createElement("div", {className: "c-phiTheme__homePage"}, 
                        React.createElement(HomePage, null)
                    ), 
                    React.createElement(SlideShow, null), 
                    React.createElement("div", {className: "c-phiTheme__contentArea"}, 
                        React.createElement(Page, null)
                    ), 
                    React.createElement(ListPage, null), 
                    React.createElement(ProjectPage, null)

                    /* needed here for layering */ 
                    /* <div className="c-phiTheme__copyrightNav">
                        <div className="c-phiTheme__copyrightNav__bottomNav">
                            { page_links }
                            <div className="c-phiTheme__copyrightNav__copyright">
                                { PhiModel.copyright }
                            </div>
                        </div>
                    </div> */ 

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

        Ps.initialize( $(".c-projectPage")[0] );
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "contenttitle_listeners" );
        Ps.destroy( $(".c-projectPage")[0] );
    },

    componentDidUpdate: function () {
        Ps.update( $(".c-projectPage")[0] );
    },

    closeProject: function () {
        RouteState.merge({
            project:false
        })
    },

    prevProject: function () {
        var project = PhiModel.getPrevProject( RouteState.route.project );

        RouteState.merge({
            project:project.slug
        });
    },

    nextProject: function () {
        var project = PhiModel.getNextProject( RouteState.route.project );

        RouteState.merge({
            project:project.slug
        });
    },

    gotoProject: function ( nav_link ) {
        RouteState.merge({
            project:nav_link.project,
            list:nav_link.list
        });
    },

    openSlideShow: function () {
        RouteState.toggle(
            {'project:slideshow':'slideshow'},
            {'project:slideshow':''}
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
                            React.createElement("div", {className: "c-projectPage__navLinkButton", 
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
                            React.createElement("a", {className: "c-projectPage__navLinkButton", 
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

            /*if ( RouteState.route.image ) {
                image_index = RouteState.route.image-1;
            }*/

            fullimage = PhiModel.project.images[image_index].image_url;
            fullimage_title = PhiModel.project.images[image_index].title;
        }

        var description = "",summary_cls = "c-projectPage__summary--noDescription";
        if ( project.description && project.description.length > 0 ) {
            description =   React.createElement("div", {className: "c-projectPage__text", 
                                contentEditable:  pseudo_edit, 
                                dangerouslySetInnerHTML: {__html:project.description}}
                            );
            summary_cls = "";
        }

        return  React.createElement("div", {className: "c-projectPage"}, 
                    React.createElement("div", {className: "c-projectPage__container"}, 
                        React.createElement("div", {className: "o-pageHeader"}, 
                            React.createElement("div", {className: "o-pageHeader__title"}, 
                                 project.title
                            ), 
                            React.createElement("div", {className: "o-pageHeader__nav"}, 
                                React.createElement("div", {className: "o-pageHeader__closeBtn", 
                                    onClick:  this.closeProject}
                                )
                            )
                        ), 

                        React.createElement("div", {className: "c-projectPage__content"}, 

                             description, 
                            React.createElement("div", {className:  "c-projectPage__summary " + summary_cls}, 
                                React.createElement("div", {className: "c-projectPage__summaryEntry" + ' ' +
                                    "c-projectPage__summaryEntry--previewImage", 
                                    onClick:  this.openSlideShow}, 
                                    React.createElement("image", {src:  fullimage }), 
                                    React.createElement("div", {className: "c-projectPage__summaryText"}, 
                                        "1/",  total_images 
                                    )
                                ), 
                                 nav_links_children 
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

    close: function ( e ) {
        RouteState.merge({
            'slideshow':false
        });
        this.stopPropagation( e );
    },

    _getImageIndex: function () {
        var image_index = 0;
        if ( RouteState.route.image ) {
            image_index = RouteState.route.image-1;
        }
        return image_index;
    },

    nextImage: function ( e ) {
        var image_index = this._getImageIndex();

        var new_img_index = 0;
        if ( image_index < PhiModel.project.images.length-1 ) {
            new_img_index = image_index+1;
        }

        RouteState.merge({
            'slideshow:image':new_img_index+1
        });
        this.stopPropagation( e );
    },

    prevImage: function ( e ) {
        var image_index = this._getImageIndex();

        var new_img_index = PhiModel.project.images.length-1;
        if ( image_index > 0 ) {
            new_img_index = image_index-1;
        }

        RouteState.merge({
            'slideshow:image':new_img_index+1
        });
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

        var next = "";
        var prev = "";

        if ( PhiModel.project && PhiModel.project.images ) {
            var image_index = 0;

            if ( RouteState.route.image ) {
                image_index = RouteState.route.image-1;
            }

            fullimage = PhiModel.project.images[image_index].image_url;
            fullimage_title = PhiModel.project.images[image_index].title;

            image_context = image_index+1 + " / " + PhiModel.project.images.length;

            if ( PhiModel.project.images.length > image_index+1 ) {
                next = React.createElement("div", {className: 
                            "c-slideShow__btn c-slideShow__btn--nextProject" + ' ' +
                            "a-position-right" + ' ' +
                            "a-transform-vcenter", 
                        onClick:  this.nextImage});
            }

            if ( image_index > 0 ) {
                prev = React.createElement("div", {className: 
                            "c-slideShow__btn c-slideShow__btn--prevProject" + ' ' +
                            "a-position-left" + ' ' +
                            "a-transform-vcenter", 
                        onClick:  this.prevImage});
            }
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
                            "c-slideShow__btn c-slideShow__btn--close" + ' ' +
                            "a-position-top-right", 
                        onClick:  this.close}), 
                     prev,  next 
                );
    }

});
