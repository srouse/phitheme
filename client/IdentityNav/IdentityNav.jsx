
var IdentityNav = React.createClass({


    gotoTag: function ( tag ) {
        RouteState.replace(
            {
                list:[tag],
                project:'',
                image:''
            },
            true
        );
    },

    render: function() {
        return  <div className="identityNav">
                    <div className="identityNav_gradOffset">
                        <div className="identityNav_logo"
                            onClick={ this.gotoTag.bind( this , "") }></div>

                        <div className="identityNav_centerNav">
                            <div className="identityNav_productsLink"
                                onClick={ this.gotoTag.bind( this , "product") }>
                                Products
                            </div>
                            <div className="identityNav_designsLink"
                                onClick={ this.gotoTag.bind( this , "design") }>
                                Designs
                            </div>
                            <div className="identityNav_postersLink"
                                onClick={ this.gotoTag.bind( this , "poster") }>
                                Posters
                            </div>
                        </div>
                    </div>
                </div>;
    }

});
