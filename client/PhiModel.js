


var PhiModelSingleton = function () {

    var model = {
        style:{
            text_highlight_color:"#999",// need for runtime...
            side_gradient:"assets/gradient.png"
        },
        copyright:"copyright 2015, PhiTheme.com",
        tag_titles:[],
        pages:[],
        product_nav:[],
        projects:[],
        /*
        pages:[
            {
                title:"About",
                content:"<h1>About Content</h1><p>hello</p>"
            }
        ],
        product_nav:[
            {
                title:"Applications",
                filters:['application']
            },
            {
                title:"Design",
                filters:['design']
            }
        ],
        projects:[
            {
                title:"QuantifiedProject",
                medium:"Web Application",
                tags:["design","web","application"],
                description:"QuantifiedProject is an application focusing on",
                image:"../content/products/qp/qp_logo_square.png",
                fullimage:"../content/products/qp/qp_logo_square.png"
            }
        ]
        */

        reprocessProjects: function () {
            this.processProjects( this.all_projects );
        },

        processProjects: function ( all_projects ) {
            this.all_projects = all_projects;

            // filter out privates
            this.projects = [];
            var project;
            for ( var p=0; p<this.all_projects.length; p++ ) {
                project = this.all_projects[p];
                // needs to be relative to route...
                if (
                    project.private === true &&
                    RouteState.route.private != "private"
                ) {

                }else{
                    this.projects.push( project );
                }
            }

            //some post processing...
            var project,tag,tag_hash;
            var new_projects = [];
            this.tags = {};
            this.tags_hashed = {};
            this.slugs = {};

            for ( var p=0; p<this.projects.length; p++ ) {
                project = this.projects[p];

                project.slug = project.title.slugify();
                this.slugs[project.slug] = project;

                if ( project.tags ) {
                    for ( var t=0; t<project.tags.length; t++ ) {
                        tag = project.tags[t].slugify();
                        project.tags[t] = tag;//replace with cleaned up tag
                        tag_hash = tag.hashCodeStr();
                        if ( !this.tags[ tag ] ) {
                            this.tags[ tag ] = {
                                title:tag,
                                tag:tag,
                                tag_hash:tag_hash,
                                projects:[]
                            }
                        }
                        if ( !this.tags_hashed[ tag_hash ] ) {
                            this.tags_hashed[ tag_hash ] = {
                                title:tag,
                                tag:tag,
                                tag_hash:tag_hash,
                                projects:[]
                            }
                        }
                        this.tags[ tag ].projects.push( project );
                        this.tags_hashed[ tag_hash ].projects.push( project );
                    }
                }
            }
        },

        getProjectIndex: function ( project_slug ) {
            var list,project;
            for ( var i=0; i<this.project_list.length; i++ ) {
                list = this.project_list[i];
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
            for ( var i=0; i<this.project_list.length; i++ ) {
                list = this.project_list[i];
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
        }
    };

    return model;
};
