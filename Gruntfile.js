

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-css-parse');
    grunt.loadNpmTasks('grunt-react');

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
                'client/Shared/html.less',//fonts there
                'client/Shared/**/*.less',
                'client/**/Shared/**/*.less',//process shared less first
                'client/**/*.less',
                'node_modules/nanoscroller/bin/css/nanoscroller.css'
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

    configObj.css_parse = {
        dist: {
            files: {
                'csstagged/csstagged.json':
                [
                    'dist/phitheme.css'
                ]
            }
        }
    };

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
        'concat:phitheme_less',
        'less:phitheme',
        'react',
        'concat:phitheme_js',
        'css_parse'
    ] );

}
