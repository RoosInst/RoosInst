/*------------------------------
 * Copyright 2014 Pixelized
 * http://www.pixelized.cz
 *
 * Roxie theme v1.1
------------------------------*/

//FIXED NAVBAR
$(window).scroll(function(){
	if($(window).width() > 991) {
		if($(window).scrollTop() > 50) {
			$('.navbar').addClass('navbar-offset');
			$('.navbar').removeClass('navbar-static-top');
			$('.navbar').addClass('navbar-fixed-top');
			$('body').css("padding-top","70px");
		}
		else {
			$('.navbar').removeClass('navbar-offset');
			$('.navbar').removeClass('navbar-fixed-top');
			$('.navbar').addClass('navbar-static-top');
			$('body').css("padding-top","0px");
		}
	}

	else {
		if($(window).scrollTop()) {
			$('.navbar').addClass('navbar-offset');
			$('.navbar').removeClass('navbar-static-top');
			$('.navbar').addClass('navbar-fixed-top');
			$('body').css("padding-top","40px");
		}
		else {
			$('.navbar').removeClass('navbar-offset');
			$('.navbar').removeClass('navbar-fixed-top');
			$('.navbar').addClass('navbar-static-top');
			$('body').css("padding-top","0px");
		}
	}
});

//TWITTER SHARE BUTTON
//!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

 function filterParts() {
			$('.product').show();
			minFreq = parseInt($("#amount").val(), 10);
			maxFreq = parseInt($("#amount2").val(), 10);
			
			for (i = 0; i < minFreq; i++) {
				$("div[data-frequency='"+ i + "']").hide(); //before range
			};
			
			for (i = minFreq; i < maxFreq; i++) { //within range
				if ($('#cassini16').is(':checked') || $('#cassini8').is(':checked') || $('#ri7100a').is(':checked)')) {
					$('div.product:not([data-model])').hide();
				}
				
				if ($('#cassini16').is(':checked') && $('#cassini8').is(':checked') && $('#ri7100a').is(':not(:checked)')) { //yes yes no
					$('div[data-model="ri7100a"]').hide();
				}
				if ($('#cassini16').is(':checked') && $('#cassini8').is(':not(:checked)') && $('#ri7100a').is(':checked')) { //yes no yes
					$('div[data-model="cassini8"]').hide();
				}
				if ($('#cassini16').is(':checked') && $('#cassini8').is(':not(:checked)') && $('#ri7100a').is(':not(:checked)')) { //yes no no
					$('div[data-model="cassini8"]').hide();
					$('div[data-model="ri7100a"]').hide();
				}
				if ($('#cassini16').is(':not(:checked)') && $('#cassini8').is(':checked') && $('#ri7100a').is(':checked')) { //no yes yes
					$('div[data-model="cassini16"]').hide();
				}
				if ($('#cassini16').is(':not(:checked)') && $('#cassini8').is(':checked') && $('#ri7100a').is(':not(:checked)')) { //no yes no
					$('div[data-model="cassini16"]').hide();
					$('div[data-model="ri7100a]').hide();
				}
				if ($('#cassini16').is(':not(:checked)') && $('#cassini8').is(':not(:checked)') && $('#ri7100a').is(':checked')) { //no no yes
					$('div[data-model="cassini16"]').hide();
					$('div[data-model="cassini8]').hide();
				}
			};
			
				for (i = maxFreq; i < 200; i++) { //200 being the highest frequency in GHz (currently 90 on site, futureproofing)
					$("div[data-frequency='"+ i + "']").hide();
				};
				
			};	

$(document).ready(function() {
	//NAVBAR
	$('.navbar-main-menu > li.dropdown').mouseenter(function() {
		$(this).addClass('open');
	});

	$('.navbar-main-menu > li.dropdown').mouseleave(function() {
		$(this).removeClass('open');
	});

	var minimum = 0;
	var maximum = 90;

	$( "#slider-range" ).slider({
		change: filterParts(), /*{ //local function
			$('.product').show();
			minFreq = parseInt($("#amount").val(), 10);
			maxFreq = parseInt($("#amount2").val(), 10);
			
			for (i = 0; i < minFreq; i++) {
				$("div[data-frequency='"+ i + "']").hide(); //before range
			};
			
			for (i = minFreq; i < maxFreq; i++) { //within range
				if ($('#cassini16').is(':checked') && $('#cassini8').is(':checked') && $('#ri7100a').is(':not(:checked)')) { //yes yes no
					$('div[data-model="ri7100a"]').hide();
				}
				if ($('#cassini16').is(':checked') && $('#cassini8').is(':not(:checked)') && $('#ri7100a').is(':checked')) { //yes no yes
					$('div[data-model="cassini8"]').hide();
				}
				if ($('#cassini16').is(':checked') && $('#cassini8').is(':not(:checked)') && $('#ri7100a').is(':not(:checked)')) { //yes no no
					$('div[data-model="cassini8"]').hide();
					$('div[data-model="ri7100a"]').hide();
				}
				if ($('#cassini16').is(':not(:checked)') && $('#cassini8').is(':checked') && $('#ri7100a').is(':checked')) { //no yes yes
					$('div[data-model="cassini16"]').hide();
				}
				if ($('#cassini16').is(':not(:checked)') && $('#cassini8').is(':checked') && $('#ri7100a').is(':not(:checked)')) { //no yes no
					$('div[data-model="cassini16"]').hide();
					$('div[data-model="ri7100a]').hide();
				}
				if ($('#cassini16').is(':not(:checked)') && $('#cassini8').is(':not(:checked)') && $('#ri7100a').is(':checked')) { //no no yes
					$('div[data-model="cassini16"]').hide();
					$('div[data-model="cassini8]').hide();
				}
			};
			
				for (i = maxFreq; i < 200; i++) { //200 being the highest frequency in GHz (currently 90 on site, futureproofing)
					$("div[data-frequency='"+ i + "']").hide();
				};
				
			},	*/
		
			range: true,
			min: minimum,
			max: maximum,
			values: [ minimum, maximum ],
			slide: function( event, ui ) {
			  $( "#amount" ).val( ui.values[ 0 ] + " GHz");
			  $( "#amount2" ).val( ui.values[ 1 ] + " GHz");
			}
    });
    $( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) + " GHz");
	$( "#amount2" ).val( $( "#slider-range" ).slider( "values", 1 ) + " GHz");

	//SCROLLING
	$("a.scroll[href^='#']").on('click', function(e) {
		e.preventDefault();
		var hash = this.hash;
		$('html, body').animate({ scrollTop: $(this.hash).offset().top - 110}, 1000, function(){window.location.hash = hash;});
	});

	//TOOLTIP
	$('.tooltip-init').tooltip();

	//POPOVER
	$('.popover-init').popover();

	//PORTFOLIO - ISOTOPE
	var $container = $('.portfolio-wrapper');
	$container.isotope({
	  	itemSelector: '.portfolio-item',
	});

	$('.portfolio-filter li a').click(function(e) {
		$('.portfolio-filter li a').removeClass('active');
		$(this).addClass('active');

        var category = $(this).attr('data-filter');
		$container.isotope({
			filter: category
		});
    });

	//BLOG - ISOTOPE
	var $container2 = $('.blog-wrapper');
	$container2.isotope({
	  	itemSelector: '.blog-item',
	});

	$('.blog-filter li a').click(function(e) {
		$('.blog-filter li a').removeClass('active');
		$(this).addClass('active');

        var category = $(this).attr('data-filter');
		$container2.isotope({
			filter: category
		});
    });

	//FORM TOGGLE
	$('#reset-password-toggle').click(function() {
        $('#reset-password').slideToggle(500);
    });

	//ESHOP TOGGLE
	$(".addtocart").click(function() {
        $("#eshop-cart-alert").toggleClass("active");
    });

	$("#eshop-cart-alert .close").click(function() {
        $("#eshop-cart-alert").toggleClass("active");
    });

	$('#billing-address-toggle').click(function() {
        $('#billing-address').slideToggle(500);
    });

	//MAGNIFIC POPUP
	$('.show-image').magnificPopup({type:'image'});

	//OWL CAROUSEL
	$("#section-partners #partners-slider").owlCarousel({
		autoPlay: 3000,
		pagination : false,
		items : 4,
		itemsDesktop : [1199,3],
		itemsDesktopSmall : [991,2]
  	});

	$("#jumbotron-slider").owlCarousel({
		autoPlay: 5000,
		navigation : true,
		singleItem : true,
		pagination : false,
		transitionStyle : "fade",
		slideSpeed : 500,
		navigationText : ["<i class='owl-prev fa fa-angle-left'></i>","<i class='owl-next fa fa-angle-right'></i>"],
		stopOnHover: true
  	});

	$("#about-slider").owlCarousel({
		autoPlay: 0,
		singleItem : true,
		transitionStyle: "cassini-fade",
		pagination: false,
		mouseDrag: false,
		touchDrag: false
  	});

	$("#jumbotron-eshop-slider").owlCarousel({
		autoPlay: 5000,
		navigation : true,
		singleItem : true,
		transitionStyle : "fade",
		navigationText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"]
  	});

//	$("#eshop-slider").owlCarousel({
//		autoPlay: 5000,
//		scrollPerPage : true,
//		items : 3,
//		itemsDesktop : [1199,3],
//		itemsDesktopSmall : [991,2]
//  	});
//
//	$('#eshop-slider .item img').mouseenter(function(e) {
//		var source = $(this).attr("src");
//		$("#product-detail-image").attr("src",source);
//		$("#product-detail-image-link").attr("href",source);
//    });

	$("#portfolio-slider").owlCarousel({
		autoPlay: 5000,
		navigation : true,
		singleItem : true,
		slideSpeed : 500,
		navigationText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"]
  	});

	$("#about-us-slider").owlCarousel({
		autoPlay: 5000,
		singleItem : true,
		transitionStyle : "fade"
  	});

	$("#testimonials-slider").owlCarousel({
		autoPlay: 5000,
		singleItem : true,
		transitionStyle : "fadeUp"
  	});

	$("#features-default-carousel #owl-carousel-default").owlCarousel({
		stopOnHover: true,
		autoPlay: 5000,
		navigation : true,
		singleItem : true,
		slideSpeed : 500,
		transitionStyle : "fade",
		navigationText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"]
  	});

	$("#features-fade-carousel #owl-carousel-fade").owlCarousel({
		autoPlay: 5000,
		navigation : true,
		singleItem : true,
		transitionStyle : "fade",
		navigationText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"]
  	});

	$("#features-owl-carousel #carousel-wrapper").owlCarousel({
		autoPlay: 3000,
		items : 4,
		itemsDesktop : [1199,3],
		itemsDesktopSmall : [991,2],
  	});

	//OWL CAROUSEL - HIDDEN CONTROLS
	$(".owl-carousel.hidden-control").mouseenter(function(e) {
		$(this).find(".owl-prev").animate({opacity:1,left:"20px"});
		$(this).find(".owl-next").animate({opacity:1,right:"20px"});
    });

	$(".owl-carousel.hidden-control").mouseleave(function(e) {
		$(this).find(".owl-prev").animate({opacity:0,left:"40px"});
		$(this).find(".owl-next").animate({opacity:0,right:"40px"});
    });

	//TRADESHOWS
	$('#partner_001').mouseenter(function() {$(this).attr("src","images/IMS.png");});
	$('#partner_001').mouseleave(function() {$(this).attr("src","images/IMS_bw.png");});
	$('#partner_002').mouseenter(function() {$(this).attr("src","images/semiconWest.png");});
	$('#partner_002').mouseleave(function() {$(this).attr("src","images/semiconWest_bw.png");});
	$('#partner_003').mouseenter(function() {$(this).attr("src","images/ITCtestWeek.png");});
	$('#partner_003').mouseleave(function() {$(this).attr("src","images/ITCtestWeek_bw.png");});

	//HOTELS
	$('#hotel-1').mouseenter(function() {$(this).attr("src","images/hotel-best.png");});
	$('#hotel-1').mouseleave(function() {$(this).attr("src","images/hotel-best_bw.png");});
	$('#hotel-2').mouseenter(function() {$(this).attr("src","images/hotel-biltmore.png");});
	$('#hotel-2').mouseleave(function() {$(this).attr("src","images/hotel-biltmore_bw.png");});
	$('#hotel-3').mouseenter(function() {$(this).attr("src","images/hotel-holiday.png");});
	$('#hotel-3').mouseleave(function() {$(this).attr("src","images/hotel-holiday_bw.png");});
	$('#hotel-4').mouseenter(function() {$(this).attr("src","images/hotel-marriott.png");});
	$('#hotel-4').mouseleave(function() {$(this).attr("src","images/hotel-marriott_bw.png");});
	$('#hotel-5').mouseenter(function() {$(this).attr("src","images/hotel-avatar.png");});
	$('#hotel-5').mouseleave(function() {$(this).attr("src","images/hotel-avatar_bw.png");});
	$('#hotel-6').mouseenter(function() {$(this).attr("src","images/hotel-quality.png");});
	$('#hotel-6').mouseleave(function() {$(this).attr("src","images/hotel-quality_bw.png");});
	$('#hotel-7').mouseenter(function() {$(this).attr("src","images/hotel-candlewood.png");});
	$('#hotel-7').mouseleave(function() {$(this).attr("src","images/hotel-candlewood_bw.png");});
	$('#hotel-8').mouseenter(function() {$(this).attr("src","images/hotel-hilton.png");});
	$('#hotel-8').mouseleave(function() {$(this).attr("src","images/hotel-hilton_bw.png");});
	$('#hotel-9').mouseenter(function() {$(this).attr("src","images/hotel-hyatt-regency.png");});
	$('#hotel-9').mouseleave(function() {$(this).attr("src","images/hotel-hyatt-regency_bw.png");});
	$('#hotel-10').mouseenter(function() {$(this).attr("src","images/hotel-hyatt-house.png");});
	$('#hotel-10').mouseleave(function() {$(this).attr("src","images/hotel-hyatt-house_bw.png");});
	$('#hotel-11').mouseenter(function() {$(this).attr("src","images/hotel-embassy.png");});
	$('#hotel-11').mouseleave(function() {$(this).attr("src","images/hotel-embassy_bw.png");});

	//$('#section-statistics').waypoint(function(){
	//	$('#section-statistics .number').countTo();
	//	},{offset:'85%'}
	//);

	function replaceTitleAttributes(){
		var elements = document.querySelectorAll('abbr[title]'),
		i;
		for(i = 0; i < elements.length; i += 1){
			elements[i].setAttribute('data-title', elements[i].title);
			elements[i].removeAttribute('title');
		}
	}
	replaceTitleAttributes();
	//Removes default attributes of abbr tag, allows custom css
	
	//Document Search
	$("#docSearchButton").click( function() { goSearch() });
	$("#docSearchButton2").click( function() { goSearch2() });
	$("#docSearchButton3").click( function() { goSearch3() });
		
	//Google search
	(function() {
		var cx = '016663888408278794732:a1ud06__nsq';
		var gcse = document.createElement('script');
		gcse.type = 'text/javascript';
		gcse.async = true;
		gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
			'//cse.google.com/cse.js?cx=' + cx;
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(gcse, s);
	  })();

	//Google Analytics
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	  ga('create', 'UA-12101157-1', 'auto');
	  ga('send', 'pageview');
	  ga('set', '&uid',  Cookies.get('username')); // Set the user ID using signed-in user_id.
	  
	//replace sign in with username when signed in, requires js.cookies.js
	  if ( Cookies.get("username") ) {
				  $( "#username").html( Cookies.get("username") );
				  $( "#logout").removeClass("hidden");
		}

	//Document Search
	$("#docSearchButton").click( function() { goSearch() });
	$("#docSearchButton2").click( function() { goSearch2() });
	$("#docSearchButton3").click( function() { goSearch3() });
	$("#docSearchButton4").click( function() { goSearch4() });
		
});

function goSearch(){
	var docSearch = window.document.docsSearch;
	var searchPhrase = docSearch.query.value.toString();  //ensures numbers will be treated as strings
	//alert(searchPhrase)
	if(searchPhrase==''){
		$("#searchFail").removeClass("hidden");
		docSearch.query.value = "";
		docSearch.query.focus();
		return true;
	} else {
		var searchString = "/roos/documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=" + escape(searchPhrase);
		//alert(searchString);
		location.href= searchString;
		$("#searchFail").addClass("hidden");
		docSearch.query.value = "";
		return true;
	}
}; //end function

function goSearch2(){
	var docSearch2 = window.document.docsSearch2;
	var searchPhrase2 = docSearch2.query2.value.toString();  //ensures numbers will be treated as strings
	//alert(searchPhrase2)
	if(searchPhrase2==''){
		$("#searchFail2").removeClass("hidden");
		docSearch2.query2.value = "";
		docSearch2.query2.focus();
		return true;
	} else {
		var searchString2 = "/roos/documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=" + escape(searchPhrase2);
		//alert(searchString);
		location.href= searchString2;
		$("#searchFail2").addClass("hidden");
		docSearch2.query2.value = "";
		return true;
	}
}; //end function

function goSearch3(){
	var docSearch3 = window.document.docsSearch3;
	var searchPhrase3 = docSearch3.query3.value.toString();  //ensures numbers will be treated as strings
	//alert(searchPhrase2)
	if(searchPhrase3==''){
		$("#searchFail3").removeClass("hidden");
		docSearch3.query3.value = "";
		docSearch3.query3.focus();
		return true;
	} else {
		var searchString3 = "/roos/documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=" + escape(searchPhrase3);
		//alert(searchString);
		location.href= searchString3;
		$("#searchFail3").addClass("hidden");
		docSearch3.query3.value = "";
		return true;
	}
}; //end function

function goSearch4(){
	var docSearch4 = window.document.docsSearch4;
	var searchPhrase4 = docSearch4.query.value.toString();  //ensures numbers will be treated as strings, id = query
	//alert(searchPhrase2)
	if(searchPhrase3==''){
		$("#searchFail4").removeClass("hidden");
		docSearch3.query.value = "";
		docSearch3.query.focus();
		return true;
	} else {
		var searchString3 = "/roos/documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=" + escape(searchPhrase3);
		//alert(searchString);
		location.href= searchString3;
		$("#searchFail4").addClass("hidden");
		docSearch3.query.value = "";
		return true;
	}
}; //end function


function logout(){
	Cookies.remove("username");
	 $( "#username").html( "Sign in" );
	 $( "#logout").addClass("hidden");
};