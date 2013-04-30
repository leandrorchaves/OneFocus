// @TODO Cordava ondeviceready & cordova_in_use
in_cordova = false;
in_dev = true;

if (!in_dev) {
    _lol = function() {
    };
    this.console = {log: _lol, info: _lol, error: _lol, warn: _lol};
}

jQuery(document).ready(function($) {
    _ = {
        body: $('body'),
        wind: $(window),
        doc: $(document)
    };
    of_events.resize();
    _.wind.on('resize', of_events.resize);
    of_events.deviceready();
    _.doc.on('deviceready', of_events.deviceready);
    $('.debug').text(document.URL);
});
of_events = {
    resize: function() {
        _.body.css({
            height: _.body.height()
        });
    },
    deviceready: function() {
        try {
            in_cordova = device;
            console.log('Device ready!');
        } catch (err) {
            console.log('Web ready!');
        }

// Request a play list
        of_playlist.request();
    }
};
of_ajax = {
    get: function(json, query_string) {
        var _default_data = {api_version: 1, test: 'a'};
        var _default = {
// @TODO Send cordava data
// @TODO Error event
            url: 'test.json',
            dataType: 'json',
            cache: false,
            data: $.extend(_default_data, query_string),
            success: function(data) {
                this.success(data);
            }.bind(this)
        };
        var settings = $.extend(_default, json);
        $.ajax(settings);
    },
    success: function(data) {
        console.log('AJAX received with success', data);
        $.each(data, function(i, j) {
            switch (i) {
                case 'playlist':
                    console.log('Playlist received via AJAX', j);
                    of_playlist.register(j);
                    break;
            }
        });
        console.log('Fim do each');
    }
};
of_settings = {
    open: function() {
        _.body.addClass('in_settings');
    },
    close: function() {
        _.body.removeClass('in_settings');
    }
};
