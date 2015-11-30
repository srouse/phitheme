

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
                'dist/csssystem/less/less_mixins.less',
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
                'dist/csssystem/core.css'
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
            'dist/csssystem':
            [
                'cssmodeling/css_groups.json',
                'cssmodeling/css_schemes.json',
                'cssmodeling/css_variables_atoms.json',
                'cssmodeling/css_utilities.json',
                'cssmodeling/css_states.json'
            ]
        },
        options: {
            components:[
                'client/Shared/**/*.less',
                //'client/**/*.less'
            ],
            type:"less",
            rootpath:"../../assets/"
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
            'client/**/*.less',
            'client/**/*.js'
        ],
        tasks: ["default"]
    };

    grunt.initConfig( configObj );

    // 'build' was put together in processProjects
    grunt.registerTask( 'default' , [
        'cssmodeling',
        'concat:phitheme_less',
        'less:phitheme',
        'concat:phitheme_css',
        'react',
        'concat:phitheme_js',
        'css_parse'
    ] );

}
