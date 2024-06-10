(function (MManual) {
    MManual.editionSwitch = {
        initSwitchLinks: function () {
            $(".editionSwitch").click(function () {
                MManual.editionSwitch.makeSwitch(this);
            });
            $(".editionSwitchMobile").click(function () {
                MManual.editionSwitch.makeSwitch(this);
            });
        },

        makeSwitch: function (switchLink) {
            var dataId = $(switchLink).attr("data-id");

            $.ajax({
                url: '/Custom/Edition/StoreData',
                type: "POST",
                dataType: "json",
                data: {
                    edition: dataId
                },
                error: function(jqxhr, textStatus, errorThrown) {
                    console.error(errorThrown);
                }
            });
            
            MManual.analytics.trigger(MManual.analytics.eventToggleEditions);
            return false;
        },

        clearSwitch: function (callback) {
            $.ajax({
                url: '/Custom/Edition/ClearData',
                type: "POST",
                complete: callback
            });
        }
    };

    $(document).ready(function () {
        MManual.editionSwitch.initSwitchLinks();
    });

}(window.MManual = window.MManual || {}));