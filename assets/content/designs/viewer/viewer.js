

function prev_logo() {
	logo_index = logo_index - 1;
	
	if ( logo_index < 0 ) {
		$(".container").animate({
			top:50
		},200,function() {
			$(".container").animate({
				top:0
			});
		});
		logo_index = 0;
	}else{
		position_logos( true );
	}
	
	processMetadata();
}

function next_logo() {
	var logos = $(".container").children();
	logo_index = logo_index + 1;
	window_h = $(window).height();
	
	if ( logo_index > logos.length-1 ) {
		logo_index = logos.length-1;
		var bottom = -window_h*logo_index;
		$(".container").animate({
			top:bottom-50
		},200,function() {
			$(".container").animate({
				top:bottom
			});
		});
	}else{
		position_logos( true );
	}
	
	position_logos( true );
	processMetadata();
}

function prev_logo_variation() {
	var logo = $(".container").children()[ logo_index ];
	var version = $(logo).find(".logo_versions");

	var new_version = 0;
	if ( $(version).attr("data-version") ) {
		new_version = parseInt( $(version).attr("data-version") ) - 1;
	}

	if ( new_version < 0 ) {
		var logo = $(".container").children()[ logo_index ];
		$(version).animate({
			left:50
		},200,function() {
			$(version).animate({
				left:0
			});
		});
		
		new_version = 0;
		
		$(version).attr("data-version" , 
			new_version
		);
	}else{
		$(version).attr("data-version" , 
			new_version
		);
		position_logos( true );
	}
	
	processMetadata();
}
function next_logo_variation() {
	var logo = $(".container").children()[ logo_index ];
	var version = $(logo).find(".logo_versions");
	
	var new_version = 1;
	if ( $(version).attr("data-version") ) {
		new_version = parseInt( $(version).attr("data-version") ) + 1;
	}

	if ( new_version > $(version).children().length-1 ) {
		window_w = $(window).width();
		var children = $(version).children();
		
		var far_left = window_w * (children.length-1);
		$(version).animate({
			left:-far_left-50
		},200,function() {
			$(version).animate({
				left:-far_left
			});
		});
		
		new_version = $(version).children().length-1;
		
		$(version).attr("data-version" , 
			new_version
		);
	}else{
		$(version).attr("data-version" , 
			new_version
		);
		position_logos( true );
	}
	
	processMetadata();
}

function render_version_dots () {
	//if ( logo_index == 0 ) {
	//	$(".logo_feedback").html("");
	//	return;
	//}
	
	var total_logos = $(".container").children().length;
	var logodotHTML = "";
	for ( var i=0; i<total_logos; i++ ) {
		if ( logo_index == i ) {
			logodotHTML += "<div class='dot logo highlighted versions'></div>";
		}else{
			logodotHTML += "<div class='dot logo'></div>";
		}
	}
	$(".logo_feedback").html(logodotHTML);

	var logo = $(".container").children()[ logo_index ];
	var version = $(logo).find(".logo_versions");

	var total = $(version).children().length;
	var highlighted = parseInt( $(version).attr("data-version") );

	var dotHTML = "";
	for ( var i=0; i<total; i++ ) {
		if ( highlighted == i ) {
			dotHTML += "<div class='dot version highlighted'></div>";
		}else{
			dotHTML += "<div class='dot version'></div>";
		}
	}

	$(".versions").width( total*15 );
	$(".versions").html(dotHTML);
	
	
	$(".page_feedback").html( (highlighted+1) + " of " + total );
}

var logo_index = 0;

var window_w,window_h;
function position_logos( animate ) {
	window_w = $(window).width();
	window_h = $(window).height();

	$(".container").height(window_h);
	$(".container").width(window_w);
	
	$(".logo").height(window_h);
	$(".logo").width(window_w);

	$(".logo_box").height(window_h);
	$(".logo_box").width(window_w);

	$(".logo_versions").height(window_h);				
	$(".logo_versions").each(function() {
		var children = $(this).children();
		$(this).width( window_w * children.length );

		var version = 0;
		if ( $(this).attr("data-version") ) {
			version = parseInt( $(this).attr("data-version") );
		}else{
			$(this).attr("data-version",0);
		}

		if ( animate ) { 
			$(this).animate({
				"left":-window_w*version
			});
		}else{
			$(this).css("left",-window_w*version+"px");
		}
	});

	
	if ( animate ) { 
		$(".container").animate({
			top:-window_h*logo_index
		});
	}else{
		$(".container").css("top",-window_h*logo_index+"px");
	}

	render_version_dots();
	$(window).scrollTop(0);
	
}

function processMetadata () {
	var metadata = image_meta[ logo_index ];
	
	//setTimeout( function () {
		$(".container").removeClass().addClass("container");
		$(".frame").removeClass().addClass("frame");
		if ( metadata &&  metadata.frame && metadata.frame.length > 0 ) {
			$(".container").addClass(metadata.frame);
			$(".frame").addClass(metadata.frame);
		}
	//}, 200 );
}

function createViewer () {
	var logoHTML = [];
	var variations,variation;
	for ( var i=0; i<image_data.length; i++ ) {
		variations = image_data[i];
	
		logoHTML.push( '<div class="logo_box"><div class="logo_versions">' );
		for ( var c=0; c<variations.length; c++ ) {
			variation = variations[c];
			if ( typeof variation != 'object') {
				logoHTML.push( '<div class="logo" style="background-image: url(\''+variation+'?v'+version_id+'\');"></div>' );
			}else{
				image_meta[ i ] = variations.pop();//should be the last one each time
			}
		}
		logoHTML.push( '</div></div>' );
	}
	$(".container").append( logoHTML.join("") );
	
	processMetadata();
}

function show_nav () {
	var logoHTML = [];
	var variations;
	for ( var i=0; i<image_data.length; i++ ) {
		variations = image_data[i];
		logoHTML.push( '<div class="nav_box scrollable"><div class="nav_versions" style="width:'+(variations.length*84)+'px;">' );
		for ( var c=0; c<variations.length; c++ ) {
			logoHTML.push( '<div class="nav_image hand" onclick="close_nav('+i+','+c+');" style="background-image: url(\''+variations[c]+'?v'+version_id+'\');"></div>' );
		}
		logoHTML.push( '</div></div></div>' );
	}
	
	$(".images_nav").html( logoHTML.join("") );
	$(".images_nav").fadeIn ();
}
function close_nav ( logo , variation ) {

	logo_index = logo;
	var logo = $(".container").children()[ logo_index ];
	var version = $(logo).find(".logo_versions");
	$(version).attr("data-version" , 
		variation
	);

	position_logos( false );
	processMetadata();

	$(".images_nav").fadeOut();	
}

var image_data;
var image_meta;
var version_id;
function initLogoViewer ( root , logos , version ) {
	
	if ( version == "dev" ) {
		version = Math.random();
	}
	
	image_data = logos;
	image_meta = new Array(logos.length);
	version_id = version;
	
	var rootHTML = '<div class="container"></div>';
	rootHTML += '<div class="frame"></div>';
	rootHTML += '<div class="hitareas">';
	rootHTML += '<a href="#" class="prev_variation" onclick="prev_logo_variation();"></a>';
	rootHTML += '<a href="#" class="next_variation" onclick="next_logo_variation();"><div class="page_feedback"></div></a>';
	//rootHTML += '<a href="#" class="prev hand" onclick="prev_logo();"></a>';
	//rootHTML += '<a href="#" class="next" onclick="next_logo();"></a>';
	rootHTML += '<a href="#" class="refresh hand" onclick="location.reload(true);"></a>';
	rootHTML += '<div class="feedback"></div>';
	rootHTML += '<div class="logo_feedback hand" onclick="show_nav();"></div>';
	rootHTML += '<div class="images_nav"></div>';
	rootHTML += '</div>';
	
	$(root).html( rootHTML );
	
	createViewer();
	position_logos();
	
	var me = this;
	$(window).resize(function() {
		if ( me.window_resize_timeout )
			clearTimeout( me.window_resize_timeout );
		me.window_resize_timeout = setTimeout(
			function () {
				position_logos();
			},100
		);
	});

	//uses document because document will be topmost level in bubbling
	$(document).on('touchmove',function(e){
	  e.preventDefault();
	});
	//uses body because jquery on events are called off of the element they are
	//added to, so bubbling would not work if we used document instead.
	$('body').on('touchstart','.scrollable',function(e) {
	  if (e.currentTarget.scrollTop === 0) {
	    e.currentTarget.scrollTop = 1;
	  } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
	    e.currentTarget.scrollTop -= 1;
	  }
	});
	//prevents preventDefault from being called on document if it sees a scrollable div
	$('body').on('touchmove','.scrollable',function(e) {
	  	e.stopPropagation();
	});

};