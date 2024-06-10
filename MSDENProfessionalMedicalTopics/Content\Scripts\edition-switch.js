(function (Merck) {
    Merck.editionswitch = {
        initSwitchLinks: function () {
            $(".editionSwitch").click(function () {
                Merck.editionswitch.makeSwitch(this);
            });
            $(".editionSwitchMobile").click(function () {
                Merck.editionswitch.makeSwitch(this);
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

            Merck.analytics.trigger(Merck.analytics.eventToggleEditions);
            return false;
        },

        makeTopicSwitch: function (switchLink) {
            Merck.editionswitch.makeSwitch(switchLink);
            return false;
        },

};

    $(document).ready(function () {
        Merck.editionswitch.initSwitchLinks();
    });

}(window.Merck = window.Merck || {}));