/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* requires:
autogrow.min.js
bootstrap-hover-dropdown.min.js
cookieconsent.min.js
datatables.min.js
jquery.ImageMapResize.js
jquery.magnific-popup.min.js
jquery.qtip.js
jquery.roundabout.min.js
js.cookie.min.js
loadbottom.js
loadtop.js
owl.carousel.min.js
*/
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
		loop: false,
		rewind: true,
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

function hasCookie() {
	str = document.cookie.split('; ');
	var result = {};
	for (var i = 0; i < str.length; i++) {
		var cur = str[i].split('=');
		result[cur[0]] = cur[1];
	}
	if (result.username != null) {
		return true;
	}
	return false;
}
function doSearch5() {
	var docSearch5 = window.document.docsSearch5;
	var searchPhrase5 = docSearch5.query5.value.toString();
	if (searchPhrase5 == '') {
		$("#searchFail5").removeClass("hidden");
		docSearch5.query5.value = "";
		docSearch5.query5.focus();
		return true;
	} else {
		var searchString5 = escape(searchPhrase5).split("#")[0];
		location.href = "/search.html?query=" + unescape(searchString5);
		return;
	}
}

function searchModal() {
	var searchString = escape(window.document.modalSearch.query.value);
	switch ($('#search_concept_modal').text()) {
		case 'All':
			location.href = "/roos/documentation.nsf/json?searchView&SearchFuzzy=TRUE&Query=" + searchString;
			break;
		case 'Web':
			location.href = "/search.html?query=" + searchString;
			break;
		case 'Documentation':
			location.href = "/roos/documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=" + searchString;
			break;
	}
	return true;
}

function searchBar() {
	var searchString = escape(window.document.search.query.value);
	switch ($('#search_concept').text()) {
		case 'All':
			location.href = "/roos/documentation.nsf/json?searchView&SearchFuzzy=TRUE&Query=" + searchString;
			break;
		case 'Web':
			location.href = "/search.html?query=" + searchString;
			break;
		case 'Documentation':
			location.href = "/roos/documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=" + searchString;
			break;
	}
	return true;
}

function goSearch5(identifier = null, docs = null, query = null, target = null) {

	var searchPhrase5, start
	if (identifier == null && query == null) {
		searchPhrase5 = window.document.docsSearch5.query5.value.toString();  //ensures numbers will be treated as strings
		start = 1;
	} else if (query != null) {
		searchPhrase5 = query;  //ensures numbers will be treated as strings
		start = 1;
		window.document.search.query.value = query;
	} else {
		searchPhrase5 = $(identifier).data('q');
		start = $(identifier).data('s');
	}

	if (location.href.includes("search.html")) {
		$('#search_concept').text("Web");
	} else if (location.href.includes("json")) {
		$('#search_concept').text("All");
	} else {
		$('#search_concept').text("Documentation");
	}

	if (searchPhrase5 == '') {
		$("#searchFail5").removeClass("hidden");
		window.document.docsSearch5.query5.value = "";
		window.document.docsSearch5.query5.focus();
		return true;
	} else {
		var searchString5 = unescape(searchPhrase5).split("#")[0];
		// if(hasCookie()){
		// 	location.href = "/roos/documentation.nsf/json?searchView&SearchFuzzy=TRUE&Query=" + searchString5;
		// 	return;
		// }else{
		// 	window.history.pushState("search", null, "?query="+searchString5);
		// }

		window.history.pushState("search", null, "?query=" + searchString5);
		var cx = '016663888408278794732:a1ud06__nsq';
		$.get('https://www.googleapis.com/customsearch/v1/', { 'cx': cx, 'q': searchString5, 'start': start, 'key': 'AIzaSyAX2BF1-AFcEvBG6YPZs-6IS0fDFuSF4xo', 'num': 10 },
			function (data, textStatus, jqXHR) {  // success callback
				currentPage = (data.queries.request[0].startIndex - 1) / 10 + 1
				console.log(currentPage);
				console.log(data);
				if (!$("#searchFail5").hasClass("hidden")) {
					$("#searchFail5").addClass("hidden");
				}
				if (target == null) {
					target = '#search-results';
				}
				items = data.items;
				if (docs != null) {
					docsItems = docs.slice((currentPage - 1) * 10, currentPage * 10 - 1);
					items.push(docsItems);
				}
				icon = '<svg style="vertical-align:middle; margin-right:6px;" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-text" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><title>Documentation</title><path d="M4 1h5v1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6h1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"/><path d="M9 4.5V1l5 5h-3.5A1.5 1.5 0 0 1 9 4.5z"/><path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/></svg>';
				html = '<a href="/roos/documentation.nsf/json?searchView&SearchFuzzy=TRUE&Query=' + searchString5 + '"><div class="alert alert-info" role="alert">' + icon + 'Please Sign in to see Documentation search results.</div></a>';
				html += '<div>';
				icon = '<svg style="vertical-align:middle; margin-right:6px;" width="0.8em" height="0.8em" viewBox="0 0 16 16" class="bi bi-globe" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><title>Web Page</title><path fill-rule="evenodd" d="M1.018 7.5h2.49c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5zM2.255 4H4.09a9.266 9.266 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.024 7.024 0 0 0 2.255 4zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm-.5 1.077c-.67.204-1.335.82-1.887 1.855-.173.324-.33.682-.468 1.068H7.5V1.077zM7.5 5H4.847a12.5 12.5 0 0 0-.338 2.5H7.5V5zm1 2.5V5h2.653c.187.765.306 1.608.338 2.5H8.5zm-1 1H4.51a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm1 2.5V8.5h2.99a12.495 12.495 0 0 1-.337 2.5H8.5zm-1 1H5.145c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12zm-2.173 2.472a6.695 6.695 0 0 1-.597-.933A9.267 9.267 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM1.674 11H3.82a13.651 13.651 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm8.999 3.472A7.024 7.024 0 0 0 13.745 12h-1.834a9.278 9.278 0 0 1-.641 1.539 6.688 6.688 0 0 1-.597.933zM10.855 12H8.5v2.923c.67-.204 1.335-.82 1.887-1.855A7.98 7.98 0 0 0 10.855 12zm1.325-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm.312-3.5h2.49a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.91 4a9.277 9.277 0 0 0-.64-1.539 6.692 6.692 0 0 0-.597-.933A7.024 7.024 0 0 1 13.745 4h-1.834zm-1.055 0H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z"/></svg>'; for (i = 0; i < items.length; ++i) {

					if (items[i].content != undefined) {
						content = items[i].content;
					} else {
						content = items[i].htmlSnippet;
					}
					if (content == undefined) {
						break;
					}
					content = content.replace(/(\r\n|\n|\r)/gm, "");
					background = ''
					if (i % 2 == 1) {
						background = 'background-color: aliceblue';
					}

					html += '<div class="result d-xl-flex" style="' + background + '"><div class="col d-flex"><a class="= d-xl-flex align-items-xl-start" href="' + items[i].formattedUrl + '" style="font-size: 20px; display:block;">' + icon + items[i].htmlTitle + '</a><span class="d-xl-flex align-items-xl-end" style="display:block;">' + content + '</span></div></div>';


				}
				html += '</div>'
				html += '<div style="display: flex; justify-content:center; height: 48px; padding-top: 8px; align-items:center; position: relative;"><div style="display: flex; justify-content:center; height: 20px;width: 200px; position: absolute;">'
				if (data.queries.previousPage != undefined) {
					html += '<a class="d-xl-flex justify-content-xl-center" data-q="' + searchString5 + '" data-s="' + data.queries.previousPage[0].startIndex + '" onClick="goSearch5(this, target=target)" href="#" style="padding-right: 5px;padding-left: 5px;"><</a>'
				}

				currentPage = (data.queries.request[0].startIndex - 1) / 10 + 1

				for (i = 1; i <= Math.ceil(data.searchInformation.totalResults / 10) && i <= 10; ++i) {
					startIndex = (i - 1) * 10 + 1;
					if (i == currentPage) {
						html += '<a class="d-xl-flex justify-content-xl-center inactive" data-q="' + searchString5 + '" data-s="' + startIndex + '" style="padding-right: 5px;padding-left: 5px;">' + i + '</a>'

					} else {
						html += '<a class="d-xl-flex justify-content-xl-center" data-q="' + searchString5 + '" data-s="' + startIndex + '" href="#" onClick="goSearch5(this, target=target)" style="padding-right: 5px;padding-left: 5px;">' + i + '</a>'
					}
				}
				if (data.queries.nextPage != undefined && currentPage != 10) {
					html += '<a class="d-xl-flex justify-content-xl-center" data-q="' + searchString5 + '" data-s="' + data.queries.nextPage[0].startIndex + '" onClick="goSearch5(this, target=target)" href="#" style="padding-right: 5px;padding-left: 5px;">></a>'
				}
				html += '</div>'

				html += '</div>'
				html += '<div class="spacer" style="clear: both;"></div>'
				$(target).html(html);
			}
		)
		return true;
	}
} //end function
