//Adding Downloaded videos and App Details scripts

/*var srcAttrval = $('script[src*="Appdetail"]').attr('src');
srcAttrval += new Date().getTime().toString()
;
$('script[src*="Appdetail"]').attr('src', srcAttrval);

srcAttrval = $('script[src*="videodetail"]').attr('src');
srcAttrval += new Date().getTime().toString()
;
$('script[src*="videodetail"]').attr('src', srcAttrval);

srcAttrval = $('script[src*="VideoPath"]').attr('src');
srcAttrval += new Date().getTime().toString()
;
$('script[src*="VideoPath"]').attr('src', srcAttrval);

srcAttrval = $('script[src*="customscript.js"]').attr('src');
srcAttrval += new Date().getTime().toString()
;
$('script[src*="customscript.js"]').attr('src', srcAttrval);

$("head").append('<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" /> <meta http-equiv="Pragma" content="no-cache" /> <meta http-equiv="Expires" content="0" />'); 
*/
//End Downloaded videos and App Details scripts

var isOnline;
var is_iOS = navigator.userAgent.indexOf("Mac OS") > 0;
var videoLoaction = typeof videoPath != "undefined" ? videoPath : is_iOS ? "" : "/data/data/com.msd.professionalChinese/files/downloadvideos";
var videoThumbnailPath = is_iOS ? videoLoaction.replace("video", "videothumbnail") : videoLoaction.replace("downloadvideos", "imagethumbnails");
var offlinedefaultImage = './Content/Images/no-wifi.png';
var websiteURL = "https://www.msdmanuals.com";
if (typeof downloadedVideos == "undefined")
  downloadedVideos = [];
if (typeof appDetail == "undefined")
  appDetail = "";

/*function resolveAfter5Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('isOnline');
    }, 100);
  });
}
async function checkConnection() {
  var result = resolveAfter5Seconds();
  $.ajax({
    async: false,
    type: 'POST',
    url: 'https://www.google.com',
    dataType: "jsonp",
    success: function (data) {
      alert('success');
    },
    fail: function () {
      alert('fail');
    },
    complete: function (data) {
      isOnline = (data.status === 200);
      //alert("completed - value :" + isOnline);
    }
  });
  
  result = await resolveAfter5Seconds();
  return isOnline;
}*/

window.addEventListener('load', function (e) {
  isOnline = navigator.onLine;
  //alert("load - value :" + isOnline);
}, false);

window.addEventListener('online', function (e) {
  //alert('Online');
  isOnline = true;
  ReplaceImageURLs();
  ReplaceVideoImageURLs();
  //alert(navigator.onLine);
  // Get updates from server.
}, false);

window.addEventListener('offline', function (e) {
  //alert('Offline');
  isOnline = false;
  ReplaceImageURLs();
  ReplaceVideoImageURLs();
  //alert(navigator.onLine);
  // Use offine mode.
}, false);

/*function in_array(array, id) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].toLowerCase() === id.toLowerCase())
      return true;
  }
  return false;
}*/


// Highlight feature
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");

    searchInput.addEventListener("input", search);
    searchInput.addEventListener("keyup", search);
});


function search() {
    let searched = document.getElementById("search").value;
    let container = document.getElementById("testone");

    highlightedElements = [];
    currentHighlightIndex = -1;

    clearHighlight();

    if (searched.length > 1) {    
		
		const escapedSearched = searched.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(?:^|\\W)${escapedSearched}(?:$|\\W)`, "gui");
      
        function markTextInNode(node) {
            const originalText = node.nodeValue;
            const markedText = originalText.replace(re, '<mark>$&</mark>');

            if (markedText !== originalText) 
			{
                const span = document.createElement('span');
                span.innerHTML = markedText;

                node.parentNode.replaceChild(span, node);
                highlightedElements.push(span);
            }
        } 

        const textNodes = getTextNodes(container);
        textNodes.forEach((textNode) => {
            markTextInNode(textNode);
        });

        if (highlightedElements.length > 0) {
            currentHighlightIndex = 0;
            highlightedElements[currentHighlightIndex].scrollIntoView();
            highlightedElements[currentHighlightIndex].focus();
        }
    }
}

function clearHighlight() {
    const markedElements = document.querySelectorAll('mark');
    markedElements.forEach((element) => {
        const parent = element.parentNode;
        parent.replaceChild(document.createTextNode(element.textContent), element);
    });
}

function getTextNodes(element) {
    const textNodes = [];
    const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    
    while (walk.nextNode()) {
        textNodes.push(walk.currentNode);
    }

    return textNodes;
}

 document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("search").addEventListener("keydown", function(e) {
			
           // $("#search").on("keydown", function(event) {
                    if (event.key == "Enter") {
                        event.preventDefault();
                        event.target.blur()
						
						document.getElementById("search").style.display = "none";
						document.getElementById('search').value = '';
						$("#button").removeClass("icon-customcontrol fa-close");
						$("#button").addClass("icon-customcontrol fa-magnifysearch");
						
                        if (highlightedElements.length > 0) {
                            currentHighlightIndex = 0;
                            highlightedElements[currentHighlightIndex].scrollIntoView();
                            highlightedElements[currentHighlightIndex].focus();							
                        }
                    }

               // });

        });
});

function myFunction() {
    var x = document.getElementById("search");
    if (x.style.display === "none") {
        x.style.display = "block";
        $("#button")
            .removeClass("icon-customcontrol fa-magnifysearch");
        $("#button")
            .addClass("icon-customcontrol fa-close");
        $('input:text').attr('placeholder','在页面上查找...');
		
    } else {
        x.style.display = "none";
        $("#button")
            .addClass("icon-customcontrol fa-magnifysearch");
        $("#button")
            .removeClass("icon-customcontrol fa-close");
        resetval();
        clearHighlight();     

    }
}

$(document)
    .ready(function() {
        document.getElementById("search")
            .style.display = "none";
        $("#button")
            .addClass("icon-customcontrol fa-magnifysearch");
    });


function resetval() {
    document.getElementById("search")
        .style.display = "none";
    document.getElementById('search')
        .value = '';
    $("#button")
        .addClass("icon-customcontrol fa-magnifysearch");
}	
		

function in_array(array, id) {
  for (var i = 0; i < array.length; i++) {
    var arrayVal= array[i].toLowerCase();
    var idVal = id.toLowerCase();
	try{
    /*if(is_iOS && 
	(arrayVal.replace(/[\u3000-\u303f]/,"").replace(/[\u3040-\u309f]/,"").replace(/[\u30a0-\u30ff]/,"").replace(/[\uff00-\uff9f]/,"").replace(/[\u4e00-\u9faf]/,"").replace(/[\u3400-\u4dbf]/,"").normalize('NFC')== idVal.replace(/[\u3000-\u303f]/,"").replace(/[\u3040-\u309f]/,"").replace(/[\u30a0-\u30ff]/,"").replace(/[\uff00-\uff9f]/,"").replace(/[\u4e00-\u9faf]/,"").replace(/[\u3400-\u4dbf]/,"").normalize('NFC') 
	|| arrayVal.normalize('NFC') == idVal.normalize('NFC'))){ */
	if(is_iOS && 
	 arrayVal.normalize('NFC') == idVal.normalize('NFC')){
      return true;
    }
    else if (arrayVal === idVal)
      return true;
	}
	catch(e)
	{
		if (e instanceof TypeError) {
        if(is_iOS && 
	arrayVal.replace(/[\u3000-\u303f]/,"").replace(/[\u3040-\u309f]/,"").replace(/[\u30a0-\u30ff]/,"").replace(/[\uff00-\uff9f]/,"").replace(/[\u4e00-\u9faf]/,"").replace(/[\u3400-\u4dbf]/,"")== idVal.replace(/[\u3000-\u303f]/,"").replace(/[\u3040-\u309f]/,"").replace(/[\u30a0-\u30ff]/,"").replace(/[\uff00-\uff9f]/,"").replace(/[\u4e00-\u9faf]/,"").replace(/[\u3400-\u4dbf]/,"").replace(/[\u0400-\u04ff]/,"").replace(/[\u0500-\u052f]/,"").replace(/[\u2de0-\u2dff]/,"")){
		return true;
	}
		}
	}
  }
  return false;
}

function GetVideoURL(video) {
  //return "file:\\C:\\inetpub\\wwwroot\\Test\\education-404.mp4";
var videoTitle = video.Title();
  //videoTitle = is_iOS ? videoTitle : videoTitle.replace(/[@"!~`@#$%^&*--+();:={},.<>?、：・（）-\\/\"\'\[\]]/gi, '');
  videoTitle =  videoTitle.replace(/[@"!~`@#$%^&*--+();:={},.<>?\、\：\・\（\）\-\\/\"\'\[\]]/gi, '');
  var isVideoAvailable = in_array(downloadedVideos, videoTitle);
  videoTitle = is_iOS ? video.Title() : videoTitle;
 
  if (isVideoAvailable) {
    return video.parentContext.clearIframeSrc() ? "" : videoLoaction + '/' + videoTitle + ".mp4";
  } else {
    if (isOnline) {      
      return (video.parentContext.clearIframeSrc() ? "" : "https://players.brightcove.net/3850378299001/" + video.PlayerId() + "/index.html?videoId=" + video.VideoId());
    } else {
      if ($(".multimedia__video--wrapper").length == 1) {
        $(".multimedia__video--wrapper").css("height", "100%");
      }
      return video.parentContext.clearIframeSrc() ? "" : "./neterror.htm";
    }
  }
}

function ReplaceVideoImageURLs() {
  $('div.inlinemedia--video .inlinemedia__content img').each(function (i, obj) {
    ProcessVideoImageURLs(i, obj);
  });
  $('div.inlinemedia--slider .slick-track .inlinemedia__figure img').each(function (i, obj) {
    ProcessVideoImageURLs(i, obj);
  });
}

function ProcessVideoImageURLs(i, obj) {
  var imgTitle = $(obj).attr('alt');
  //var withoutSplCharimgTitle = is_iOS ? imgTitle : imgTitle.replace(/[^\w\s]/gi, '');
  //var withoutSplCharimgTitle = is_iOS ? imgTitle : imgTitle.replace(/[@"!~`@#$%^&*--+();:={},.<>?、：・（）-\\/\"\'\[\]]/gi, '');
  if (!imgTitle == "undefined") {
  var withoutSplCharimgTitle = imgTitle.replace(/[@"!~`@#$%^&*--+();:={},.<>?\、\：\・\（\）\-\\/\"\'\[\]]/gi, '');
  var isdwnVideos = in_array(downloadedVideos, withoutSplCharimgTitle);
  if (isdwnVideos) {
    $(obj).attr('src', videoThumbnailPath + '/' + imgTitle + ".jpg");
  } else {
    if (typeof isOnline == "undefined")
      isOnline = navigator.onLine;
    if (!isOnline) {
      var src = $(obj).attr('src');
if(src.indexOf("brightcove") >= 0){
      $(obj).attr('src', offlinedefaultImage);
      $(obj).attr('data-src', src);
      $(obj).next().hide();
}
    } else {
      var preSrc = $(obj).data('src');
      if (preSrc != undefined && preSrc != "" && preSrc != $(obj).attr('src')) {
if(preSrc.indexOf("brightcove") >= 0){
        $(obj).attr('src', preSrc);
        $(obj).removeAttr('data-src');
        $(obj).next().show();
}
      }
    }
  }
  }
}

function ReplaceImageURLs() {
  $('img').each(function () {
    
    if ($(this).parents().find('div.modaldialog__media--wrapper').length > 0)
      return;
    Processreplaceimages($(this));
  });
}

function ReplacePopThumbnailImages()
{
	$("div.modalcarousel__item--wrapper img").each(function(){
		Processreplaceimages($(this));
	});
}

function Processreplaceimages(obj){
	var srcpath = $(obj).attr('src');
    if (srcpath === undefined || (srcpath != undefined && (srcpath.indexOf("brightcove") >= 0 || srcpath.indexOf("Redesign") >= 0)))
      return;
	  

    if (srcpath.indexOf("/-/media") >= 0) {
      srcpath = srcpath.replace("/-/media", "/~/media");
    }
    var isAbsolute = new RegExp('^([a-z]+://|//)', 'i');
    if (!isAbsolute.test(srcpath)) {
      if (srcpath.indexOf("./") == -1) {
        srcpath = '.' + srcpath;
        $(obj).attr('src', srcpath);
      }
    }
    

    if (appDetail == "Min") {
      if (isOnline) {
        var objsrc = $(obj).data('src') != undefined && $(obj).data('src') != "" ? $(obj).data('src') : srcpath;
        var onlinePath = objsrc.indexOf("./~/") == 0 ? websiteURL + objsrc.replace('./~/', '/-/') : objsrc;
        $(obj).attr('src', onlinePath);
        $(obj).attr('data-src', srcpath);
      } else {
        var preSrc = $(obj).attr('src');
        $(obj).attr('src', offlinedefaultImage);
        $(obj).attr('data-src', preSrc);
      }
    }
}



$(document).ready(function () {
  //online();  
  //$("#image-player-template").load("./image-player-template.html");
  $(".resolvedDrug").unbind();
  $(".resolvedDrug").toggleClass('resolvedDrug resolvedDrugChd')
  $(".LexicompLink_active").unbind();

  if (typeof isOnline == "undefined")
    isOnline = navigator.onLine;
  websiteURL = $("#landingPageUrl").val() != "" && $("#landingPageUrl").val() != undefined ? $("#landingPageUrl").val() : websiteURL;

  setTimeout(function () {
    $(document).trigger('afterready');
  }, 1);
});
$(document).bind('afterready', function () {



  setTimeout(function () {
$('div.loading').remove();
if($(this).width() >=1024 && $(".inlinemedia--slider").length > 0)
	{
		$(".inlinemedia--slider").inlineMedia().init();
	}
        ReplaceImageURLs();
        ReplaceVideoImageURLs();
    
$('a[href*="drug"]').each(function(i,obj){$(this).replaceWith($(this).text())});
  

    /* var hash = window.location.hash;
    var uniqID = hash.replace('#', '');
    if (hash != "" && window.location.href.indexOf('?src=') > 0) {
      MManual.MultimediaPopupViewModel.showPopup({
        item: ko.mapping.fromJS({
          Title: $(hash).find('.multimedia__link--text:first').text(),
          html: $("#hidden_" + uniqID).html(),
          UniqueId: uniqID,
          ItemId: uniqID,
          MediaType: 'table'
        })
      });
      $('.modaldialog__header--close').remove();
    }
  }, 1000); */
  
  
  var hash = window.location.hash;
    var uniqID = hash.replace('#', '');
    if (hash != "" && window.location.href.indexOf('?src=') > 0) {
      var i = {
        item: ko.mapping.fromJS({
            Title:$(hash).find('.multimedia__link--text:first').text(),
            Html: $("#hidden_" + uniqID).html(),
            MediaType: "table",
            UniqueId: uniqID,
            ItemId: uniqID,
        }),
        options: {
            PopupTitle: "table"
        }
        };
        MManual.Feature.MultimediaPopup.ViewModel.showPopup(i);
      $('.modaldialog__header--close').remove();
    }
  }, 1000);

  /* Overriding Video Player */
  //var videoplayerModel = MManual.VideoPlayerViewModel.createViewModel;
 /* MManual.VideoPlayerViewModel.createViewModel = function (t, i) {
    function u() {
      r.parentContext.detailsAvailable(r.topicsWithResource().length > 0 || r.Description != null && r.Description() != null && r.Description().length > 0 || r.Credits != null && r.Credits() != null && r.Credits().length > 0)
    }
    var r = this;
    var n = MManual;
	ReplacePopThumbnailImages();

    return r.parentContext = ko.contextFor(i.element).$data, $.extend(r, t.item), $.extend(r, n.VideoPlayerDefaultOptions, t.options), r.loadImageUrlWithAjax && void(0), r.IframeSrcComputed = ko.computed(function () {
      //var url = GetVideoURL(r);alert(url);
      return GetVideoURL(r)
    }), r.parentContext.popupTitle(r.genericPopupTitle ? r.MediaNameTranslated : r.Title), r.parentContext.hideCarousel(r.hideCarousel), r.topicsWithResource = ko.observableArray([]), r.topicsWithResourceLoading = ko.observable(), r.parentContext.displaySingle(r.parentContext.activeList() == null || r.parentContext.activeList().length <= 1 || r.displaySingleItem), r.topicsWithResource.subscribe(u), u(), r.UniqueId && r.parentContext.setShareUrl(r.shareUrlBase, r.UniqueId(), r.Title()), r.loadLocations && n.getTopicsForResource(r.ItemId, r.topicsWithResource, r.topicsWithResourceLoading), n.analytics.notifyOpenModal(r.analyticsType, r.Title()), typeof r.IsRestricted != "undefined" && r.IsRestricted != null && r.parentContext.enableShare(!r.IsRestricted()), r
  }*/
  
  MManual.VideoPlayerViewModel.createViewModel = function(t, i) {
            function u() {
                r.parentContext.detailsAvailable(r.topicsWithResource().length > 0 || r.Description != null && r.Description() != null && r.Description().length > 0 || r.Credits != null && r.Credits() != null && r.Credits().length > 0)
            }
            var r = this;
            var n = MManual;
            ReplacePopThumbnailImages();
            
            return r.parentContext = ko.contextFor(i.element).$data,
            $.extend(r, t.item),
            $.extend(r, n.VideoPlayerDefaultOptions, t.options),
            r.loadImageUrlWithAjax && void (0),
            r.IframeSrcComputed = ko.computed(function() {
                //var url = GetVideoURL(r);alert(url);
            return GetVideoURL(r)
            }),
            r.Credits(decodeURIComponent(r.Credits())),
            r.topicsWithResource = ko.observableArray([]),
            r.topicsWithResourceLoading = ko.observable(),
            r.topicsWithResource.subscribe(u),
            u(),
            r.UniqueId && r.parentContext.setShareUrl(r.shareUrlBase, r.UniqueId(), r.Title()),
            r.loadLocations = n.settings.loadLocationsGlobal || r.loadLocations,
            r.loadLocations && n.getTopicsForResource(r.ItemId, r.topicsWithResource, r.topicsWithResourceLoading),
            n.analytics.notifyOpenModal(r.analyticsType, r.Title()),
            typeof r.IsRestricted != "undefined" && r.IsRestricted != null && r.parentContext.enableShare(!r.IsRestricted()),
            r
        }
  
  
  /* END Overriding Video Player */

  /* Overriding 3D Model Player */
  //var threedplayerModel = MManual.BiodigitalPlayerViewModel.createViewModel;
  MManual.BiodigitalPlayerViewModel.createViewModel = function (t, i) {
    function u() {
      r.parentContext.detailsAvailable(r.topicsWithResource().length > 0 || r.Description != null && r.Description() != null && r.Description().length > 0 || r.Credits != null && r.Credits() != null && r.Credits().length > 0)
    }
    var r = this;
    var n = MManual;
	ReplacePopThumbnailImages();

    r.parentContext = ko.contextFor(i.element).$data;
    $.extend(r, t.item);
    $.extend(r, n.BiodigitalPlayerDefaultOptions, t.options);
    r.IframeSrcComputed = ko.computed(function () {
      return r.parentContext.clearIframeSrc() ? "" : (isOnline ? r.IframeSrc() : './neterror.htm')
    });
    r.parentContext.popupTitle(r.genericPopupTitle ? r.MediaNameTranslated : r.Title);
    r.parentContext.hideCarousel(r.hideCarousel);
    r.topicsWithResource = ko.observableArray([]);
    r.topicsWithResourceLoading = ko.observable();
    r.parentContext.displaySingle(r.parentContext.activeList() == null || r.parentContext.activeList().length <= 1 || r.displaySingleItem);
    r.topicsWithResource.subscribe(u);
    u();
    r.UniqueId && r.parentContext.setShareUrl(r.shareUrlBase, r.UniqueId(), r.Title());
    r.loadLocations && n.getTopicsForResource(r.ItemId, r.topicsWithResource, r.topicsWithResourceLoading);
    r.resizeCallback = null;
    r.attachResizeCallback = function (n) {
      r.resizeCallback = n
    };
    r.parentContext.expandTransitionEnd.subscribe(function () {
      r.resizeCallback && r.resizeCallback()
    });
    r.topicsWithResource.subscribe(function () {
      r.resizeCallback && r.resizeCallback()
    });
    $(window).on("resize", function () {
      r.resizeCallback && r.resizeCallback()
    });
    return n.analytics.notifyOpenModal(r.analyticsType, r.Title()), r
  }
  /* END Overriding 3D Model Player */
  
  
  
  $(document).ready(function() {
 if (typeof ThemeStatus == "undefined")
  ThemeStatus = "";
 if (ThemeStatus == "Dark") {	  
		$(".topic__article").css("background-color", "#000");
		$(".topic__article").css("color", "#FFF");
		$(".topic__explanation").css("background-color", "#000");
		$(".topic__explanation").css("color", "#FFF");		
		$(".para").css("background-color", "#000");
		$(".para").css("color", "#FFF");
		$(".topic__authors").css("color", "#FFF");		
		$(".topic__header__headermodify--title topic__header__headermodify--title--animate").css("color", "#FFF");
		$(".numbered").css("background-color", "#000");
		$(".bulleted").css("background-color", "#000");		
		$(".topic__header--subsection").css("background-color", "#000");
		$(".topic__header--subsection").css("color", "#FFF");
		$(".topic__authors--description").css("color", "#FFF");
		$(".topic__authors--description").css("color", "#FFF");
		$(".topic__content--keypoints").css("background-color", "#000");
		$(".inlinebox__wrapper").css("background-color", "#000");
		$(".multimedia__link--text").css("color", "#FFF");
		// $(".multimedia__link--text").css("color", "#FFF");
		$(".inlinebox__header").css("color", "#FFF");		
		//$(".inlinebox__wrapper").css("color", "#FFF");
		$(".tableWrapper").css("background-color", "#000");
		$(".odd").css("background-color", "#000");
		$(".even").css("background-color", "#000");
		$(".multimedia__title").css("background-color", "#000");
		$(".fixed-header").css("background-color", "#000");
		$(".inlinemedia__title").css("color", "#FFF");
		$(".title").css("color", "#FFF");
		$(".multimedia__image--wrapper h-nocopy").css("background-color", "#000");
		$(".multimedia__video").css("background-color", "#000");
		$(".multimedia__description--wrapper").css("background-color", "#000");
		$(".multimedia__description--wrapper").css("color", "#FFF");
		$(".topic__header__headermodify--title--animate").css("color", "#FFF");
		$(".bottomnav__wrapper").css("background-color", "#000");
		$(".topic__content").css("background-color", "#000");
		$(".bottomnav__linktext").css("color", "#FFF");
		$(".no-fixed-copy").css("background-color", "#000");
		$(".fixed-header").css("background-color", "#000");		
		// $(".TableHalfPage table th td tr").css("color", "#FFF !important");
		$(".inlinebox inlinebox--clickable inlinebox--right").css("background-color", "#000");
		$(".modaltable .TableHalfPage table.fixed-header>thead tr td").css("background-color", "#000");	
		$(".multimedia__iframe").css("background-color", "#000");	
		
		//Abbreviations
		$(".generic-layout__main").css("background-color", "#000");	
		$(".generic-layout__main").css("color", "#FFF");
		$(".generic-layout__header").css("background-color", "#000");	
		$(".generic-layout__subtitle, .generic-layout__title").css("color", "#FFF");
		
		//About
		$(".about__article").css("background-color", "#000");
		$(".about__article--paragraph").css("background-color", "#000");	
		$(".about__article--paragraph").css("color", "#FFF");
		$(".about__article--title").css("background-color", "#000");	
		$(".about__article--title").css("color", "#FFF");
		$(".about__article--heading").css("background-color", "#000");	
		$(".about__article--heading").css("color", "#FFF");
		$(".about__resources").css("background-color", "#000");	
		$(".about__resources").css("color", "#FFF");
		$(".about__box--gray").css("background-color", "#000");	
		// Contributors
		$(".auth_column").css("color", "#FFF");
		$(".author-name").css("color", "#FFF");
		
		//Disclaimer
		$(".footer__top").css("background-color", "#000");	
		$(".footer__note").css("color", "#FFF");
		
		//Terms of use
		$(".l-layer--main").css("background-color", "#000");	
		$(".l-layer--main").css("color", "#FFF");
		//Vaccination schedule
		$(".topic__header--section").css("background-color", "#000");	
	
		$(".modaldialog__content--wrapper").css("background-color", "#000 !important");
		$(".modaldialog").css("color", "#FFF !important");
		
		$(".medCalcBody").css("background-color", "#000 !important");
		//$(".fixed-header").css("background-color", "#000 !important");
		//$(".box--doublebox, .modaltable table>thead td, .modaltable table>thead th").css("background-color", "#000");
		//$(".modaltable table>tbody td").css({"background-color": "yellow"});

		//$(".box--doublebox, .modaltable>table>thead td").css("background-color", "#000 !important");
		$(".chapter").css("background-color", "#000 !important");	
		$(".chapter__heading").css("color", "#FFF !important");
		
		$("p").css("background-color", "#000");
		$("p").css("color", "#FFF");
		$(".topic__accordion h2.topic__header--section").css("background-color", "#174f6d");		
		$(".topic__section").css("color", "#FFF !important");
		$(".about__resources--item").css("color", "#FFF");
		$(".authorbio").css("background-color", "#000 !important");
		$(".authorbio").css("color", "#FFF !important");
		$(".authorbio__article--title").css("color", "#FFF !important");
		$(".author-bio-chapters .author-bio-chapters-list>li .chapter-title .toggle-chapter").css("background-color", "#FFF !important");
		$(".authorbio__detailsbox.authorbio-manual ul li a").css("color", "#FFF !important");
		$(".topic__header--references, .topic__header--subsection").css("font-weight","bold");	
		$(".topic__header--references, .topic__header--subsection").css("font-size","1.40rem");
		$(".authorbio__detailsbox--title").css("color", "#FFF !important");
		$(".authorbio__aside .authorbio-img img").css("background-color", "#000 !important");
		$("body.professional.msd.zh").css("background-color", "#000 !important");
		$(".topic__header__headermodify--subtitle").css("color", "#FFF !important");
		
		$(".authorbio__detailsbox ul li").css("background-color", "#000 !important");
		$(".authorbio__detailsbox ul li").css("color", "#FFF !important");
		
		//Rel 2.2
		$(".about__box--title").css("color", "#FFF !important");
		$(".about__resources--title").css("color", "#FFF !important");
		$(".about__resources--item").css("color", "#FFF !important");
		$(".common-two-coloumn .coloumn-right>*").css("background-color","#000 !important");
		$(".common-page-header .generic-description").css("background-color","#000 !important");
		$(".generic-description").css("background-color","#000 !important");
		$(".health-wellness-wrapper").css("background-color","#000 !important");
		$(".health-wellness-card__inner .health-wellness-card-title").css("color","#FFF !important");
		$(".topic__section.HHead>h2, .topic__section.HHead>h3").css("background-color","#000 !important");
		$(".topic__section.GHead>h2, .topic__section.GHead>h3").css("background-color","#000 !important");
		$(".topic__section.HHead>h2, .topic__section.HHead>h3").css("color", "#FFF !important");
		$(".topic__section .topic-drug-table-header .topic__header--section").css("background-color","#000 !important");
		
		//Search		
		$("input#search").css("background-color", "#000 !important");
		$("input#search").css("color", "#FFF !important");
		//$(".button").css("background-color","#000 !important");
	
		}
 
    });
  

  /* Overriding Table Player */
  MManual.TablePlayerViewModel.createViewModel = function (t, i) {
    function u() {
      r.parentContext.detailsAvailable(r.topicsWithResource().length > 0 || r.Description != null && r.Description() != null && r.Description().length > 0 || r.Credits != null && r.Credits() != null && r.Credits().length > 0)
    }
    var r = this;
    var n = MManual;
	ReplacePopThumbnailImages();

    return r.parentContext = ko.contextFor(i.element).$data, r.tableBody = ko.observable(), r.topicsWithResource = ko.observableArray([]), r.topicsWithResourceLoading = ko.observable(), $.extend(r, t.item), $.extend(r, n.TablePlayerDefaultOptions, t.options),
      setTimeout(function () {
        r.tableBody($("#hidden_" + r.UniqueId()).html())
      }, 800), r.ItemId() && r.loadLocations && n.getTopicsForResource(r.ItemId(), r.topicsWithResource, r.topicsWithResourceLoading), r.UniqueId && r.parentContext.setShareUrl(r.shareUrlBase, r.UniqueId(), r.Title()), r.parentContext.popupTitle(r.genericPopupTitle ? r.MediaNameTranslated : r.Title), r.parentContext.hideCarousel(r.hideCarousel), r.parentContext.displaySingle(r.parentContext.activeList() == null || r.parentContext.activeList().length <= 1 || r.displaySingleItem), r.topicsWithResource.subscribe(u), u(), n.analytics.notifyOpenModal(r.analyticsType, r.Title()), r
  }
  /* END Overriding Table Player */

  /* Start Overriding Podcast Player */
  MManual.PodcastPlayerViewModel.createViewModel = function (t, i) {

    function u() {
      setTimeout(function () {
        if (isOnline) {
          $("audio").mediaelementplayer();
        } else {
          $("div.multimedia__audio--wrapper").prepend('<iframe src="./neterror.htm" style="width:100%;height:100%;border:none;"/>');
        }
      }, 100);
    }
    var r = this;
    var n = MManual;
	ReplacePopThumbnailImages();

    function f() {
      r.parentContext.detailsAvailable(r.topicsWithResource().length > 0 || r.Description != null && r.Description() != null && r.Description().length > 0 || r.Credits != null && r.Credits() != null && r.Credits().length > 0)
    }
    typeof n.AudioPlayerScriptsInitialized == "undefined" ? (n.utils.loadScripts(n.AudioPlayerScripts, u), n.AudioPlayerScriptsInitialized = !0) : u();

    return r.parentContext = ko.contextFor(i.element).$data, $.extend(r, t.item), $.extend(r, n.AudioPlayerDefaultOptions, t.options), r.parentContext.popupTitle(r.genericPopupTitle ? r.MediaNameTranslated : r.Title), r.parentContext.hideCarousel(r.hideCarousel), r.topicsWithResource = ko.observableArray([]), r.topicsWithResourceLoading = ko.observable(), r.parentContext.displaySingle(r.parentContext.activeList() == null || r.parentContext.activeList().length <= 1 || r.displaySingleItem), r.topicsWithResource.subscribe(f), f(), r.UniqueId && r.parentContext.setShareUrl(r.shareUrlBase, r.UniqueId(), r.Title()), r.loadLocations && n.getTopicsForResource(r.ItemId, r.topicsWithResource, r.topicsWithResourceLoading), n.analytics.notifyOpenModal(r.analyticsType, r.Title()), r
  }

  /* End Overriding Podcast Player */

  /* Start Overriding Image Player */
  MManual.ImagePlayerViewModel.createViewModel = function (t, i) {
    function u() {
      r.parentContext.detailsAvailable(r.topicsWithResource().length > 0 || r.Description != null && r.Description() != null && r.Description().length > 0 || r.Credits != null && r.Credits() != null && r.Credits().length > 0)
    }
    var r = this;
    var n = MManual;
    var updatedModel = {
      ItemId: t.item.ItemId(),
      ThumbnailUrl: t.item.ThumbnailUrl(),
      ImageUrl: t.item.ImageUrl(),
      Title: t.item.Title(),
      Description: t.item.Description(),
      Credits: t.item.Credits(),
      MediaType: t.item.MediaType(),
      MediaNameTranslated: t.item.MediaNameTranslated(),
      UniqueId: t.item.UniqueId(),
      IsRestricted: t.item.IsRestricted(),
	  Alt: t.item.Title()
    };
    if (appDetail == "Min") 
	{
		if(updatedModel.ThumbnailUrl.indexOf("https") < 0)
		{
      var url = websiteURL + updatedModel.ThumbnailUrl.replace("./~/media", "/-/media");
      url = url.substring(0, url.indexOf('?'));
      updatedModel.ThumbnailUrl = isOnline ? url : offlinedefaultImage;
      updatedModel.ImageUrl = isOnline ? url : offlinedefaultImage;
		}
	  ReplacePopThumbnailImages();
    }
    t.item = ko.mapping.fromJS(updatedModel);
    return r.parentContext = ko.contextFor(i.element).$data, $.extend(r, t.item), $.extend(r, n.ImagePlayerDefaultOptions, t.options), r.options = t.options, r.zoom = ko.observable(r.defaultZoom), r.toggleZoom = function() {
      switch (r.zoom()) {
        case "width":
          r.zoom("fit");
          break;
        case "fit":
          r.zoom("width");
          break;
        default:
          r.zoom("fit")
      }
    }, r.pinchZoomActive = ko.observable(!1), r.isZoomed = function(n) {
        r.parentContext.isZoomed(n)
    }, r.imageDimensions = ko.observable({}), r.zoomEnabled = ko.computed(function() {
      return $.isEmptyObject(r.imageDimensions()) ? !1 : r.pinchZoomActive() ? !1 : r.imageDimensions().naturalHeight > r.imageDimensions().parentHeight && r.imageDimensions().naturalHeight / r.imageDimensions().naturalWidth > r.imageDimensions().parentHeight / r.imageDimensions().parentWidth
    }), r.zoomClass = ko.computed(function() {
      return r.pinchZoomActive() ? "multimedia__image--zoompinch" : r.zoomEnabled() ? "multimedia__image--zoom" + r.zoom() : "multimedia__image--zoomfit"
    }), r.parentContext.hideCarousel(r.hideCarousel), r.ShareUrlTitle != null && r.ShareUrlTitle() != null && r.ShareUrlTitle().length > 0 ? r.parentContext.setShareUrlWithTitle(r.shareUrlBase, r.ShareUrlTitle()) : r.UniqueId && r.parentContext.setShareUrl(r.shareUrlBase, r.UniqueId(), r.Title()), r.topicsWithResource = ko.observableArray([]), r.topicsWithResourceLoading = ko.observable(), r.topicsWithResource.subscribe(u), u(), r.loadLocations = n.settings.loadLocationsGlobal || r.loadLocations, r.loadLocations && n.getTopicsForResource(r.ItemId, r.topicsWithResource, r.topicsWithResourceLoading), n.analytics.notifyOpenModal(r.analyticsType, r.Title()), typeof r.IsRestricted != "undefined" && r.IsRestricted != null && r.parentContext.enableShare(!r.IsRestricted()), r
  }
  /* END Overriding Image Player */

/* Start Overriding LabTest Player*/
  MManual.LabTestPlayerViewModel.createViewModel= function (t, i) {
        function u() {
            r.parentContext.detailsAvailable(r.topicsWithResource().length > 0 || r.Description != null && r.Description() != null && r.Description().length > 0 || r.Credits != null && r.Credits() != null && r.Credits().length > 0)
        }
        var r = this;
        var n = MManual;
        return r.parentContext = ko.contextFor(i.element).$data, $.extend(r, t.item), $.extend(r, n.LabTestPlayerDefaultOptions, t.options), r.IframeSrcComputed = ko.computed(function () {
            return r.parentContext.clearIframeSrc() ? "" : r.IframeSrc().replace("/~/media/Manual/","/Content/")
        }), r.parentContext.popupTitle(r.genericPopupTitle ? r.MediaNameTranslated : r.Title), r.parentContext.hideCarousel(r.hideCarousel), r.topicsWithResource = ko.observableArray([]), r.topicsWithResourceLoading = ko.observable(), r.parentContext.displaySingle(r.parentContext.activeList() == null || r.parentContext.activeList().length <= 1 || r.displaySingleItem), r.topicsWithResource.subscribe(u), u(), r.UniqueId && r.parentContext.setShareUrl(r.shareUrlBase, r.UniqueId(), r.Title()), r.loadLocations && n.getTopicsForResource(r.ItemId, r.topicsWithResource, r.topicsWithResourceLoading), r.setIframePrintTarget = function (n) {
            r.parentContext.printTarget = n
        }, n.analytics.notifyOpenModal(r.analyticsType, r.Title()), r
    }
 /* END Overriding LabTest Player */
 
 
 
 /* Start Overriding CalculatorPlayerViewModel Player*/
 MManual.CalculatorPlayerViewModel.createViewModel= function (t, i) {
        function u() {
            r.parentContext.detailsAvailable(r.topicsWithResource().length > 0 || r.Description != null && r.Description() != null && r.Description().length > 0 || r.Credits != null && r.Credits() != null && r.Credits().length > 0)
        }
        var r = this;
        var n = MManual;
		ReplacePopThumbnailImages();
        return r.parentContext = ko.contextFor(i.element).$data, $.extend(r, t.item), $.extend(r, n.CalculatorPlayerDefaultOptions, t.options), r.IframeSrcComputed = ko.computed(function () {
            return r.parentContext.clearIframeSrc() ? "" : r.IframeSrc().replace("/medical-calculators/","./Content/Calcdumps/")
        }), r.parentContext.popupTitle(r.genericPopupTitle ? r.MediaNameTranslated : r.Title), r.parentContext.hideCarousel(r.hideCarousel), r.topicsWithResource = ko.observableArray([]), r.topicsWithResourceLoading = ko.observable(), r.parentContext.displaySingle(r.parentContext.activeList() == null || r.parentContext.activeList().length <= 1 || r.displaySingleItem), r.topicsWithResource.subscribe(u), u(), r.UniqueId && r.parentContext.setShareUrl(r.shareUrlBase, r.UniqueId(), r.Title()), r.loadLocations && n.getTopicsForResource(r.ItemId, r.topicsWithResource, r.topicsWithResourceLoading), r.setIframePrintTarget = function (n) {
            r.parentContext.printTarget = n
        }, n.analytics.notifyOpenModal(r.analyticsType, r.Title()), r
    }
 /* END Overriding CalculatorPlayerViewModel Player */
  
});