
var HTMLtoJSON = function ( html , source ) {
    var json = _HTMLtoJSON( html , "json" , source );
    return json;
}

var _HTMLtoJSON = function ( html , set , json_parent ) {
    var json_parent = json_parent || {};

    var getNodeText = function ( node ) {
        var node = $( node );
        if ( node.prop("tagName") == "IMG" ) {
            return node.attr("src");
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
                            if ( parent_is_array ) {
                                json_parent.push( $.trim( $(e).html() ) );
                            }else{
                                json_parent[prop_name] = $.trim( $(e).html() );
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
