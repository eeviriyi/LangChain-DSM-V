$(function () {

    function getOffsetAdjustment() {
        var offsetAdjust = 100;
        var $topHeaderMenu = $(".top-header-menu");
        if ($topHeaderMenu.length && $topHeaderMenu.is(':visible')) {
            offsetAdjust += $topHeaderMenu.height();
        }
        return offsetAdjust;
    }

    $('a[href*=#]:not([href=#])').click(function (e) {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var hashTarget = $(this.hash);
            expandToDestination(hashTarget);
            scrollToDestination(hashTarget);
        }
    });



    function expandToDestination(target) {

        if (target.length) {
            if (window.innerWidth <= 1024) {

                expandHeader(target);

                target.parents(".header")
                    .each(function () {
                        expandHeader($(this));
                    });
            }
            return false;
        }

    };

    function expandHeader(header) {
        if (header.length > 0) {
            $("header", header).addClass("expanded");
            $("div.header-body", header).show();
        }
    }

    function scrollToDestination(target) {
        if (target.length) {
            var destination = $(target).offset().top - getOffsetAdjustment();
            if (window.location.hash == !!window.MSInputMethodContext && !!document.documentMode) {
                destination = destination - 33;
            }
            if ($(target).parent().attr('class') !== "table-box") {
                 $(target).parent().height('auto');
            }
            setTimeout(function () {
                $(window).scrollTop(destination);
                return false;
            },
                20);
        }

    }

    function getHashTarget() {
        var $target = $(window.location.hash);
        $target = $target.length ? $target : $('[name="' + window.location.hash.slice(1) + '"]');
        return $target;
    }

    $(window)
        .load(function () {
            if (window.location.hash) {
                var $target = getHashTarget();
                expandToDestination($target);
                scrollToDestination($target);
            }
            return false;
        });
});