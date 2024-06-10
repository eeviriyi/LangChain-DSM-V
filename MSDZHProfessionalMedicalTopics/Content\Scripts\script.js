window.Modernizr = function (a, b, c) { function z(a) { j.cssText = a } function A(a, b) { return z(m.join(a + ";") + (b || "")) } function B(a, b) { return typeof a === b } function C(a, b) { return !!~("" + a).indexOf(b) } function D(a, b) { for (var d in a) { var e = a[d]; if (!C(e, "-") && j[e] !== c) return b == "pfx" ? e : !0 } return !1 } function E(a, b, d) { for (var e in a) { var f = b[a[e]]; if (f !== c) return d === !1 ? a[e] : B(f, "function") ? f.bind(d || b) : f } return !1 } function F(a, b, c) { var d = a.charAt(0).toUpperCase() + a.slice(1), e = (a + " " + o.join(d + " ") + d).split(" "); return B(b, "string") || B(b, "undefined") ? D(e, b) : (e = (a + " " + p.join(d + " ") + d).split(" "), E(e, b, c)) } var d = "2.8.3", e = {}, f = !0, g = b.documentElement, h = "modernizr", i = b.createElement(h), j = i.style, k, l = {}.toString, m = " -webkit- -moz- -o- -ms- ".split(" "), n = "Webkit Moz O ms", o = n.split(" "), p = n.toLowerCase().split(" "), q = {}, r = {}, s = {}, t = [], u = t.slice, v, w = function (a, c, d, e) { var f, i, j, k, l = b.createElement("div"), m = b.body, n = m || b.createElement("body"); if (parseInt(d, 10)) while (d--) j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), l.appendChild(j); return f = ["&#173;", '<style id="s', h, '">', a, "</style>"].join(""), l.id = h, (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), !!i }, x = {}.hasOwnProperty, y; !B(x, "undefined") && !B(x.call, "undefined") ? y = function (a, b) { return x.call(a, b) } : y = function (a, b) { return b in a && B(a.constructor.prototype[b], "undefined") }, Function.prototype.bind || (Function.prototype.bind = function (b) { var c = this; if (typeof c != "function") throw new TypeError; var d = u.call(arguments, 1), e = function () { if (this instanceof e) { var a = function () { }; a.prototype = c.prototype; var f = new a, g = c.apply(f, d.concat(u.call(arguments))); return Object(g) === g ? g : f } return c.apply(b, d.concat(u.call(arguments))) }; return e }), q.backgroundsize = function () { return F("backgroundSize") }, q.borderradius = function () { return F("borderRadius") }; for (var G in q) y(q, G) && (v = G.toLowerCase(), e[v] = q[G](), t.push((e[v] ? "" : "no-") + v)); return e.addTest = function (a, b) { if (typeof a == "object") for (var d in a) y(a, d) && e.addTest(d, a[d]); else { a = a.toLowerCase(); if (e[a] !== c) return e; b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b } return e }, z(""), i = k = null, function (a, b) { function l(a, b) { var c = a.createElement("p"), d = a.getElementsByTagName("head")[0] || a.documentElement; return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild) } function m() { var a = s.elements; return typeof a == "string" ? a.split(" ") : a } function n(a) { var b = j[a[h]]; return b || (b = {}, i++, a[h] = i, j[i] = b), b } function o(a, c, d) { c || (c = b); if (k) return c.createElement(a); d || (d = n(c)); var g; return d.cache[a] ? g = d.cache[a].cloneNode() : f.test(a) ? g = (d.cache[a] = d.createElem(a)).cloneNode() : g = d.createElem(a), g.canHaveChildren && !e.test(a) && !g.tagUrn ? d.frag.appendChild(g) : g } function p(a, c) { a || (a = b); if (k) return a.createDocumentFragment(); c = c || n(a); var d = c.frag.cloneNode(), e = 0, f = m(), g = f.length; for (; e < g; e++) d.createElement(f[e]); return d } function q(a, b) { b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function (c) { return s.shivMethods ? o(c, a, b) : b.createElem(c) }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + m().join().replace(/[\w\-]+/g, function (a) { return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")' }) + ");return n}")(s, b.frag) } function r(a) { a || (a = b); var c = n(a); return s.shivCSS && !g && !c.hasCSS && (c.hasCSS = !!l(a, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), k || q(a, c), a } var c = "3.7.0", d = a.html5 || {}, e = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, f = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, g, h = "_html5shiv", i = 0, j = {}, k; (function () { try { var a = b.createElement("a"); a.innerHTML = "<xyz></xyz>", g = "hidden" in a, k = a.childNodes.length == 1 || function () { b.createElement("a"); var a = b.createDocumentFragment(); return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined" }() } catch (c) { g = !0, k = !0 } })(); var s = { elements: d.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video", version: c, shivCSS: d.shivCSS !== !1, supportsUnknownElements: k, shivMethods: d.shivMethods !== !1, type: "default", shivDocument: r, createElement: o, createDocumentFragment: p }; a.html5 = s, r(b) }(this, b), e._version = d, e._prefixes = m, e._domPrefixes = p, e._cssomPrefixes = o, e.testProp = function (a) { return D([a]) }, e.testAllProps = F, e.testStyles = w, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + t.join(" ") : ""), e }(this, this.document), function (a, b, c) { function d(a) { return "[object Function]" == o.call(a) } function e(a) { return "string" == typeof a } function f() { } function g(a) { return !a || "loaded" == a || "complete" == a || "uninitialized" == a } function h() { var a = p.shift(); q = 1, a ? a.t ? m(function () { ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1) }, 0) : (a(), h()) : q = 0 } function i(a, c, d, e, f, i, j) { function k(b) { if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) { "img" != a && m(function () { t.removeChild(l) }, 50); for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload() } } var j = j || B.errorTimeout, l = b.createElement(a), o = 0, r = 0, u = { t: d, s: c, e: f, a: i, x: j }; 1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function () { k.call(this, r) }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l)) } function j(a, b, c, d, f) { return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this } function k() { var a = B; return a.loader = { load: j, i: 0 }, a } var l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance" in l.style, s = r && !!b.createRange().compareNode, t = s ? l : n.parentNode, l = a.opera && "[object Opera]" == o.call(a.opera), l = !!b.attachEvent && !l, u = r ? "object" : l ? "script" : "img", v = l ? "script" : u, w = Array.isArray || function (a) { return "[object Array]" == o.call(a) }, x = [], y = {}, z = { timeout: function (a, b) { return b.length && (a.timeout = b[0]), a } }, A, B; B = function (a) { function b(a) { var a = a.split("!"), b = x.length, c = a.pop(), d = a.length, c = { url: c, origUrl: c, prefixes: a }, e, f, g; for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g)); for (f = 0; f < b; f++) c = x[f](c); return c } function g(a, e, f, g, h) { var i = b(a), j = i.autoCallback; i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function () { k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2 }))) } function h(a, b) { function c(a, c) { if (a) { if (e(a)) c || (j = function () { var a = [].slice.call(arguments); k.apply(this, a), l() }), g(a, j, b, 0, h); else if (Object(a) === a) for (n in m = function () { var b = 0, c; for (c in a) a.hasOwnProperty(c) && b++; return b }(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function () { var a = [].slice.call(arguments); k.apply(this, a), l() } : j[n] = function (a) { return function () { var b = [].slice.call(arguments); a && a.apply(this, b), l() } }(k[n])), g(a[n], j, b, n, h)) } else !c && l() } var h = !!a.test, i = a.load || a.both, j = a.callback || f, k = j, l = a.complete || f, m, n; c(h ? a.yep : a.nope, !!i), i && c(i) } var i, j, l = this.yepnope.loader; if (e(a)) g(a, 0, l, 0); else if (w(a)) for (i = 0; i < a.length; i++) j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l); else Object(a) === a && h(a, l) }, B.addPrefix = function (a, b) { z[a] = b }, B.addFilter = function (a) { x.push(a) }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function () { b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete" }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function (a, c, d, e, i, j) { var k = b.createElement("script"), l, o, e = e || B.errorTimeout; k.src = a; for (o in d) k.setAttribute(o, d[o]); c = j ? h : c || f, k.onreadystatechange = k.onload = function () { !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null) }, m(function () { l || (l = 1, c(1)) }, e), i ? k.onload() : n.parentNode.insertBefore(k, n) }, a.yepnope.injectCss = function (a, c, d, e, g, i) { var e = b.createElement("link"), j, c = i ? h : c || f; e.href = a, e.rel = "stylesheet", e.type = "text/css"; for (j in d) e.setAttribute(j, d[j]); g || (n.parentNode.insertBefore(e, n), m(c, 0)) } }(this, document), Modernizr.load = function () { yepnope.apply(window, [].slice.call(arguments, 0)) };

var _lscroll = 0;


function buildSubmenu() {
    //only ie8
    if ($("html").hasClass("no-borderradius")) {
        var sep = $(".item1 .submenu ul li").size();
        if (sep)
            sep = Math.ceil(sep / 3);
        //if (typeof console !== "undefined" || typeof console.log !== "undefined")
        //console.log("SIZE:" + sep);
        if (sep > 5) {
            $(".item1 .submenu ul li").eq((2 * sep)).insertAfter('</ul><ul class="sub-group">');
            $(".item1 .submenu ul li").eq(sep).insertAfter('</ul><ul class="sub-group">');

        }
    }
}

function cookiesScroll() {
    if ($('.cc_banner-wrapper').length > 0) {
        $('header.top').css('margin-top', '70px');
        $('body').css('margin-top', '70px');
        $('.search-panel').css('margin-top', '70px');
    } else {
        $('header.top').css('margin-top', '0');
        $('body').css('margin-top', '0');
    }

    if ($('.top-header-menu').length == 0) {
        $('.search-panel').css('margin-top', '0');
    }
}

function go() {
    $('a.cc_btn.cc_btn_accept_all').click(function () {

        setTimeout(function () {
            cookiesScroll();
        }, 200);
    });
}

function setQuizFontSize() {
    var array = $('.quizz-container h1').text().split(' ');

    for (var i = 0; i < array.length; i++) {
        //console.log(array[i]);

        var number = array[i].length;

        if (number > 15) {
            $('.quizz-container h1').css("font-size", "18px");
        }

        if (number > 18) {
            $('.quizz-container h1').css("font-size", "16px");
        }

        if (number > 20) {
            $('.quizz-container h1').css("font-size", "14px");
        }
    }
}

function setPronunciationStyle() {

    // var pronuncModal = $('.ptables').parent().parent().siblings('.audio-player-modal.media-modal').children('div');
    // var pronuncModalElement  = $('.ptables').parent().parent().siblings('.audio-player-modal.media-modal').children('div').children();

    // //modal
    // pronuncModalElement.css({'height': '100px', 'top': '30%'});
    // //line
    // pronuncModalElement.children().children('.description').children('.line').css('display', 'none');
    // //text
    // pronuncModalElement.children('.description').children('h3').css({'margin': '-16px 0 0 150px', 'font-size': '20px'});

    //modal
    $('.ptables').parent().parent().siblings('.audio-player-modal.media-modal').children('div').children().children('.description').children('h3').css({ 'margin': '-16px 0 0 150px', 'font-size': '20px' })
    //line
    $('.ptables').parent().parent().siblings('.audio-player-modal.media-modal').children('div').children().children('.description').children('.line').css('display', 'none')
    //modal 
    $('.ptables').parent().parent().siblings('.audio-player-modal.media-modal').children('div').children().css({ 'height': '100px', 'top': '30%' })
    //close
    $('.ptables').parent().parent().siblings('.audio-player-modal.media-modal').children().children('a.modal-close').css('top', '31%')
}

function addMenuActions() {
    if (window.innerHeight < 500) {
        $(".megamenu").addClass("short");
        $(".megamenu").css('max-height', (window.innerHeight - 65) + "px");
    }

    if($(".megamenu > ul > li").hasClass("header_hat")){
        $(".megamenu .main-menu").addClass("hasHat");
    }

    $(".megamenu > ul > li").click(function () {
        $(this).toggleClass("show");
        $(".megamenu > ul > li").removeClass("active");
        $(this).addClass("active");
        return true;
    });

    $(".megamenu > ul .header_hat").mouseover(function () {
        $(this).toggleClass("show");
        $(".megamenu > ul .header_hat").removeClass("active");
        $(this).addClass("active");
        return true;
    });

    $(".megamenu > ul .header_hat").mouseout(function () {
        $(this).toggleClass("show");
        $(".megamenu > ul .header_hat").removeClass("active");
        return true;
    });

    $(".mobile-menu a.mobile-nav-link").click(function () {
        if ($(this).is("[href]")) {
            $(".mobile-menu").hide(200);
        } else {
            $(this).toggleClass("show");
            $(this).next().slideToggle(500);
        }
    });
}

function setHatHeader() {
    if ($('header.top.fixed').hasClass('opened')) {
        $('.desktop .main-menu-item.header_hat').show();
    }
}

function bold() {
    $('.submenu.symptoms ul li').last().children().children().css('font-weight', 'bold');
};

setHatHeader();

function hideMenu() {
    $("header.top").removeClass("opened");
}

function tablePopUp() {
    var height = $(Window).height - 100;
    $('.table .table-box.show .TableFullPage table').height(height);
}

function toggleMenu() {

    $("header.top").removeClass("searching");
    $("header.top").toggleClass("opened");

    if ($("header.top").hasClass("opened")) {
        if (window.innerWidth < 720) {
            $("body").addClass("popup");
        }
    } else {
        $("body").removeClass("popup");
    }

    $(".megamenu > ul > li").removeClass("active");
    $(".megamenu > ul > li:first-child").addClass("active");

    return false;
}
function setView() {
    $("body").removeClass("mobile tablet desktop");
    if (window.innerWidth < 720) {
        $("body").addClass("mobile");
    } else if ((window.innerWidth < 1024) || ((window.innerWidth < 1280) && (window.devicePixelRatio > 1))) {
        $("body").addClass("tablet");
    } else {
        if ($("body").hasClass("fixed")) {
            $("body").addClass("tablet");
        } else {
            $("body").addClass("desktop");
            menuHoverDelay();
        }
    }

    cookiesScroll();
    go();
}

function printPopupContent() {
    var item = null;
    $("#printContent").html(" ");
    if ($(".media-modal.show").length > 0)
        item = $(".media-modal.show").first();
    else {
        item = $(".table-box.show").first();
    }

    $("#printContent").append($(item).clone());
    window.print();
}

function checkGenericDrugAttr() {

    $('span.genericDrug').filter(function () { return $(this).attr('data-showrollover').toLowerCase() == "false"; }).each(function (index, element) {

        removeDrugFromDrugTable(element);

        $(element).children('span').removeClass('resolvedDrug');
        $(element).children('span').off();
    });

    redrawResourceTable($('.drugs.in-article ul'));
}

function removeDrugFromDrugTable(drug) {
    var drugName = "";
    if ($(drug).children('span').length > 0) {
        drugName = $(drug).children('span').text();
    } else {
        drugName = $(drug).text();
    }

    if (drugName != "") {
        $('.drugs.in-article ul li:contains("' + drugName + '")').remove();
    }
}

function redrawResourceTable(table) {

    if (tableContainsElement(table) == false) {
        $(table).parent().remove();
        return;
    }

    $(table).find('li:even:gt(0)').attr('class', 'odd');
    $(table).find('li:odd').attr('class', 'even');
}

function tableContainsElement(table) {
    if ($(table).find('li').length > 0)
        return true;

    return false;
}

function openSearch() {
    $("#search-header").show().addClass("search-open");
    $('.header-panel .btn-nav').addClass('submit-search');
}

function closeSearch() {
    $("header.top").removeClass("searching");
    $('.header-panel .btn-nav').removeClass('submit-search');
    $("#search-header").hide();
}

function openMobileSearch() {
    $("#search-header").show().addClass("search-open");
}

function closeMobileSearch() {
    $("#search-header").removeClass("search-open").hide();
}

function loseSearchFocus() {
    $(document).on('blur', "#search-header", function (el) {
        if ($(el.target).val() === "" && $(window).width() > 720) {
            closeSearch();
        }
    });
}
function resetSearch() {
    closeMobileSearch();
    closeSearch();
}
function searchToggle() {
    $(document).on('click', '.header-panel .btn-nav', function (e) {
        if ($("header.top").hasClass("opened")) {
            $("header.top").removeClass("opened");
        }
        $("header.top").toggleClass("searching");
        console.log("Search Toggle");
        if ($("header.top").hasClass("searching")) {
            if ($(window).width() > 720) {
                openSearch();
            } else {
                openMobileSearch();
            }
            $("#search-header").focus();
        } else {
            resetSearch();
        }
    });
}

function toggleFilters() {
    $(document).on('click', ".filters h3", function (e) {
        $(e.target).next('form').slideToggle(200);
        $(this).toggleClass("show");
    });
}

function getRelatedItemsMaxHeight() {
    var $relatedItems = $('.related-items .item');
    var relatedElementHeight = $relatedItems.map(function () {
        return $(this).outerHeight();
    }).get();

    var relatedElementMaxHeight = Math.max.apply(null, relatedElementHeight);

    $relatedItems.height(relatedElementMaxHeight);
}
function doMobileCarousels() {
    if (window.innerWidth <= 720) {
        if (!$(".related-items").hasClass("slick-slider")) {
            var countItems = $(".related-items").children().length;
            var loop;
            if (countItems > 2) {
                loop = "true";
            }
            else {
                loop = "false";
            }
            $(".related-items").slick({ autoplay: true, autoplaySpeed: 15000, dots: true, slide: '.item', adaptiveHeight: true, infinite: loop });
            $(".related-items").height(Math.max.apply(null, $(".related-items .item").map(function () {
                return $(this).height();
            }).get()) + 30 + 'px');
            
        }


        if (!$(".featured-articles").hasClass("slick-slider")) {
            $(".featured-articles").height(Math.max.apply(null, $(".featured-articles li").map(function () {
                return $(this).height();
            }).get()) + 30 + 'px');
            $(".featured-articles").slick({ autoplay: true, autoplaySpeed: 15000, dots: true, slide: 'li', adaptiveHeight: true });
        }
        if (!$(".connect-blocks").hasClass("slick-slider")) {
            $(".connect-blocks").height(Math.max.apply(null, $(".connect-block").map(function () {
                return $(this).height();
            }).get()) + 'px');
            $(".connect-blocks").slick({ autoplay: true, autoplaySpeed: 3500, dots: true });
        }
    } else {
        $(".connect-blocks").unslick();
        $(".featured-articles").height('auto');
        $(".featured-articles").height('auto');
        $(".featured-articles").unslick();
        $(".related-items").height('auto');
        $(".related-items").unslick();
    }
}

function setDesktopSubmenuPosition() {
    var menuHeight = $('.desktop .megamenu').outerHeight();
    var $desktopSubmenu = $('.desktop .megamenu .submenu');
    $desktopSubmenu.css({
        top: menuHeight + 'px'
    });

    var desktopItems = $('.desktop .main-menu > .main-menu-item:not(.header_hat)');
    var elementPosition = 1;
    desktopItems.each(function () {
        var submenu = $(this).children(".submenu");
        if ($(this).hasClass("menuEdge")) {
            if ($(this).hasClass("leftSide")) {
                submenu.css({ left: 0 });
                elementPosition++;
            }
            if ($(this).hasClass("rightSide")) {
                submenu.css({ right: 0 });
                elementPosition++;
            }
            
        }
        else if ($(this).hasClass("itemEdge")) {
            if ($(this).hasClass("leftSide")) {
                submenu.css({ left: $(this).position().left + "px" });
                elementPosition++;
            }
            if ($(this).hasClass("rightSide")) {

                submenu.css({ right: ($('.desktop .main-menu > .main-menu-item:not(.header_hat)').size() - elementPosition) * $(this).outerWidth() });
                elementPosition++;
            }
}
    });
}
function lazyLoad(image) {
    var element;
    if (image) {
        element = image;
        if($(element).hasClass("lazyImage")){
            $(element).unveil(0, function () {
                $(this).css("opacity", "1");
                $(this).removeClass("lazyImage");
            });
        }
    }
    else{
        element = "img.lazyImage"; 
        $(element).unveil(0, function () {
            $(this).css("opacity", "1");
            $(this).removeClass("lazyImage");
        });
    }


}   

    

function setQuizContainerHeight() {
    var $quizWrapper = $('.quiz-wrapper');
    var quizWrapperHeight = $quizWrapper.outerHeight();
    var quizHeaderHeight = $('.quiz-title-container').outerHeight();
    var quizHeaderHeightWithMargin = $('.quiz-title-container').outerHeight({ margin: true });
    var $quizContainer = $('.quiz-container');

    if ($quizWrapper.hasClass("item")) {
        $quizContainer.css({
            height: (quizWrapperHeight - quizHeaderHeight) + 'px'
        });
    } else {
        $quizContainer.css({
            height: (quizWrapperHeight - quizHeaderHeightWithMargin) + 'px'
        });
    }
}
function openMenu() {
    $(this).find('.submenu').css('display', 'block');
};
function closeMenu() {
    $(this).find('.submenu').hide();
};
    
function menuHoverDelay() {
    var $mainMenuItem = $('.main-menu-item');
    if (!$('header.top').hasClass('fixed')) {
        $mainMenuItem.hoverIntent(openMenu, closeMenu);
    }   
}
function removeHoverIntent() {
    var $mainMenuItem = $('.main-menu-item');
    $mainMenuItem.unbind("mouseenter").unbind("mouseleave");
    $mainMenuItem.removeProp('hoverIntent_t');
    $mainMenuItem.removeProp('hoverIntent_s');
}
function setIphoneFixedFix() {
    var pixelRatio = window.devicePixelRatio || 1;
    var iPhone = /iPhone/i.test(navigator.userAgent);
    var iPhone4 = (iPhone && pixelRatio == 2);
    var iPhone5 = /iPhone OS 5_0/i.test(navigator.userAgent);
    if (iPhone5 || iPhone4) {
        /* some ipone ugly hacks */
        $(document)
        .on('focus', 'input', function () {
            $("html").addClass('fixfixed');
            MManual.scroll.saveScroll();
            setTimeout(function () { $(window).scrollTop(0) }, 200);
        })
        .on('blur', 'input', function () {
            $("html").removeClass('fixfixed');
            MManual.scroll.bringScroll();
        });
    }

}

$(document).ready(function () {

    $(".menu-hide-overlay").click(hideMenu);
    setView();
    go();
    addMenuActions();
    doMobileCarousels();
    searchToggle();
    loseSearchFocus();
    getRelatedItemsMaxHeight();
    setQuizContainerHeight();
    setDesktopSubmenuPosition();
    toggleFilters();
    bold();
    setIphoneFixedFix();
    lazyLoad();
    $(window).on("scroll", function () {
        if (window.innerWidth >= 1024) {
            if (($(window).scrollTop() > 146) && ($(document).height() > window.innerHeight + 186)) {
                removeHoverIntent();
                $("header.top").addClass("fixed");
                $(".top-header-menu").hide();
                $("body").addClass("fixed");
                if ($("body").hasClass("desktop")) {
                    $("body").removeClass("desktop");
                    $("body").addClass("tablet");
                }
            } else {
                setView();
                $("header.top").removeClass("fixed");
                $(".top-header-menu").show();
                $("body").removeClass("fixed");
                $("header.top").removeClass("opened");
                setTimeout(setView, 50);
            }
            setDesktopSubmenuPosition();
        }
        else if ($(window).scrollTop() < _lscroll) {
            $("header.top").addClass("fixed");
            $("body").addClass("fixed");
        }
        _lscroll = $(window).scrollTop();
    });

    $(window).on("resize", function () {
        setView();
        doMobileCarousels();
        getRelatedItemsMaxHeight();
        setQuizContainerHeight();
        setDesktopSubmenuPosition();
    });

    $("#content a[href^='http://']").attr("target", "_blank");

    $(document).keydown(function (e) {
        if (e.keyCode == 27) {
            hideMenu();
        }
    });

    setQuizFontSize();

    MManual.lists.makeCollapsable();

    $("#languageSelector").selectbox({
        onOpen: function (inst) {
            //console.log("open", inst);
        },
        onClose: function (inst) {
            //console.log("close", inst);
        },
        onChange: function (val, inst) {
            window.languageSelector.redirect(val);
        },
        effect: "slide"
    });
    $(".globe-icon").prependTo('.sbHolder');

});

setView();

addMenuActions();

function removePreloader(element) {
    $(element).removeClass('has-preloader');
}