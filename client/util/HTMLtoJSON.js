
var loadCount = 0;
var HTMLtoJSONImportReplace = function (
    html_lookup , cache , root , done_funk
){
    var elements_to_load = [];
    if ( !cache ) {
        cache = "";
    }

    if ( !root ) {
        root = "";
    }

    if ( !$(html_lookup) ) {
        console.log( "Didn't find " + html_lookup );
        return;
    }

    var html_dom = $( html_lookup );//.clone(); // doesn't matter with img src replaced

    _HTMLtoJSONImportReplace( html_dom , done_funk , root , cache );
}

    var _HTMLtoJSONImportReplace = function (
        html_dom , done_funk , root , cache
    ){
        var elements_to_load = [];

        if (
            html_dom.attr("data-import")// data busted after decorating
        ) {
            elements_to_load.push( html_dom );
        }else{
            html_dom.find("*[data-import]").each(
                function( index , element ) {
                    elements_to_load.push( element );
                }
            );
        }

        if ( elements_to_load.length == 0 ) {
            done_funk( html_dom );
        }else{
            _loadHTMLtoJSONImportReplace(
                elements_to_load, html_dom,
                done_funk , root , cache
            );
        }

    }

    var _loadHTMLtoJSONImportReplace = function (
            elements_to_load, html_dom,
            done_funk , root , cache
        ) {

        if ( elements_to_load.length == 0 ) {
            _HTMLtoJSONImportReplace( html_dom , done_funk , root , cache );
        }else{
            var target_ele = $("<div></div>");
            var ele = elements_to_load.shift();//.pop();//
            var target_lookup = $(ele).attr("data-import");// data busted after decorating

            // gotta load in html, but without loading in all the images
            var file_root_url = root + $(ele).attr("href");
            console.log( file_root_url );
            $.get(
                file_root_url + "?" + cache,
                function( data ) {

                    // avoid loading all the images...
                    var clean_data = data.replace( /\bsrc=/g , "data-src=" );
                    var target_dom = $( "<div>" + clean_data + "</div>" )
                                        .find( target_lookup );

                    target_dom = _HTMLtoJSONCleanDOM( target_dom , file_root_url );

                    var ele_attributes = $(ele).get(0).attributes;
                    var ele_attr_names = [];
                    $.each( ele_attributes,
                        function(i, attrib){
                            ele_attr_names.push( attrib.name );
                        }
                    );

                    for ( var i=0; i<ele_attr_names.length; i++ ) {
                        $(ele).removeAttr( ele_attr_names[i] );
                    }

                    // var target_dom = target_ele.find( target_lookup );
                    $.each( target_dom.get(0).attributes,
                        function(i, attrib){
                            $(ele).attr( attrib.name , attrib.value );
                        }
                    );
                    $(ele).html( target_dom.html() );

                    //index++;
                    _loadHTMLtoJSONImportReplace(
                        elements_to_load, html_dom,
                        done_funk , root , cache
                    );

                }
            );
        }
    }

        var _HTMLtoJSONCleanDOM = function ( target_dom , file_root_url ) {
            // take off last file reference...
            var file_root_url_arr = file_root_url.split("/");
            file_root_url_arr.pop();
            file_root_url = file_root_url_arr.join("/") + "/";

            $( target_dom ).find( "*[data-src]").each(
                function ( index, ele ) {
                    var src_value = $( ele ).attr( "data-src" );
                    if ( src_value.indexOf( "http://" ) != 0 ) {
                        $( ele ).attr( "data-src" , file_root_url + src_value );
                    }
                }
            );

            $( target_dom ).find( "*[href]").each(
                function ( index, ele ) {
                    var href_value = $( ele ).attr( "href" );
                    if ( href_value.indexOf( "http://" ) != 0 ) {
                        $( ele ).attr( "href" , file_root_url + href_value );
                    }
                }
            );

            $( target_dom ).attr( "data-root" , file_root_url );

            return target_dom;
        }


var HTMLtoJSON = function ( html_lookup , source , cache ) {
    var json = _HTMLtoJSON( $( html_lookup ) , "json" , source );
    return json;
}

var _HTMLtoJSON = function ( html , set , json_parent , cache ) {
    var json_parent = json_parent || {};

    var getNodeText = function ( node ) {
        var node = $( node );
        if ( node.prop("tagName") == "IMG" ) {
            if ( node.attr("src") ) {
                return node.attr("src");
            }else{
                // src changed to data-src during imports
                return node.attr("data-src");
            }
        }else{
            return $.trim( node.text() );
        }
    }

    $(html).each( function(i,e) {
        var total_json_nodes = 0;

        // cycle through all of the data
        $.each( $(e).data(), function( j , f ) {
            // data-att="value"
            // j = att
            // f = value

            if ( j.substring( 0 , set.length ) == set ) {
                total_json_nodes++;
                var json_ele;
                var prop_name;
                var type = "string";

                var data_prop_name = j.substring( set.length ).toLowerCase();

                // if it has more than just "data-json"...
                if ( data_prop_name ) {
                    prop_name = data_prop_name;

                    if ( String(f).indexOf( ":attr" ) != -1 ) {
                        var name_split = String(f).split( ":attr" );
                        var value = $(e).attr( name_split[0] );
                        if ( parent_is_array ) {
                            json_parent.push( value );
                        }else{
                            json_parent[prop_name] = value;
                        }
                    }else{
                        if ( parent_is_array ) {
                            json_parent.push( f );
                        }else{
                            json_parent[prop_name] = f;
                        }
                    }
                }else{
                    prop_name = f;

                    if ( !f.split )// its an object
                        return;

                    var type_arr = f.split(":");
                    if ( type_arr.length > 1 ) {
                        type = type_arr[1].toLowerCase();
                        prop_name = type_arr[0];
                    }

                    var parent_is_array = ( json_parent instanceof Array );

                    switch ( type ) {
                        case "array" :
                        case "arr" :
                            // decorate pre existing elements
                            if ( parent_is_array ) {
                                json_ele = [];
                                json_parent.push( json_ele );
                            }else{
                                if ( json_parent[prop_name] ) {
                                    json_ele = json_parent[prop_name];
                                }else{
                                    json_ele = [];
                                    json_parent[prop_name] = json_ele;
                                }
                            }

                            var e_children = $(e).children();
                            if ( e_children.length > 0 ) {
                                _HTMLtoJSON( e_children , set , json_ele );
                            }else{
                                Array.prototype.push.apply(
                                    json_ele,
                                    $(e).text().split(",")
                                );
                            }
                            break;
                        case "object" :
                        case "obj" :

                            // decorate pre existing elements
                            if ( parent_is_array ) {
                                json_ele = {};
                                json_parent.push( json_ele );
                            }else{
                                if ( json_parent[prop_name] ) {
                                    json_ele = json_parent[prop_name];
                                }else{
                                    json_ele = {};
                                    json_parent[prop_name] = json_ele;
                                }
                            }

                            _HTMLtoJSON( $(e).children() , set , json_ele );
                            break;
                        /*
                        // and attempt to read a node as an object...too confusing
                        case "self" :
                            if ( parent_is_array ) {
                                json_ele = {};
                                json_parent.push( json_ele );
                            }else{
                                if ( json_parent[prop_name] ) {
                                    json_ele = json_parent[prop_name];
                                }else{
                                    json_ele = {};
                                    json_parent[prop_name] = json_ele;
                                }
                            }


                            $.each( $(e)[0].attributes , function(i, attrib) {
                                var name = attrib.name;
                                if ( name != "data-json") {
                                    json_ele[ name ] = attrib.value;
                                }
                            });

                            // just jam the text into a text variable...
                            json_ele.text = $(e).text();
                            break;
                        */
                        case "number" :
                        case "num" :
                            if ( parent_is_array ) {
                                json_parent.push( Number( $(e).text() ) );
                            }else{
                                json_parent[prop_name] = Number( $(e).text() );
                            }
                            break;
                        case "boolean" :
                        case "bool" :
                            var bool_value = ( $(e).text().toLowerCase() === "true" );
                            if ( parent_is_array ) {
                                json_parent.push( bool_value );
                            }else{
                                json_parent[prop_name] = bool_value;
                            }
                            break;
                        case "string" :
                        case "str" :
                            if ( parent_is_array ) {
                                json_parent.push( getNodeText( e ) );
                            }else{
                                json_parent[prop_name] = getNodeText( e );
                            }

                            // if some child nodes are found
                            // attach them to the parent...
                            if ( $(e).children().length > 0 ) {
                                _HTMLtoJSON( $(e).children() , set , json_parent );
                            }
                            break;
                        case "html" :

                            //var html_dom = $(e).find("[data-json]").removeAttr("data-json");
                            var html_content = $.trim( $(e).html() );

                            if ( parent_is_array ) {
                                json_parent.push( html_content );
                            }else{
                                json_parent[prop_name] = html_content;
                            }

                            // if some child nodes are found
                            // attach them to the parent...
                            if ( $(e).children().length > 0 ) {
                                _HTMLtoJSON( $(e).children() , set , json_parent );
                            }
                            break;
                    }
                }
            }
        });

        if ( total_json_nodes == 0  ) {
            _HTMLtoJSON( $(e).children() , set , json_parent );
        }
    });

    return json_parent;
}
