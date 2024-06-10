
function init() {
    
    var templateDiv = "<div class=\"glossaryTermPopup\" data-bind=\"template: { name:'glossary-template'}\" style=\"display:none;\">glossaryTermPopup</div>";

    $(templateDiv).insertBefore('.glossaryTerm');

    $(".glossaryTerm").click(function () {

        var element = this;

        var spanOffset = $(element).offset();
        var pOffset = $(element).parent().offset();
        var offset = spanOffset.left - pOffset.left;

        var glossaryTermPopup = $(element).prev('.glossaryTermPopup');

        $(glossaryTermPopup).css('margin-left', offset);               

        if ($.data(element, 'popupRendered') == undefined || $.data(element, 'popupRendered') == false) {

            var glossaryTerm = this.textContent;

            var glossaryUnderTretmentSection = $(element).closest('#Treatment').length > 0;

            $.ajax({
                url: '/Custom/Glossary/GetGlossaryData',
                type: 'GET',
                data: { glossaryTerm: glossaryTerm , includeDrugInfo : glossaryUnderTretmentSection},
                dataType: 'json',
                success: function (data) {

                    ko.applyBindings(data, glossaryTermPopup.get(0));

                    $.data(element, 'popupRendered', true);

                    $(glossaryTermPopup).css('margin-left', offset);

                    //console.log('ajax show');

                    glossaryTermPopup.show();
  
                },
                error: function (jqxhr, textStatus, errorThrown) {
                    //console.error(errorThrown);
                }
            });

        } else {

            if (glossaryTermPopup.is(':visible')) {

                glossaryTermPopup.hide();

            } else {
                //console.log('show2');
                
                $('.glossaryTermPopup2').hide();

                $(glossaryTermPopup).show();

                $(glossaryTermPopup).find('.glossaryTermPopup2').show();
                
                $(glossaryTermPopup).css('margin-left', offset);
            }
        }
    });
}

jQuery(document).ready(function () {

    init();

});

function expandGlossaryDesc(el) {
    $(el).toggleClass('itemSelected fa-plus fa-minus');

    //if ($(el).hasClass === "itemSelected") {
    //    $(el).addClass("fa-minus").removeClass("fa-plus");
    //} else {
    //    $(el).addClass("fa-plus").removeClass("");
    //}

    $(el).next(".definition").toggle();
}

function closeGlossary() {
    $(".glossaryTermPopup").hide();
}