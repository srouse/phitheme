

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
    configObj.concat["phitheme_less"] = {
        files: {
            'dist/phitheme.less':
            [
                'dist/csscore/less/core_mixins.less',
                'node_modules/nanoscroller/bin/css/nanoscroller.css',
                'client/Shared/html.less',//fonts there
                'client/Shared/**/*.less',
                'client/**/Shared/**/*.less',//process shared less first
                'client/**/*.less'
            ]
        }
    }

    configObj.concat["phitheme_js"] = {
        files: {
            'dist/phitheme.js':
            [
                'node_modules/jquery/dist/jquery.min.js',
        		'node_modules/react/dist/react.js',
        		'node_modules/routestate/RouteState.js',
        		'node_modules/nanoscroller/bin/javascripts/jquery.nanoscroller.js',

                'dist/phitheme_jsx.js',
                'client/**/*.js',
                'client/install.js',
            ]
        }
    }

    configObj.less = configObj.less || {};
    configObj.less["phitheme"] = {
        files: {
            'dist/phitheme.css':
            [
                'dist/phitheme.less'
            ]
        }
    };
    configObj.concat = configObj.concat || {};
    configObj.concat["phitheme_css"] = {
        files: {
            'dist/phitheme.css':
            [
                'dist/phitheme.css',
                'dist/csscore/core.css'
            ]
        }
    }

    configObj.css_parse = {
        dist: {
            files: {
                'dist/csstagged.json':
                [
                    'dist/phitheme.css'
                ]
            }
        }
    };

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
            resets:[
                'cssmodeling/_resets/**/*.css'
            ],
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
                'dist/phitheme.css'
            ]
        }
    };

    configObj.watch = configObj.watch || {};
    configObj.watch["cssmodeling"] = {
        files:[
            'cssmodeling/*.json'
        ],
        tasks: ["default"]
    };
/*=============== CSSMODELING =============*/


    configObj.watch = configObj.watch || {};
    configObj.watch["react"] = {
        files:[
            'client/**/*.jsx',
            'client/**/*.js'
        ],
        tasks: ["default"]
    };

    configObj.watch = configObj.watch || {};
    configObj.watch["react"] = {
        files:[
            'client/**/*.less'
        ],
        tasks: [
            'concat:phitheme_less',
            'less:phitheme',
            'concat:phitheme_css'
        ]
    };

    grunt.initConfig( configObj );

    // 'build' was put together in processProjects
    grunt.registerTask( 'default' , [
        'cssmodeling','cssmodeling_components',
        'concat:phitheme_less',
        'less:phitheme',
        'concat:phitheme_css',
        'react',
        'concat:phitheme_js',
        'css_parse'
    ] );

}
