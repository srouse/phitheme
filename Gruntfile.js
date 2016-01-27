

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-css-parse');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('cssmodeling');

    var configObj = {
        pkg: '<json:package.json>'
    };

    configObj.react = configObj.react || {};
    configObj.react["phitheme"] = {
        files: {
            'dist/phitheme_jsx.js':
            'client/**/*.jsx'
        }
    };

    configObj.concat = configObj.concat || {};
    configObj.concat["phitheme_js"] = {
        files: {
            'dist/phitheme.js':
            [
                'node_modules/jquery/dist/jquery.min.js',
        		'node_modules/react/dist/react.js',
        		'node_modules/routestate/RouteState.js',
        		// 'node_modules/nanoscroller/bin/javascripts/jquery.nanoscroller.js',
                'node_modules/perfect-scrollbar/dist/js/min/perfect-scrollbar.min.js',

                'dist/phitheme_jsx.js',
                'client/**/*.js',
                'client/install.js',
            ]
        }
    }

    //==========LESS=================
    configObj.concat = configObj.concat || {};
    configObj.concat["phitheme_less"] = {
        files: {
            'dist/phitheme.less':
            [
                'dist/csscore/less/core_mixins.less',
                'client/Shared/html.less',//fonts there
                'client/Shared/**/*.less',
                'client/HomePage/c-homePage.less',
                'client/HomePage/c-homePage--phone.less',
                'client/ListPage/ListPage.less',
                'client/ListPage/ListPage--mobile.less',
                'client/PhiTheme/c-phiTheme.less',
                'client/PhiTheme/c-phiTheme--states.less',
                'client/PhiTheme/c-phiTheme--phone.less',
                'client/ProjectPage/c-projectPage.less',
                'client/ProjectPage/c-projectPage--phone.less',
                'client/SlideShow/c-slideShow.less',
                'client/SlideShow/c-slideShow--states.less'
            ]
        }
    }
    configObj.less = configObj.less || {};
    configObj.less["phitheme"] = {
        files: {
            'dist/phitheme_comps.css':
            [
                'dist/phitheme.less'
            ]
        }
    };
    configObj.concat["less_final"] = {
        files: {
            'dist/phitheme.css':
            [
                // 'node_modules/nanoscroller/bin/css/nanoscroller.css',
                'node_modules/perfect-scrollbar/dist/css/perfect-scrollbar.min.css',
                'dist/phitheme_comps.css',
                'dist/csscore/core.css'
            ]
        }
    }



    /*================ CSSMODELING =============*/
    configObj.cssmodeling = configObj.cssmodeling || {};
    configObj.cssmodeling["phitheme"] = {
        files: {
            'dist/csscore':
            [
                'cssmodeling/css_schemes.json',
                'cssmodeling/systems/css_rows_quartered.json',
                'cssmodeling/systems/css_12_col_vw_quartered.json',
                'cssmodeling/systems/css_phi_grid.json',
                'cssmodeling/systems/css_layouts.json',
                'cssmodeling/skins/css_phitheme_skin.json',
                'cssmodeling/systems/css_simple.json',
                'cssmodeling/css_states.json'//,
                //'cssmodeling/js/css_simple.js'
            ]
        },
        options: {
            resets:[],
            type:"less",
            var_prefix:"v-"
        }
    };

    configObj.cssmodeling = configObj.cssmodeling || {};
    configObj.cssmodeling_components = configObj.cssmodeling_components || {};
    configObj.cssmodeling_components["phitheme"] = {
        files: {
            'dist/csscore':
            [
                'dist/phitheme_comps.css'
            ]
        }
    };




    // ===========WATCHES==================
    configObj.watch = configObj.watch || {};
    configObj.watch["cssmodeling"] = {
        files:[
            'cssmodeling/**/*.json'
        ],
        tasks: ["default"]
    };

    configObj.watch = configObj.watch || {};
    configObj.watch["react"] = {
        files:[
            'client/**/*.jsx',
            'client/**/*.js'
        ],
        tasks: ["react_only"]
    };

    configObj.watch = configObj.watch || {};
    configObj.watch["less"] = {
        files:[
            'client/**/*.less'
        ],
        tasks: ['less_only']
    };




    grunt.initConfig( configObj );

    // 'build' was put together in processProjects
    grunt.registerTask( 'default' , [
        'cssmodeling',
        'concat:phitheme_less',
        'less:phitheme',
        'concat:less_final',
        'cssmodeling_components',
        'react',
        'concat:phitheme_js'
    ] );

    grunt.registerTask( 'less_only' , [
        'concat:phitheme_less',
        'less:phitheme',
        'concat:less_final',
        'cssmodeling_components',
    ] );

    grunt.registerTask( 'react_only' , [
        'react',
        'concat:phitheme_js'
    ] );

}
