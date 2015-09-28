

document.write("<link href='dist/phitheme.css' type='text/css' rel='stylesheet'>");

var PhiModel;
var PhiTheme = function () {};

PhiTheme.run = function ( data_dom ) {


    $(window).ready(function () {
        PhiModel = HTMLtoJSON( $(data_dom) );
        // some defaults...
        PhiModel.project = {};
        PhiModel.page = {};
        PhiModel.tags = {};
        PhiModel.tags_hashed = {};
        PhiModel.slugs = {};

        //some post processing...
        var project,tag,tag_hash;
        for ( var p=0; p<PhiModel.projects.length; p++ ) {
            project = PhiModel.projects[p];
            project.slug = project.title.slugify();
            PhiModel.slugs[project.slug] = project;

            if ( project.tags ) {
                for ( var t=0; t<project.tags.length; t++ ) {
                    tag = project.tags[t].slugify();
                    project.tags[t] = tag;//replace with cleaned up tag
                    tag_hash = tag.hashCodeStr();
                    if ( !PhiModel.tags[ tag ] ) {
                        PhiModel.tags[ tag ] = {
                            title:tag,
                            tag:tag,
                            tag_hash:tag_hash,
                            projects:[]
                        }
                    }
                    if ( !PhiModel.tags_hashed[ tag_hash ] ) {
                        PhiModel.tags_hashed[ tag_hash ] = {
                            title:tag,
                            tag:tag,
                            tag_hash:tag_hash,
                            projects:[]
                        }
                    }
                    PhiModel.tags[ tag ].projects.push( project );
                    PhiModel.tags_hashed[ tag_hash ].projects.push( project );
                }
            }
        }

        console.log( PhiModel );

        RouteState.listenToHash();
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
