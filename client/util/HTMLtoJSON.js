
var HTMLtoJSON = function ( html ) {
    var json = _HTMLtoJSON( html , "json" );
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
                if ( data_prop_name ) {
                    prop_name = data_prop_name;
                    if ( parent_is_array ) {
                        json_parent.push( f );
                    }else{
                        json_parent[prop_name] = f;
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
                            json_ele = [];
                            if ( parent_is_array ) {
                                json_parent.push( json_ele );
                            }else{
                                json_parent[prop_name] = json_ele;
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
                            json_ele = {};
                            if ( parent_is_array ) {
                                json_parent.push( json_ele );
                            }else{
                                json_parent[prop_name] = json_ele;
                            }
                            _HTMLtoJSON( $(e).children() , set , json_ele );
                            break;
                        case "number" :
                            if ( parent_is_array ) {
                                json_parent.push( Number( $(e).text() ) );
                            }else{
                                json_parent[prop_name] = Number( $(e).text() );
                            }
                            break;
                        case "string" :
                            if ( parent_is_array ) {
                                json_parent.push( getNodeText( e ) );//$.trim( $(e).text() ) );
                            }else{
                                json_parent[prop_name] = getNodeText( e );//$.trim( $(e).text() );
                            }
                            break;
                        case "html" :
                            if ( parent_is_array ) {
                                json_parent.push( $.trim( $(e).html() ) );
                            }else{
                                json_parent[prop_name] = $.trim( $(e).html() );
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
