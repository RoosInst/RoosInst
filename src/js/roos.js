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

function getEl(selector, root) {
    return (root || document).querySelector(selector);
}

function getEls(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
}

function hideElement(el) {
    if (!el) {
        return;
    }
    el.style.display = 'none';
}

function showElement(el) {
    if (!el) {
        return;
    }
    if (el.style.display === 'none') {
        el.style.display = '';
    }
}

function toggleElementVisibility(el) {
    if (!el) {
        return;
    }
    const style = window.getComputedStyle(el);
    if (style.display === 'none') {
        el.style.display = '';
    } else {
        el.style.display = 'none';
    }
}

function setHTML(target, html) {
    const el = typeof target === 'string' ? getEl(target) : target;
    if (el) {
        el.innerHTML = html;
    }
}

function setText(target, text) {
    const el = typeof target === 'string' ? getEl(target) : target;
    if (el) {
        el.textContent = text;
    }
}

function updateNavbarOnScroll() {
    const navbar = getEl('.navbar');
    if (!navbar) {
        return;
    }
    const hasScrolled = window.scrollY > 50;
    const isWide = window.innerWidth > 991;
    if (hasScrolled) {
        navbar.classList.add('navbar-offset', 'navbar-fixed-top');
        navbar.classList.remove('navbar-static-top');
        document.body.style.paddingTop = isWide ? '70px' : '40px';
    } else {
        navbar.classList.remove('navbar-offset', 'navbar-fixed-top');
        navbar.classList.add('navbar-static-top');
        document.body.style.paddingTop = '0px';
    }
}

window.addEventListener('scroll', updateNavbarOnScroll);
window.addEventListener('resize', updateNavbarOnScroll);

function filterParts() {
    getEls('.product').forEach(showElement);

    const minFreq = parseInt(getEl('#amount')?.value || '0', 10);
    const maxFreq = parseInt(getEl('#amount2')?.value || '0', 10);

    for (let i = 0; i < minFreq; i += 1) {
        getEls("div[data-frequency='" + i + "']").forEach(hideElement);
    }

    const cassini16 = getEl('#cassini16')?.checked;
    const cassini8 = getEl('#cassini8')?.checked;
    const ri7100a = getEl('#ri7100a')?.checked;

    if (cassini16 || cassini8 || ri7100a) {
        getEls('div.product:not([data-model])').forEach(hideElement);
    }
    if (cassini16 && cassini8 && !ri7100a) {
        getEls('div[data-model="ri7100a"]').forEach(hideElement);
    }
    if (cassini16 && !cassini8 && ri7100a) {
        getEls('div[data-model="cassini8"]').forEach(hideElement);
    }
    if (cassini16 && !cassini8 && !ri7100a) {
        getEls('div[data-model="cassini8"]').forEach(hideElement);
        getEls('div[data-model="ri7100a"]').forEach(hideElement);
    }
    if (!cassini16 && cassini8 && ri7100a) {
        getEls('div[data-model="cassini16"]').forEach(hideElement);
    }
    if (!cassini16 && cassini8 && !ri7100a) {
        getEls('div[data-model="cassini16"]').forEach(hideElement);
        getEls('div[data-model="ri7100a"]').forEach(hideElement);
    }
    if (!cassini16 && !cassini8 && ri7100a) {
        getEls('div[data-model="cassini16"]').forEach(hideElement);
        getEls('div[data-model="cassini8"]').forEach(hideElement);
    }

    for (let i = maxFreq; i < 200; i += 1) {
        getEls("div[data-frequency='" + i + "']").forEach(hideElement);
    }
}

function onDocumentReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

function initPlugins() {
    getEls('.tooltip-init').forEach((el) => {
        if (typeof jQuery !== 'undefined') {
            jQuery(el).tooltip();
        }
    });

    getEls('.popover-init').forEach((el) => {
        if (typeof jQuery !== 'undefined') {
            jQuery(el).popover();
        }
    });

    getEls('.show-image').forEach((el) => {
        if (typeof jQuery !== 'undefined') {
            jQuery(el).magnificPopup({ type: 'image' });
        }
    });

    if (typeof jQuery !== 'undefined') {
        jQuery('#section-partners #partners-slider').owlCarousel({
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

        jQuery('#jumbotron-slider').owlCarousel({
            items: 1,
            dots: false,
            loop: false,
            rewind: true,
            nav: true,
            navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],
            autoplay: true,
            autoplayHoverPause: true
        });

        jQuery('#jumbotron-eshop-slider').owlCarousel({
            autoPlay: 5000,
            navigation: true,
            singleItem: true,
            transitionStyle: 'fade',
            navigationText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"]
        });

        jQuery('#portfolio-slider').owlCarousel({
            autoPlay: 5000,
            navigation: true,
            singleItem: true,
            slideSpeed: 500,
            navigationText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"]
        });

        jQuery('#about-us-slider').owlCarousel({
            autoPlay: 5000,
            singleItem: true,
            transitionStyle: 'fade'
        });

        jQuery('#testimonials-slider').owlCarousel({
            autoPlay: 5000,
            singleItem: true,
            transitionStyle: 'fadeUp'
        });

        jQuery('#features-default-carousel #owl-carousel-default').owlCarousel({
            stopOnHover: true,
            autoPlay: 5000,
            navigation: true,
            singleItem: true,
            slideSpeed: 500,
            transitionStyle: 'fade',
            navigationText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"]
        });

        jQuery('#features-fade-carousel #owl-carousel-fade').owlCarousel({
            autoPlay: 5000,
            navigation: true,
            singleItem: true,
            transitionStyle: 'fade',
            navigationText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"]
        });

        jQuery('#features-owl-carousel #carousel-wrapper').owlCarousel({
            autoPlay: 3000,
            items: 4,
            itemsDesktop: [1199, 3],
            itemsDesktopSmall: [991, 2]
        });

        getEls('.owl-carousel.hidden-control').forEach((el) => {
            el.addEventListener('mouseenter', () => {
                const prev = el.querySelector('.owl-prev');
                const next = el.querySelector('.owl-next');
                if (prev) {
                    prev.style.transition = 'opacity 0.3s, left 0.3s';
                    prev.style.opacity = '1';
                    prev.style.left = '20px';
                }
                if (next) {
                    next.style.transition = 'opacity 0.3s, right 0.3s';
                    next.style.opacity = '1';
                    next.style.right = '20px';
                }
            });
            el.addEventListener('mouseleave', () => {
                const prev = el.querySelector('.owl-prev');
                const next = el.querySelector('.owl-next');
                if (prev) {
                    prev.style.transition = 'opacity 0.3s, left 0.3s';
                    prev.style.opacity = '0';
                    prev.style.left = '40px';
                }
                if (next) {
                    next.style.transition = 'opacity 0.3s, right 0.3s';
                    next.style.opacity = '0';
                    next.style.right = '40px';
                }
            });
        });

        getEls('.catalogCategoriesSlider').forEach((slider) => {
            jQuery(slider).owlCarousel({
                autoplayTimeout: 4000,
                autoplay: true,
                responsive: {
                    0: { items: 1 },
                    767: { items: 2 },
                    992: { items: 3 },
                    1200: { items: 4 }
                },
                rewind: jQuery(slider).find('img').length > 4,
                autoplayHoverPause: true,
                nav: true,
                navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],
                dots: true,
                lazyLoad: true
            });
        });

        if (getEl('#eshop-slider') && getEls('#eshop-slider .item img').length > 0) {
            jQuery('#eshop-slider').owlCarousel({
                autoplayHoverPause: true,
                autoplayTimeout: 2500,
                autoplay: true,
                items: sliderNumProduct(getEls('#eshop-slider .item img').length),
                rewind: true,
                margin: 3
            });
        }
    }
}

function replaceTitleAttributes() {
    const elements = document.querySelectorAll('abbr[title]');
    for (let i = 0; i < elements.length; i += 1) {
        elements[i].setAttribute('data-title', elements[i].title);
        elements[i].removeAttribute('title');
    }
}

onDocumentReady(function () {
    updateNavbarOnScroll();

    getEls("a.scroll[href^='#']").forEach((link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const hash = this.hash;
            const target = getEl(hash);
            if (!target) {
                return;
            }
            const y = target.getBoundingClientRect().top + window.scrollY - 110;
            window.scrollTo({ top: y, behavior: 'smooth' });
            history.pushState(null, '', hash);
        });
    });

    getEl('#reset-password-toggle')?.addEventListener('click', () => {
        toggleElementVisibility(getEl('#reset-password'));
    });

    getEls('.addtocart').forEach((el) => {
        el.addEventListener('click', () => {
            getEl('#eshop-cart-alert')?.classList.toggle('active');
        });
    });

    getEl('#eshop-cart-alert .close')?.addEventListener('click', () => {
        getEl('#eshop-cart-alert')?.classList.toggle('active');
    });

    getEl('#billing-address-toggle')?.addEventListener('click', () => {
        toggleElementVisibility(getEl('#billing-address'));
    });

    replaceTitleAttributes();

    (function () {
        const cx = '016663888408278794732:a1ud06__nsq';
        const gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') +
            '//cse.google.com/cse.js?cx=' + cx;
        const s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
    })();

    const username = Cookies.get('username');
    if (username) {
        const usernameEl = getEl('#username');
        if (usernameEl) {
            usernameEl.innerHTML = "<i class='fa fa-user'></i>" + username;
        }
        getEl('#logout')?.classList.remove('hidden');
        getEl('#newuser')?.classList.add('hidden');
    }

    getEl('#docSearchButton')?.addEventListener('click', goSearch);
    getEl('#docSearchButton2')?.addEventListener('click', goSearch2);
    getEl('#docSearchButton3')?.addEventListener('click', goSearch3);
    getEl('#docSearchButton4')?.addEventListener('click', goSearch4);

    const imgNumProduct = getEls('#productImg img').length - 1;
    const sourceLinkEl = getEl('#eshop-slider img:first-child');
    const sourcelink = sourceLinkEl ? sourceLinkEl.getAttribute('src') : '';
    const productDetailImage = getEl('#product-detail-image');
    const productDetailImageLink = getEl('#product-detail-image-link');

    if (imgNumProduct <= 0) {
        if (productDetailImage) {
            productDetailImage.src = '/images/no-image-available.png';
        }
        if (productDetailImageLink) {
            productDetailImageLink.href = '#';
        }
    } else {
        if (productDetailImage) {
            productDetailImage.src = sourcelink;
        }
        if (productDetailImageLink) {
            productDetailImageLink.href = sourcelink;
        }
    }

    if (imgNumProduct > 1) {
        getEls('img').forEach((img) => {
            img.classList.add('img-responsive', 'centerImg');
        });
        getEls('#eshop-slider img').forEach((img) => {
            const parent = img.parentNode;
            if (parent && parent.classList.contains('item')) {
                return;
            }
            const wrapper = document.createElement('div');
            wrapper.className = 'item';
            if (parent) {
                parent.insertBefore(wrapper, img);
                wrapper.appendChild(img);
            }
        });
    }

    function sliderNumProduct(count) {
        return count <= 4 ? count : 4;
    }

    if (imgNumProduct > 1) {
        getEls('#eshop-slider .item img').forEach((img) => {
            img.addEventListener('mouseenter', () => {
                const source = img.getAttribute('src');
                if (productDetailImage && source) {
                    productDetailImage.src = source;
                }
                if (productDetailImageLink && source) {
                    productDetailImageLink.href = source;
                }
            });
        });
    } else {
        getEl('#eshop-slider')?.remove();
    }

    if (imgNumProduct <= 4) {
        getEls('.owl-controls').forEach((el) => el.remove());
    }

    initPlugins();
});

function logout() {
    Cookies.remove('username');
    const usernameEl = getEl('#username');
    if (usernameEl) {
        usernameEl.innerHTML = "<i class='fa-solid fa-lock'></i> Sign in";
    }
    getEl('#logout')?.classList.add('hidden');
    getEl('#newuser')?.classList.remove('hidden');
}

function goSearch() {
    const docSearch = window.document.docsSearch;
    const searchPhrase = docSearch.query.value.toString();
    if (searchPhrase === '') {
        getEl('#searchFail')?.classList.remove('hidden');
        docSearch.query.value = '';
        docSearch.query.focus();
        return true;
    }
    const searchString = '/roos/Documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=' + encodeURI(searchPhrase);
    getEl('#searchFail')?.classList.add('hidden');
    docSearch.query.value = '';
    location.href = searchString;
    return true;
}

function goSearch2() {
    const docSearch2 = window.document.docsSearch2;
    const searchPhrase2 = docSearch2.query2.value.toString();
    if (searchPhrase2 === '') {
        getEl('#searchFail2')?.classList.remove('hidden');
        docSearch2.query2.value = '';
        docSearch2.query2.focus();
        return true;
    }
    const searchString2 = '/roos/Documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=' + encodeURI(searchPhrase2);
    getEl('#searchFail2')?.classList.add('hidden');
    docSearch2.query2.value = searchPhrase2;
    location.href = searchString2;
    return true;
}

function goSearch3() {
    const docSearch3 = window.document.docsSearch3;
    const searchPhrase3 = docSearch3.query3.value.toString();
    if (searchPhrase3 === '') {
        getEl('#searchFail3')?.classList.remove('hidden');
        docSearch3.query3.value = '';
        docSearch3.query3.focus();
        return true;
    }
    const searchString3 = '/roos/Documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=' + encodeURI(searchPhrase3);
    getEl('#searchFail3')?.classList.add('hidden');
    docSearch3.query3.value = '';
    location.href = searchString3;
    return true;
}

function goSearch4() {
    const docSearch4 = window.document.docsSearch4;
    const docSearch = window.document.docsSearch;
    const searchPhrase4 = docSearch4.query.value.toString();
    if (searchPhrase4 === '') {
        getEl('#searchFail4')?.classList.remove('hidden');
        docSearch4.query.value = '';
        docSearch4.query.focus();
        return true;
    }
    const searchString4 = '/roos/Documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=' + encodeURI(searchPhrase4);
    getEl('#searchFail4')?.classList.add('hidden');
    docSearch4.query.value = searchPhrase4;
    docSearch.query.value = searchPhrase4;
    getEl('#documentSearch')?.classList.add('active');
    location.href = searchString4;
    return true;
}

function hasCookie() {
    const str = document.cookie.split('; ');
    const result = {};
    for (let i = 0; i < str.length; i += 1) {
        const cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }
    return result.username != null;
}

function doSearch5() {
    const docSearch5 = window.document.docsSearch5;
    const searchPhrase5 = docSearch5.query5.value.toString();
    if (searchPhrase5 === '') {
        getEl('#searchFail5')?.classList.remove('hidden');
        docSearch5.query5.value = '';
        docSearch5.query5.focus();
        return true;
    }
    const searchString5 = encodeURI(searchPhrase5).split('#')[0];
    location.href = '/search.html?query=' + decodeURI(searchString5);
    return;
}

function searchModal() {
    const searchString = encodeURI(window.document.modalSearch.query.value);
    const concept = getEl('#search_concept_modal')?.textContent;
    switch (concept) {
        case 'All':
            location.href = '/roos/Documentation.nsf/json?searchView&SearchFuzzy=TRUE&Query=' + searchString;
            break;
        case 'Web':
            location.href = '/search.html?query=' + searchString;
            break;
        case 'Documentation':
            location.href = '/roos/Documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=' + searchString;
            break;
    }
    return true;
}

function searchBar() {
    const searchString = encodeURI(window.document.search.query.value);
    const concept = getEl('#search_concept')?.textContent;
    switch (concept) {
        case 'All':
            location.href = '/roos/Documentation.nsf/json?searchView&SearchFuzzy=TRUE&Query=' + searchString;
            break;
        case 'Web':
            location.href = '/search.html?query=' + searchString;
            break;
        case 'Documentation':
            location.href = '/roos/Documentation.nsf/webDocs?searchView&SearchFuzzy=TRUE&Query=' + searchString;
            break;
    }
    return true;
}

function goSearch5(identifier = null, docs = null, query = null, target = null) {
    let searchPhrase5;
    let start;
    if (identifier == null && query == null) {
        const docSearch5 = window.document.docsSearch5;
        searchPhrase5 = docSearch5.query5.value.toString();
        start = 1;
    } else if (query != null) {
        searchPhrase5 = query;
        start = 1;
        window.document.search.query.value = query;
    } else {
        searchPhrase5 = identifier.dataset.q;
        start = identifier.dataset.s;
    }

    const searchConceptEl = getEl('#search_concept');
    if (location.href.includes('search.html')) {
        if (searchConceptEl) {
            searchConceptEl.textContent = 'Web';
        }
    } else if (location.href.includes('json')) {
        if (searchConceptEl) {
            searchConceptEl.textContent = 'All';
        }
    } else {
        if (searchConceptEl) {
            searchConceptEl.textContent = 'Documentation';
        }
    }

    if (!searchPhrase5) {
        getEl('#searchFail5')?.classList.remove('hidden');
        window.document.docsSearch5.query5.value = '';
        window.document.docsSearch5.query5.focus();
        return true;
    }

    const searchString5 = decodeURI(searchPhrase5).split('#')[0];
    window.history.pushState('search', null, '?query=' + searchString5);

    const cx = '016663888408278794732:a1ud06__nsq';
    const url = new URL('https://www.googleapis.com/customsearch/v1/');
    url.searchParams.set('cx', cx);
    url.searchParams.set('q', searchString5);
    url.searchParams.set('start', start);
    url.searchParams.set('key', 'AIzaSyAX2BF1-AFcEvBG6YPZs-6IS0fDFuSF4xo');
    url.searchParams.set('num', '10');

    fetch(url.toString())
        .then((res) => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        })
        .then((data) => {
            const currentPage = (data.queries.request[0].startIndex - 1) / 10 + 1;
            const failEl = getEl('#searchFail5');
            failEl?.classList.add('hidden');

            let items = data.items || [];
            if (docs != null) {
                const docsItems = docs.slice((currentPage - 1) * 10, currentPage * 10 - 1);
                items = items.concat(docsItems);
            }

            let icon = '<svg style="vertical-align:middle; margin-right:6px;" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-text" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><title>Documentation</title><path d="M4 1h5v1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6h1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"/><path d="M9 4.5V1l5 5h-3.5A1.5 1.5 0 0 1 9 4.5z"/><path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/></svg>';
            let html = '<a href="/roos/Documentation.nsf/json?searchView&SearchFuzzy=TRUE&Query=' + searchString5 + '"><div class="alert alert-info" role="alert">' + icon + 'Include Documentation in search results.</div></a>';
            html += '<div>';
            icon = '<svg style="vertical-align:middle; margin-right:6px;" width="0.8em" height="0.8em" viewBox="0 0 16 16" class="bi bi-globe" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><title>Web Page</title><path fill-rule="evenodd" d="M1.018 7.5h2.49c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5zM2.255 4H4.09a9.266 9.266 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.024 7.024 0 0 0 2.255 4zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm-.5 1.077c-.67.204-1.335.82-1.887 1.855-.173.324-.33.682-.468 1.068H7.5V1.077zM7.5 5H4.847a12.5 12.5 0 0 0-.338 2.5H7.5V5zm1 2.5V5h2.653c.187.765.306 1.608.338 2.5H8.5zm-1 1H4.51a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm1 2.5V8.5h2.99a12.495 12.495 0 0 1-.337 2.5H8.5zm-1 1H5.145c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12zm-2.173 2.472a6.695 6.695 0 0 1-.597-.933A9.267 9.267 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM1.674 11H3.82a13.651 13.651 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm8.999 3.472A7.024 7.024 0 0 0 13.745 12h-1.834a9.278 9.278 0 0 1-.641 1.539 6.688 6.688 0 0 1-.597.933zM10.855 12H8.5v2.923c.67-.204 1.335-.82 1.887-1.855A7.98 7.98 0 0 0 10.855 12zm1.325-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm.312-3.5h2.49a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.91 4a9.277 9.277 0 0 0-.64-1.539 6.692 6.692 0 0 0-.597-.933A7.024 7.024 0 0 1 13.745 4h-1.834zm-1.055 0H8.5V1.077c.67.204 1.335.82 1.887 1.855.173.324.33.682.468 1.068z"/></svg>';
            for (let i = 0; i < items.length; ++i) {
                let content;
                if (items[i].content !== undefined) {
                    content = items[i].content;
                } else {
                    content = items[i].htmlSnippet;
                }
                if (content === undefined) {
                    break;
                }
                content = content.replace(/(\r\n|\n|\r)/gm, '');
                const background = i % 2 === 1 ? 'background-color: aliceblue' : '';
                html += '<div class="result d-xl-flex" style="' + background + '"><div class="col d-flex"><a class="= d-xl-flex align-items-xl-start" href="' + items[i].formattedUrl + '" style="font-size: 20px; display:block;">' + icon + items[i].htmlTitle + '</a><span class="d-xl-flex align-items-xl-end" style="display:block;">' + content + '</span></div></div>';
            }
            html += '</div>';
            html += '<div style="display: flex; justify-content:center; height: 48px; padding-top: 8px; align-items:center; position: relative;"><div style="display: flex; justify-content:center; height: 20px;width: 200px; position: absolute;">';
            if (data.queries.previousPage !== undefined) {
                html += '<a class="d-xl-flex justify-content-xl-center" data-q="' + searchString5 + '" data-s="' + data.queries.previousPage[0].startIndex + '" onClick="goSearch5(this, target=target)" href="#" style="padding-right: 5px;padding-left: 5px;"><</a>';
            }
            for (let i = 1; i <= Math.ceil(data.searchInformation.totalResults / 10) && i <= 10; ++i) {
                const startIndex = (i - 1) * 10 + 1;
                if (i === currentPage) {
                    html += '<a class="d-xl-flex justify-content-xl-center inactive" data-q="' + searchString5 + '" data-s="' + startIndex + '" style="padding-right: 5px;padding-left: 5px;">' + i + '</a>';
                } else {
                    html += '<a class="d-xl-flex justify-content-xl-center" data-q="' + searchString5 + '" data-s="' + startIndex + '" href="#" onClick="goSearch5(this, target=target)" style="padding-right: 5px;padding-left: 5px;">' + i + '</a>';
                }
            }
            if (data.queries.nextPage !== undefined && currentPage !== 10) {
                html += '<a class="d-xl-flex justify-content-xl-center" data-q="' + searchString5 + '" data-s="' + data.queries.nextPage[0].startIndex + '" onClick="goSearch5(this, target=target)" href="#" style="padding-right: 5px;padding-left: 5px;">></a>';
            }
            html += '</div>';
            html += '</div>';
            html += '<div class="spacer" style="clear: both;"></div>';
            setHTML(target || '#search-results', html);
        })
        .catch((error) => {
            console.error('Google Custom Search error', error);
        });
    return true;
}
