
(function (MManual) {
    MManual.scrollBlock = {
        scrollPosition: 0,
        bringScroll: function () {
            $(window).scrollTop(scrollPosition);
        },

        saveScroll: function () {
            this.scrollPosition = window.scrollX;
        },

    };

}(window.MManual = window.MManual || {}));


function attachTableLinkLogic() {
    $(".TableFullPage a[href*=#], .TableHalfPage a[href*=#]").children().not(".TableFullPage figure a[href*=#],.TableHalfPage figure a[href*=#]").click(function (e) {
        e.preventDefault();

        clickOnLink(this);
    });
}

function clickOnLink(link) {
    var hashInLink = getHashFromUrl(link.href);

    if (checkIfTablesContainsHash(hashInLink)) {
        return;
    }

    if (link.href.indexOf(window.location.href) > -1) {
        window.location.hash = hashInLink;
        window.location.reload(true);
    }
    else {
        window.location.replace(link.href);
    }
}

function getHashFromUrl(url) {
    return $("<a />").attr("href", url)[0].hash;
}

function checkIfTablesContainsHash(hash) {
    if (hash && $('.TableFullPage,.TableHalfPage').has(hash).length > 0) {
        return true;
    }
    return false;
}

function setTableHeight() {
    var tableSize = $("body").height() - 250;
    var footerOffset = $("body").height() - 200;
    var tableModalFull = $(".table-box.show table.TableFullPage tbody");
    var tableModalHalf = $(".table-box.show table.TableHalfPage tbody");

    var tableFooter = $(".table-box.show table tfoot");

    tableModalFull.css('max-height', tableSize);
    tableModalHalf.css('max-height', tableSize);
    tableFooter.css('top', footerOffset);
}

function setFigureTableWidth() {
    $('div.figure img').each(function (index, element) {
        var parent = $(element).closest('.figure')
        if (parent == null) {
            return true;
        }

        var parentWidth = $(parent).width();
        var imgWidth = element.naturalWidth;

        if (imgWidth > parentWidth) {
            $(parent).css("width", "99%");

            var parentWidth = $(parent).width();
            if (parentWidth != 0) {
                $(element).css("max-width", "99%");
            }
            
        }
    });
}


function putTableThumbs() {
    $(".table-thumbprints div").each(function() {
        $("div#"+$(this).data("id")).parent().css("background-image", "url(" + $(this).data("url") + ")").addClass("has-thumb");
    });
}

function helpfulButtonClicked(button) {    
    var val = $(button).attr("data-id");
    $.ajax({
        url: $('#wasThisTopicHelpfulUrl').val(),
        type: "POST",
        dataType: "json",
        data: {
            yesno: val
        },
        success: function (data) {
            $("#helpfulText").html(data);
            $(".helpfulButton").hide();
            
        },
        error: function (jqxhr, textStatus, errorThrown) {
            console.error(errorThrown);
        }
    });
    MManual.analytics.trigger(MManual.analytics.eventRateATopic);
    return false;
}

function getTopicHelpful() {
    var path = window.location.pathname;
    $.ajax({
        url: $('#getTopicHelpfulUrl').val(),
        type: "GET",
        dataType: "json",
        success: function (data) {
            helpfulModel.helpfultext = data;
            ko.applyBindings(helpfulModel, document.getElementById("helpfulSection"));
            $("#helpfulSection").show();
        },
        error: function (jqxhr, textStatus, errorThrown) {
            console.error(errorThrown);            
        }
    });
}

var helpfulModel = {
    helpfultext: ko.observable('')
};

function glossarySubmission() {
    var query = $("#merriam-webmaster-search").val();
    var element = $("#merriam-webmaster-search-button");
    var spanOffset = $(element).offset();
    var pOffset = $(element).parent().offset();

    if (!spanOffset || !pOffset) {
        return;
    }

    var offset = spanOffset.left - pOffset.left;
    var merriamTermPopup = $('.merriamTermPopup');
    var glossaryUnderTretmentSection = $(element).closest('#Treatment').length > 0;
    ko.cleanNode(merriamTermPopup.get(0));
    $.ajax({
        url: '/Custom/Glossary/GetGlossaryData',
        type: 'GET',
        data: { glossaryTerm: query, includeDrugInfo: glossaryUnderTretmentSection },
        dataType: 'json',
        success: function (data) {
            ko.applyBindings(data, merriamTermPopup.get(0));
            $.data(element, 'popupRendered', true);
            merriamTermPopup.show();
        },
        error: function (jqxhr, textStatus, errorThrown) {
        }
    });
}

function merriamWebmasterSearch() {
    if (!window.x) {
        x = {};
    }
    x.Selector = {};
    x.Selector.getSelected = function () {
        var t = '';
        if (window.getSelection) {
            t = window.getSelection();
        } else if (document.getSelection) {
            t = document.getSelection();
        } else if (document.selection) {
            t = document.selection.createRange().text;
        }
        return t;
    }

    $("div.body.topic-content").bind("mouseup", function () {
        $(".merriamTermPopup").hide();
        var mytext = x.Selector.getSelected();
        mytext = mytext.toString();
        if (mytext.length > 0) {
            if (mytext.slice(-1) == " ")
                mytext = mytext.slice(0, -1);
            $("#merriam-webmaster-search").val(mytext);
            glossarySubmission();
        } else {
            $("#merriam-webmaster-search").val("");
        }
    });

    var templateDiv = "<div class=\"merriamTermPopup\" data-bind=\"template: { name:'merriam-template'}\" style=\"display:none;\">merriamTermPopup</div>";
    $(templateDiv).insertAfter('#merriam-webmaster-search-button');

    
    $("#merriam-webmaster-search-button").on('click', glossarySubmission);
    $("#merriam-webmaster-search").on("keypress", function (e) {
        if (e.keyCode == 13) {
            glossarySubmission();
        }
    });
}

function expandHeader(header) {
    $(header).toggleClass('expanded');
    $(header).next(".header-body").slideToggle(200);
}

function expandHeaderFromHistory() {
    if (window.innerWidth > 1024) {
        return;
    }
    var expandedHeaders = MManual.pageStateStore.getPageState();

    if (expandedHeaders == null) {
        return;
    }

    var headers = expandedHeaders.split(","),
    i;

    for (i = 0; i < headers.length; i++) {
        var headerSplitted = headers[i].split('|');
        var headerClass = headerSplitted[0];
        var headerId = headerSplitted[1];

        var headerSelector = 'section.header.' + headerClass + '[id=' + headerId + ']';

        var header = $(headerSelector).find('header');
        expandHeader(header);
    }
}

function protectFigureImages() {
    var protectionCode = $("<div class=\"no-copy\"><img src=\"/Content/Images/no-copy.png\"></div>");
    $(".topic-content .topic-content div.figure img").parent().not(".no-copy").each(function (k, v) {
        if ($(v).has("div.no-copy").length == 0) {
            $(v).append($(protectionCode).clone());
        }
    });
}

function closeMerriam() {
    $(".merriamTermPopup").hide();
}


jQuery(document).ready(function () {
    MManual.Tables.doMeATable();
    checkGenericDrugAttr();
    attachTableLinkLogic();
    merriamWebmasterSearch();

    calculateSticky();

    $("section.header header").click(function () {
        if (window.innerWidth <= 1024) {
            expandHeader(this);

            
            var hHead = $('section.header.HHead > header.expanded').parent()
                .map(function () { return "HHead|" + $(this).attr('id'); }).get().join();
            var fHead = $('section.header.FHead > header.expanded').parent()
                .map(function () { return "FHead|" + $(this).attr('id'); }).get().join();
            
            if (hHead && hHead !== "" && hHead !== undefined) {
                MManual.pageStateStore.updatePageState(hHead);
            }

            if (fHead && fHead !== "" && fHead !== undefined) {
                MManual.pageStateStore.updatePageState(fHead);
            }

        }
    });

    $(".in-article header").click(function () {
        if (window.innerWidth <= 1024) {
            $(this).toggleClass('expanded');
            $(this).next("ul.tab").slideToggle(200);
        }
    });

    $('.toggle-share').click(
        function () {
            $(this).parent().toggleClass("reveal");
        });   

    $(".alsoOfInterestVideoLink").click(function () {
        MManual.videoplayer.show({
            videoId: $(this).attr("data-id"),
            playerId: $(this).attr("data-playerId"),
            title: $(this).text(),
            description: $(this).attr("data-description"),
            summary: $(this).attr("data-summary")
        });
    });
    $(".helpfulButton").click(function () {
        helpfulButtonClicked(this);
    });
    getTopicHelpful();

    $(window).resize(MManual.Tables.refreshAfterScroll);
    $(window).scroll(MManual.Tables.scrollFixedElements);

    $(document).on("click", "a", function (e) {
        if (window.matchMedia('print').matches || $('link[media="screen and print"]').length > 0) {
            e.preventDefault();
            var url = $(this).attr('href');
            window.open(url, '_blank');
        }
    });

    expandHeaderFromHistory();
    protectFigureImages();
});

$(document).ready(function () {
    $('.has-children').click(function () {
        var _li = this;
        $('.topic-subheaders', this).toggle(function () {
            if ($(this).css('display') == 'none') {
                $(_li).removeClass("open");
            } else {
                $(_li).addClass("open");
            }
        });
    });
});

$(window).load(function () {
    setFigureTableWidth();
});
$( window ).resize(function() {
    calculateSticky();
});

function calculateSticky() {
    if (window.innerWidth > 1024) {
        if ($(".sticky-headers").length > 0) {
            var overflowHeader;
            if ($(".sticky-headers").outerHeight() > window.innerHeight - 100) {
                overflowHeader = true;
            } else {
                overflowHeader = false;
            };

            $(function () {

                var $sidebar = $(".sticky-headers"),
                    $window = $(window),
                    offset = $sidebar.offset(),
                    topPadding = 130 + $(".top-header-menu").height(),
                    headersHeight = $(".sticky-headers").outerHeight(),
                    topicHeight = $(".topic-content").height(),
                    headersOfsset = $(".sticky-headers").offset().top,
                    footOffset = 40,
                    headerContent = $(".header-content"),
                    navigationArrow = $(".navigation-arrow-up, .navigation-arrow-down"),
                    navigationArrowUp = $(".navigation-arrow-up"),
                    navigationArrowDown = $(".navigation-arrow-down"),
                    topicHeaders = $(".topic-headers"),
                    navigationShadowUp = $(".navigation-shadow-up"),
                    navigationShadowDown = $(".navigation-shadow-down"),
                    navigationTitle = $(".navigation-title"),
                    scrollOffset = 100;
                var referenceHeight = topicHeight + headersOfsset - headersHeight - topPadding - footOffset;
                if (overflowHeader) {
                    navigationArrow.show();
                    topicHeaders.css({
                        overflow: 'hidden',
                        width: "calc(100% + 16px)"
                    });

                    headerContent.height($(window).outerHeight() - 210 - navigationTitle.height());
                    navigationShadowDown.show();

                    navigationArrowUp.click(function () {
                        headerContent.animate({ scrollTop: headerContent.scrollTop() - scrollOffset }, 300);
                        return false;
                    });

                    navigationArrowDown.click(function () {
                        headerContent.animate({ scrollTop: headerContent.scrollTop() + scrollOffset }, 300);
                        return false;
                    });

                    headerContent.scroll(function () {
                        if (headerContent.scrollTop() == 0) {
                            navigationShadowUp.fadeOut();
                        } else {
                            if (navigationShadowUp.is(":hidden"))
                                navigationShadowUp.fadeIn();
                        }
                        if (headerContent.scrollTop() + headerContent.height() >= topicHeaders.innerHeight()) {
                            navigationShadowDown.fadeOut();
                        } else {
                            if (navigationShadowDown.is(":hidden"))
                                navigationShadowDown.fadeIn();
                        }
                    });

                    $window.scroll(function () {
                        //var scrollPos = $(document).scrollTop();
                        //$(".header-content ul.topic-headers li a").each(function () {
                        //    var currLink = $(this);
                        //    var refElement = $(currLink.attr("href"));
                        //    if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                        //        headerContent.scrollTop(currLink.position().top - (headerContent.height() / 2));
                        //    }
                        //});

                        $('section[id^="v"]').each(function () {
                            var currLink = $(this);
                            var elementId = currLink.attr("id");
                            var refElement = $("[href=#" + elementId + "]");
                            if (refElement.length > 0 && currLink.position().top - $window.scrollTop() >= 0) {
                                headerContent.scrollTop(headerContent.scrollTop() + refElement.position().top - (headerContent.height() / 2));
                                return false;
                            }
                        });

                    });
                }

                $window.scroll(function () {
                    //console.log("windowScrollTop: " + $window.scrollTop() + ", offsetTop: " + offset.top + ", referenceHeight: " + referenceHeight);
                    if ($window.scrollTop() > offset.top) {
                        if ($window.scrollTop() < referenceHeight) {
                            $sidebar.css('marginTop', $window.scrollTop() - offset.top + topPadding);
                        }
                    } else {
                        $sidebar.css('marginTop', 0);
                    }
                });

            });
            //}

        }
    }
}
