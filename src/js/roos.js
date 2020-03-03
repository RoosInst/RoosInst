/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* requires:
autogrow.min.js
bootstrap-hover-dropdown.min.js
cookieconsent.min.js
datatables.min.js
jquery.ImageMapResize.js
jquery.magnific-popup.min.js
jquery.maphilight.js
jquery.qtip.js
jquery.roundabout.min.js
js.cookie.min.js
loadbottom.js
loadtop.js
owl.carousel.min.js
*/

/*------------------------------
 *
 * Copyright 2014 Pixelized
 * http://www.pixelized.cz
 *
 * Roxie theme v1.1
------------------------------*/

//FIXED NAVBAR
$(window).scroll(function () {
	if ($(window).width() > 991) {
		if ($(window).scrollTop() > 50) {
			$('.navbar').addClass('navbar-offset');
			$('.navbar').removeClass('navbar-static-top');
			$('.navbar').addClass('navbar-fixed-top');
			$('body').css("padding-top", "70px");
		}
		else {
			$('.navbar').removeClass('navbar-offset');
			$('.navbar').removeClass('navbar-fixed-top');
			$('.navbar').addClass('navbar-static-top');
			$('body').css("padding-top", "0px");
		}
	}

	else {
		if ($(window).scrollTop()) {
			$('.navbar').addClass('navbar-offset');
			$('.navbar').removeClass('navbar-static-top');
			$('.navbar').addClass('navbar-fixed-top');
			$('body').css("padding-top", "40px");
		}
		else {
			$('.navbar').removeClass('navbar-offset');
			$('.navbar').removeClass('navbar-fixed-top');
			$('.navbar').addClass('navbar-static-top');
			$('body').css("padding-top", "0px");
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
		$("div[data-frequency='" + i + "']").hide(); //before range
	}

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
	}

	for (i = maxFreq; i < 200; i++) { //200 being the highest frequency in GHz (currently 90 on site, futureproofing)
		$("div[data-frequency='" + i + "']").hide();
	}

}

$(document).ready(function () {

	//SCROLLING
	$("a.scroll[href^='#']").on('click', function (e) {
		e.preventDefault();
		var hash = this.hash;
		$('html, body').animate({ scrollTop: $(this.hash).offset().top - 110 }, 1000, function () { window.location.hash = hash; });
	});

	//TOOLTIP
	$('.tooltip-init').tooltip();

	//POPOVER
	$('.popover-init').popover();


	//FORM TOGGLE
	$('#reset-password-toggle').click(function () {
		$('#reset-password').slideToggle(500);
	});

	//ESHOP TOGGLE
	$(".addtocart").click(function () {
		$("#eshop-cart-alert").toggleClass("active");
	});

	$("#eshop-cart-alert .close").click(function () {
		$("#eshop-cart-alert").toggleClass("active");
	});

	$('#billing-address-toggle').click(function () {
		$('#billing-address').slideToggle(500);
	});

	//MAGNIFIC POPUP
	$('.show-image').magnificPopup({ type: 'image' });

	//OWL CAROUSEL
	$("#section-partners #partners-slider").owlCarousel({
		//transitionStyle: "cassini-fade",
		dots: false,
		autoplayTimeout: 2500,
		autoplay: true,
		responsive: {
			0: { items: 1 },
			767: { items: 2 },
			992: { items: 3 },
			1200: { items: 4 }
		},
		loop: true
	});



	$("#jumbotron-slider").owlCarousel({
		items: 1,
		dots: false,
		loop: true,
		nav: true,
		navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
		autoplay: true,
		autoplayHoverPause: true
	});

	$("#about-slider").owlCarousel({
		autoplay: true,
		//transitionStyle: "cassini-fade",
		mouseDrag: false,
		touchDrag: false,
		items: 1,
		dots: false,
		autoplayHoverPause: true
	});

	$("#jumbotron-eshop-slider").owlCarousel({
		autoPlay: 5000,
		navigation: true,
		singleItem: true,
		transitionStyle: "fade",
		navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
	});

	$("#portfolio-slider").owlCarousel({
		autoPlay: 5000,
		navigation: true,
		singleItem: true,
		slideSpeed: 500,
		navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
	});

	$("#about-us-slider").owlCarousel({
		autoPlay: 5000,
		singleItem: true,
		transitionStyle: "fade"
	});

	$("#testimonials-slider").owlCarousel({
		autoPlay: 5000,
		singleItem: true,
		transitionStyle: "fadeUp"
	});

	$("#features-default-carousel #owl-carousel-default").owlCarousel({
		stopOnHover: true,
		autoPlay: 5000,
		navigation: true,
		singleItem: true,
		slideSpeed: 500,
		transitionStyle: "fade",
		navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
	});

	$("#features-fade-carousel #owl-carousel-fade").owlCarousel({
		autoPlay: 5000,
		navigation: true,
		singleItem: true,
		transitionStyle: "fade",
		navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
	});

	$("#features-owl-carousel #carousel-wrapper").owlCarousel({
		autoPlay: 3000,
		items: 4,
		itemsDesktop: [1199, 3],
		itemsDesktopSmall: [991, 2],
	});

	//OWL CAROUSEL - HIDDEN CONTROLS
	$(".owl-carousel.hidden-control").mouseenter(function (e) {
		$(this).find(".owl-prev").animate({ opacity: 1, left: "20px" });
		$(this).find(".owl-next").animate({ opacity: 1, right: "20px" });
	});

	$(".owl-carousel.hidden-control").mouseleave(function (e) {
		$(this).find(".owl-prev").animate({ opacity: 0, left: "40px" });
		$(this).find(".owl-next").animate({ opacity: 0, right: "40px" });
	});


	//$('#section-statistics').waypoint(function(){
	//	$('#section-statistics .number').countTo();
	//	},{offset:'85%'}
	//);

	function replaceTitleAttributes() {
		var elements = document.querySelectorAll('abbr[title]'),
			i;
		for (i = 0; i < elements.length; i += 1) {
			elements[i].setAttribute('data-title', elements[i].title);
			elements[i].removeAttribute('title');
		}
	}
	replaceTitleAttributes();
	//Removes default attributes of abbr tag, allows custom css

	//Google search
	(function () {
		var cx = '016663888408278794732:a1ud06__nsq';
		var gcse = document.createElement('script');
		gcse.type = 'text/javascript';
		gcse.async = true;
		gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
			'//cse.google.com/cse.js?cx=' + cx;
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(gcse, s);
	})();
	//replace sign in with username when signed in, requires js.cookies.js
	if (Cookies.get("username")) {
		$("#username").html("<i class='fa fa-user'></i>" + Cookies.get("username"));
		$("#logout").removeClass("hidden");
		$("#newuser").addClass("hidden");
	}

	//Document Search (with up to 4 different search forms/fields)
	$("#docSearchButton").click(function () { goSearch() });
	$("#docSearchButton2").click(function () { goSearch2() });
	$("#docSearchButton3").click(function () { goSearch3() });
	$("#docSearchButton4").click(function () { goSearch4() });

	var imgNumProduct = $("#productImg").find('img').length - 1;
	sourcelink = $('#eshop-slider img:first-child').attr('src');
	if (imgNumProduct <= 0) {
		$('#product-detail-image').attr('src', '/images/no-image-available.png');
		$('#product-detail-image-link').attr('href', '#');
	} else {
		$('#product-detail-image').attr('src', sourcelink);
		$('#product-detail-image-link').attr('href', sourcelink);
	}
	if (imgNumProduct > 1) {
		$('img').addClass("img-responsive centerImg");
		$('#eshop-slider img').wrap('<div class="item"></div>');
	}
	function sliderNumProduct(imgNumProduct) {
		if (imgNumProduct <= 4) {
			return imgNumProduct;
		} else {
			return 4;
		}
	}

	$('.catalogCategoriesSlider').each(function () {
		$(this).owlCarousel({
			//transitionStyle: "cassini-fade",
			autoplayTimeout: 4000,
			autoplay: true,
			responsive: {
				0: { items: 1 },
				767: { items: 2 },
				992: { items: 3 },
				1200: { items: 4 }
			},
			rewind: $(this).find('img').length > 4,
			autoplayHoverPause: true,
			nav: true,
			navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
			dots: true,
			lazyLoad: true
		});
	});

	if (imgNumProduct > 1) {
		$("#eshop-slider").owlCarousel({
			autoplayHoverPause: true,
			autoplayTimeout: 2500,
			autoplay: true,
			items: sliderNumProduct(imgNumProduct),
			rewind: true,
			margin: 3
		})

		$('#eshop-slider .item img').mouseenter(function (e) {
			var source = $(this).attr("src");
			$("#product-detail-image").attr("src", source);
			$("#product-detail-image-link").attr("href", source);
		})
	} else {
		$("#eshop-slider").remove();
	}

	if (imgNumProduct <= 4) {
		$(".owl-controls").remove();
	}

}); //end Ready function

//replace username with sign in, hides logout
function logout() {
	Cookies.remove("username");
	$("#username").html("<i class='fa fa-lock'></i> Sign in");
	$("#logout").addClass("hidden");
	$("#newuser").removeClass("hidden");
	location.reload();
}

//search RI Product documentation.  All 4 functions are similar, just use a different input field.
//TODO: Rewrite with oncclick function passing query field instead of pulling it out of the input  
function goSearch() {
	var docSearch = window.document.docsSearch;
	var searchPhrase = docSearch.query.value.toString();  //ensures numbers will be treated as strings
	//alert(searchPhrase)
	if (searchPhrase == '') {
		$("#searchFail").removeClass("hidden");
		docSearch.query.value = "";
		docSearch.query.focus();
		return true;
	} else {
		var searchString = "/roos/documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=" + escape(searchPhrase);
		//alert(searchString);
		location.href = searchString;
		$("#searchFail").addClass("hidden");
		docSearch.query.value = "";
		return true;
	}
} //end function

function goSearch2() {
	var docSearch2 = window.document.docsSearch2;
	var searchPhrase2 = docSearch2.query2.value.toString();  //ensures numbers will be treated as strings
	//alert(searchPhrase2)
	if (searchPhrase2 == '') {
		$("#searchFail2").removeClass("hidden");
		docSearch2.query2.value = "";
		docSearch2.query2.focus();
		return true;
	} else {
		var searchString2 = "/roos/documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=" + escape(searchPhrase2);
		//alert(searchString);
		$("#searchFail2").addClass("hidden");
		docSearch2.query2.value = searchPhrase2;
		location.href = searchString2;
		return true;
	}
} //end function

function goSearch3() {
	var docSearch3 = window.document.docsSearch3;
	var searchPhrase3 = docSearch3.query3.value.toString();  //ensures numbers will be treated as strings
	if (searchPhrase3 == '') {
		$("#searchFail3").removeClass("hidden");
		docSearch3.query3.value = "";
		docSearch3.query3.focus();
		return true;
	} else {
		var searchString3 = "/roos/documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=" + escape(searchPhrase3);
		//alert(searchString);
		$("#searchFail3").addClass("hidden");
		docSearch3.query3.value = "";
		location.href = searchString3;
		return true;
	}
} //end function

function goSearch4() {
	var docSearch4 = window.document.docsSearch4;
	var docSearch = window.document.docsSearch;
	var searchPhrase4 = docSearch4.query.value.toString();  //ensures numbers will be treated as strings, id = query
	//alert(searchPhrase4)
	if (searchPhrase4 == '') {
		$("#searchFail4").removeClass("hidden");
		docSearch4.query.value = "";
		docSearch4.query.focus();
		return true;
	} else {
		var searchString4 = "/roos/documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=" + escape(searchPhrase4);
		$("#searchFail4").addClass("hidden");
		docSearch4.query.value = searchPhrase4;
		docSearch.query.value = searchPhrase4;
		$('#documentSearch').addClass("active");
		//alert(searchString4);
		location.href = searchString4;
		return true;
	}
} //end function

//site-wide cookie opt-in
/* window.addEventListener("load", function () {
	window.cookieconsent.initialise({
		"palette": {
			"popup": {
				"background": "#252e39"
			},
			"button": {
				"background": "#4676B8"
			}
		},
		"theme": "classic",
		"position": "bottom-left",
		"content": {
			"message": "This website uses cookies when searching or if you sign in.",
			"allow": "Allow cookies",
			"link": "Learn more",
			"href": "https://roos.com/privacy.html"
		}
	})
}); */