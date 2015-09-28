
var ContentTitleSection = React.createClass({displayName: "ContentTitleSection",

    componentDidMount: function() {
        var me = this;
        this.route_listener = RouteState.addDiffListener(
    		"project",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		}
    	);
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    closeProject: function () {
        RouteState.merge({project:''})
    },

    getProjectIndex: function ( project_slug ) {
        var list,project;
        for ( var i=0; i<PhiModel.project_list.length; i++ ) {
            list = PhiModel.project_list[i];
            for ( var p=0; p<list.projects.length; p++ ) {
                project = list.projects[p];

                if ( project.slug == project_slug ) {
                    return {list:i,project:p};
                }
            }
        }
        return {list:-1,project:-1};
    },

    getFlatProjectList: function () {
        var flat_list = [];
        for ( var i=0; i<PhiModel.project_list.length; i++ ) {
            list = PhiModel.project_list[i];
            for ( var p=0; p<list.projects.length; p++ ) {
                project = list.projects[p];
                flat_list.push( project );
            }
        }

        return flat_list;
    },

    getPrevProject: function ( project_slug ) {
        var flat_list = this.getFlatProjectList();

        for ( var i=0; i<flat_list.length; i++ ) {
            project = flat_list[i];
            if ( project.slug == project_slug ) {
                if ( i == 0 ) {
                    return flat_list[flat_list.length-1];
                }else{
                    return flat_list[i-1];
                }
            }
        }

        return flat_list[0];
    },

    getNextProject: function ( project_slug ) {
        var flat_list = this.getFlatProjectList();

        for ( var i=0; i<flat_list.length; i++ ) {
            project = flat_list[i];
            if ( project.slug == project_slug ) {
                if ( i == flat_list.length-1 ) {
                    return flat_list[0];
                }else{
                    return flat_list[i+1];
                }
            }
        }

        return flat_list[0];
    },

    prevProject: function () {
        var project = this.getPrevProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug}
        );
    },

    nextProject: function () {
        var project = this.getNextProject( RouteState.route.project );

        RouteState.merge(
            {project:project.slug}
        );
    },

    render: function() {
        return  React.createElement("div", {className: "contentTitleSection"}, 
                    React.createElement("div", {className: "contentTitleSection_titleSection"}, 
                        React.createElement("div", {className: "titleSection_titles"}, 
                            React.createElement("div", {className: "titleSection_title"}, 
                                 PhiModel.project.title
                            ), 
                            React.createElement("div", {className: "titleSection_subTitle"}, 
                                 PhiModel.project.medium
                            )
                        ), 
                        /* <div className="titleSection_close"
                            onClick={ this.closeProject }></div>

                            */ 

                        React.createElement("div", {className: "titleSection_next", 
                            onClick:  this.nextProject}), 
                        React.createElement("div", {className: "titleSection_prev", 
                            onClick:  this.prevProject})

                    ), 
                    React.createElement("div", {className: "contentTitleSection_summarySection"}, 
                         PhiModel.project.description

                        /*
                        <div className="titleSection_next"
                            onClick={ this.nextPage }></div>
                        <div className="titleSection_prev"
                            onClick={ this.prevPage }></div>
                        */ 
                    )
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
        this.route_listener = RouteState.addDiffListener(
    		"list",
    		function ( route , prev_route ) {
                me.forceUpdate();
    		}
    	);

        $(".nano").nanoScroller();
    },

    componentWillUnmount: function(){
        RouteState.removeDiffListener( this.route_listener );
    },

    componentDidUpdate: function () {
        //$(".nano").nanoScroller();
    },

    renderRows: function( list , rows ) {

        var tagTitle = PhiModel.tag_titles[list.title];

        if ( !tagTitle )
            tagTitle = list.title.capitalizeEachWord();

        rows.push(
            React.createElement("div", {className: "examplesList_header"}, 
                tagTitle
            )
        );

        var image;
        for ( var i=0; i<list.projects.length; i++ ) {
            item = list.projects[i];

            image = "";
            if ( item.image )
                image = React.createElement("img", {className: "examplesList_rowImage", 
                                src:  item.image})

            rows.push(
                React.createElement("div", {className: "examplesList_row", 
                    onClick:  this.openProject.bind( this , item.slug) }, 
                    React.createElement("div", {className: "examplesList_rowText"}, 
                        React.createElement("div", {className: "examplesList_rowTitle"}, 
                             item.title
                        ), 
                        React.createElement("div", {className: "examplesList_rowSubTitle"}, 
                             item.medium
                        )
                    ), 
                     image 
                )
            );
        }

        rows.push( React.createElement("div", {className: "examplesList_spacer"}) );
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
                         rows 
                    )
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
            PhiModel.page = PhiModel.content[ RouteState.route.page ];
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
        PhiModel.project_list = [
            PhiModel.tags["product"],
            PhiModel.tags["design"],
            PhiModel.tags["poster"]
        ];
        if ( list && list != "" ) {
            if ( list instanceof Array && list.length > 0 ) {
                if ( PhiModel.project_list.length > 0 ) {
                    PhiModel.project_list = [];
                    for ( var l=0; l<list.length; l++ ) {
                        if ( PhiModel.tags[list[l]] )
                            PhiModel.project_list.push( PhiModel.tags[list[l]] );
                    }
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
    },

    componentDidMount: function() {

    },

    componentWillUnmount: function(){
        RouteState.removeDiffListenersViaClusterId( "home" );
    },

    gotoPage: function ( page ) {
        RouteState.replace(
            {
                page:page
            }
        );
    },

    render: function() {
        return  React.createElement("div", {className: "catapultStudio"}, 
                    React.createElement(IdentityNav, null), 
                    React.createElement("div", {className: "contentArea"}, 
                        React.createElement(ProjectPage, null), 
                        React.createElement(ExamplesList, null), 
                        React.createElement(Page, null)
                    ), 
                    React.createElement(ContentTitleSection, null), 

                    /*needed here for layering*/ 
                    React.createElement("div", {className: "catapultStudio_copyrightNav"}, 
                        React.createElement("div", {className: "identityNav_bottomNav"}, 
                            React.createElement("div", {className: "identityNav_aboutNavLink", 
                                onClick:  this.gotoPage.bind( this , "about") }, 
                                "About"
                            ), 
                            React.createElement("div", {className: "identityNav_contactNavLink", 
                                onClick:  this.gotoPage.bind( this , "contact") }, 
                                "Contact"
                            ), 
                            React.createElement("div", {className: "identityNav_copyright"}, 
                                "copyright 2015, CatapultStudio.com"
                            )
                        )
                    )

                );
    }

});


var IdentityNav = React.createClass({displayName: "IdentityNav",


    gotoTag: function ( tag ) {
        RouteState.replace(
            {
                list:[tag],
                project:'',
                image:''
            },
            true
        );
    },

    render: function() {
        return  React.createElement("div", {className: "identityNav"}, 
                    React.createElement("div", {className: "identityNav_gradOffset"}, 
                        React.createElement("div", {className: "identityNav_logo", 
                            onClick:  this.gotoTag.bind( this , "") }), 

                        React.createElement("div", {className: "identityNav_centerNav"}, 
                            React.createElement("div", {className: "identityNav_productsLink", 
                                onClick:  this.gotoTag.bind( this , "product") }, 
                                "Products"
                            ), 
                            React.createElement("div", {className: "identityNav_designsLink", 
                                onClick:  this.gotoTag.bind( this , "design") }, 
                                "Designs"
                            ), 
                            React.createElement("div", {className: "identityNav_postersLink", 
                                onClick:  this.gotoTag.bind( this , "poster") }, 
                                "Posters"
                            )
                        )
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

    render: function() {

        var fullimage = PhiModel.project.fullimage;
        var fullimage_title = "";
        var images = "";

        if ( PhiModel.project.images ) {
            var image_index = 0;

            if ( RouteState.route.image ) {
                image_index = RouteState.route.image-1;
            }

            fullimage = PhiModel.project.images[image_index].image_url;
            fullimage_title = PhiModel.project.images[image_index].title;

            images = React.createElement("div", {className: "projectPage_imgNav", 
                onClick:  this.stopPropagation}, 
                React.createElement("div", {className: "projectPage_imgNav_icons"}, 
                    React.createElement("div", {className: "projectPage_imgNav_prev", 
                        onClick:  this.prevImage}), 
                    React.createElement("div", {className: "projectPage_imgNav_text"}, 
                         image_index+1, " / ",   PhiModel.project.images.length
                    ), 
                    React.createElement("div", {className: "projectPage_imgNav_next", 
                        onClick:  this.nextImage})
                )
            );
        }

        return  React.createElement("div", {className: "projectPage", 
                    onClick:  this.closeProject}, 
                    React.createElement("div", {className: "projectPage_title"}, 
                         PhiModel.project.title, " - ",  fullimage_title 
                    ), 
                    React.createElement("img", {src:  fullimage, 
                        className: "projectPage_img", 
                        onClick:  this.imageToFullscreen}), 
                     images, 
                    React.createElement("div", {className: "projectPage_close", 
                        onClick:  this.closeProject})
                );
    }

});