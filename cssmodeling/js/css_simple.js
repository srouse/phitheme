


module.exports = {

    run: function ( CMod ) {

        
        var s_color_values = CMod.createScheme(
            {
                "name":"skin-color-values",
                "shortcut":"<em>@base</em>-[ light, dark (er,est) ]",
    			"scheme":{"@base":
    						[
    							"",
    							{"-light":["","er","est"]},
    							{"-dark":["","er","est"]}
    						]
    					}
    		}
        );


        var example_simpleText = "<div ... style='width: 50px; height: 50px;'>Text</div>";

        var a_color_locations = [
            {
                "group":"skin",
                "sub_group":"colors",
                "example":example_simpleText,
                "selector":".a-background-@var_name",
                "declaration_value":"background-color: _@_@var_name ;"
            },
            {
                "group":"skin",
                "sub_group":"colors",
                "example":example_simpleText,
                "selector":".a-text-color-@var_name",
                "declaration_value":"color: _@_@var_name ;"
            },
            {
                "group":"skin",
                "sub_group":"colors",
                "example":example_simpleText,
                "selector":".a-hover-background-@var_name",
                "declaration_value":"&:hover { background-color : _@_@var_name ; }"
            },
            {
                "group":"skin",
                "sub_group":"colors",
                "example":example_simpleText,
                "selector":".a-hover-text-color-@var_name",
                "declaration_value":"&:hover { color : _@_@var_name ; }"
            }
        ];

        // s- > v- > a-

        s_color_values.createVariable(
            {
                "name":"redox-green",
                "group":"skin",
    			"base":"redox-green",
    			"values":[
                    "#00b588",
    				"#00DFA7","#B7FFE0","#f9fffd",
    				"#008262","#008262","#008262"
    			]
            }
        ).createAtoms(
            a_color_locations
        );

        s_color_values.createVariable(
            {
                "name":"redox-red",
                "group":"skin",
    			"base":"redox-red",
    			"values":[
    				"#DF0034",
    				"#DE2F57","#B7FFE0","#f9fffd",
    				"#008262","#008262","#008262"
    			]
            }
        ).createAtoms(
            a_color_locations
        );





        CMod.createScheme({
            "name":"s-position-placements",
            "shortcut":"<em>@base</em>-[ top, bottom, left, right, top-[left, right], bottom-[left, right]]",
			"scheme":{
        				"@base":[
        					{"-top":["-right","-left",""]},
        					{"-bottom":["","-right","-left"]},
        					"-left","-right"
        				]
        			}
    	}).createVariable({
            "name":"position-placements-by-names",
            "group":"simple",
            "ignore_variable":true,
			"base":"",
			"values":[
				"0px","0px","0px","0px","0px","0px","0px","0px"
			]
        }).createAtom({
            "group":"simple",
            "sub_group":"positioning",
            "example":"<div ... style='position:absolute; width: 100px; height: 100px; background-color:#fff;'></div>",
            "selector":".a@var_name",
            "declaration_iteration_values":[
                "top: _@_@var_name ; right: _@_@var_name ;",
                "top: _@_@var_name ; left: _@_@var_name ;",
                "top: _@_@var_name ;",
                "bottom: _@_@var_name ;",
                "bottom: _@_@var_name ; right: _@_@var_name ;",
                "bottom: _@_@var_name ; left: _@_@var_name ;",
                "left: _@_@var_name ;",
                "right: _@_@var_name ;"
            ]
        }).createAtom({
            "group":"simple",
            "sub_group":"positioning",
            "example":"<div ... style='position:absolute; width: 100px; height: 100px; background-color:#fff;'></div>",
            "selector":".a@var_name-fixed",
            "declaration_iteration_values":[
                "position: fixed; top: _@_@var_name ; right: _@_@var_name ;",
                "position: fixed;top: _@_@var_name ; left: _@_@var_name ;",
                "position: fixed;top: _@_@var_name ;",
                "position: fixed;bottom: _@_@var_name ;",
                "position: fixed;bottom: _@_@var_name ; right: _@_@var_name ;",
                "position: fixed;bottom: _@_@var_name ; left: _@_@var_name ;",
                "position: fixed;left: _@_@var_name ;",
                "position: fixed;right: _@_@var_name ;"
            ]
        });



    }
}
