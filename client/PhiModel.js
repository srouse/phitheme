


var PhiModelSingleton = function () {

    var model = {
        style:{
            text_highlight_color:"#999",// need for runtime...
            side_gradient:"assets/gradient.png"
        },
        copyright:"copyright 2015, PhiTheme.com",
        tag_titles:[],
        pages:[],
        product_nav:[],
        projects:[]
        /*
        pages:[
            {
                title:"About",
                content:"<h1>About Content</h1><p>hello</p>"
            }
        ],
        product_nav:[
            {
                title:"Applications",
                filters:['application']
            },
            {
                title:"Design",
                filters:['design']
            }
        ],
        projects:[
            {
                title:"QuantifiedProject",
                medium:"Web Application",
                tags:["design","web","application"],
                description:"QuantifiedProject is an application focusing on",
                image:"../content/products/qp/qp_logo_square.png",
                fullimage:"../content/products/qp/qp_logo_square.png"
            }
        ]
        */
    };

    return model;
};
