
var ContentTitleSection = React.createClass({

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
        return  <div className="contentTitleSection">
                    <div className="contentTitleSection_titleSection">
                        <div className="titleSection_titles">
                            <div className="titleSection_title">
                                { PhiModel.project.title }
                            </div>
                            <div className="titleSection_subTitle">
                                { PhiModel.project.medium }
                            </div>
                        </div>
                        { /* <div className="titleSection_close"
                            onClick={ this.closeProject }></div>

                            */ }

                        <div className="titleSection_next"
                            onClick={ this.nextProject }></div>
                        <div className="titleSection_prev"
                            onClick={ this.prevProject }></div>

                    </div>
                    <div className="contentTitleSection_summarySection">
                        { PhiModel.project.description }

                        {/*
                        <div className="titleSection_next"
                            onClick={ this.nextPage }></div>
                        <div className="titleSection_prev"
                            onClick={ this.prevPage }></div>
                        */ }
                    </div>
                </div>;
    }

});
