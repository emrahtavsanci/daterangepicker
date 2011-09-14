jQuery.fn.daterangepicker = function(settings) {
    var input = jQuery(this);

    // Daterangepicker defaults
    var options = jQuery.extend({
        presetRanges: [
            {text: 'Yesterday', ranges:[{s: 'today-1days', e: 'today-1days'}]},
            {text: 'Last 7 days', ranges:[{s: 'today-7days', e: 'today'}]},
            {text: 'Compare the two last weeks', ranges:[{s:'today-7days', e:'today'}, {s:'today-15days', e: 'today-8days'}]}
        ],
        presets: {
            singleDate: {title: 'Specific date'},
            singleRange: {title: 'Date range', labels: ['Start date', 'End date']},
            twoRanges: {title: 'Compare ranges', labels: [['DS1', 'DE1'], ['DS2', 'DE2']]}
        },
        doneButtonText: 'Done',
        rangeSplitter: '-',
        rangeSeparator: '|',
        dateFormat: 'm/d/yy',
        closeOnSelect: true,
        posX: input.offset().left,
        posY: input.offset().top + input.outerHeight(),
        appendTo: 'body',
        onClose: function(){},
        onOpen: function(){},
        onChange: function(){},
        datepickerOptions:  null
    }, settings);

    // Custom datepicker options
    var datepickerOptions = {
        onSelect: function() {
            console.debug('Coucou');
        },
        defaultDate: 0
    };
    options.datepickerOptions = (settings) ? jQuery.extend(datepickerOptions, settings.datepickerOptions) : datepickerOptions;


    // Getting data from input
    var ranges = input.val().split(options.rangeSeparator);
    for(var i in ranges) {
        ranges[i] = ranges[i].split(options.rangeSplitter);
        for(var j in ranges[i]) {
            ranges[i][j] = Date.parse(ranges[i][j]);
        }
    }

     /////////////////////////////////////
    // LET'S BUILD THE DATERANGEPICKER //
   /////////////////////////////////////
    var rp = jQuery('<div class="ui-daterangepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" style="display:none"></div>');
    var rpPresets = (function() {
        var ul = jQuery('<ul></ul>').appendTo(rp);
        // PresetRanges
        jQuery.each(options.presetRanges, function() {
            var li = jQuery('<li class="ui-daterangepicker-' + this.text.replace(/ /g, '') + ' ui-corner-all"><a href="#" rel="' + this.rel + '" title="' + this.text + '">' + this.text + '</a></li>').data('ranges', this.ranges);
            ul.append(li);
        });
        // Presets
        jQuery.each(options.presets, function() {
            var li = jQuery('<li class="ui-corner-all"><a href="#" rel="' + this.rel + '" title="' + this.title + '">' + this.title + '</a></li>').data('presetSettings', this);
            ul.append(li);
        });
        return ul;
    })();
	var rpPickersBoxes = jQuery('<div class="ui-ranges ui-widget-header ui-corner-all ui-helper-clearfix" style="display:none"></div>').appendTo(rp);
    var doneBtn = jQuery('<button class="btonDone ui-state-default ui-corner-all">' + options.doneButtonText + '</button>');

     /////////////////////////////////////////
    // LET'S MANAGE DATERANGEPICKER EVENTS //
   /////////////////////////////////////////
    rpPresets.find('li')
        .hover(
            function() {
                jQuery(this).addClass('ui-state-hover');
            },
            function() {
                jQuery(this).removeClass('ui-state-hover');
            })
        .click(function() {
            rp.find('.ui-state-active').removeClass('ui-state-active');
            jQuery(this).addClass('ui-state-active').clickActions(rp, rpPickersBoxes, doneBtn);
            return false;
        });

    jQuery.fn.appendDatepicker = function(title, rel) {
        var picker = jQuery('<div class="ui-daterangepicker-datepicker" rel="' + rel + '"><span>' + title + '</span></div>');
        picker.datepicker(options.datepickerOptions);
        $(this).append(picker);

        return $(this);
    };
    jQuery.fn.clickActions = function(rp, rpPickersBoxes, doneBtn) {
        if($(this).data('ranges')) {
            var r = $(this).data('ranges'), t = [];
            for(var i in r) {
                var s = jQuery.datepicker.formatDate(options.dateFormat, Date.parse(r[i].s));
                var e = jQuery.datepicker.formatDate(options.dateFormat, Date.parse(r[i].e));
                t.push(s + options.rangeSplitter + e);
            }
            input.val(t.join(options.rangeSeparator));

        }
        else {
            rpPickersBoxes.find('.ui-daterangepicker-datepicker').remove();
            var settings = $(this).data('presetSettings');
            var l = (settings.labels) ? settings.labels : settings.title;

            if(typeof(l) == 'string') {
                rpPickersBoxes.appendDatepicker(l, '');
            }
            else if(typeof(l) == 'object') {
                jQuery.each(l, function(k, v) {
                    if(typeof(v) == 'string') {
                        var rel = (k) ? 'e' : 's';
                        rpPickersBoxes.appendDatepicker(v, rel);
                    }
                    else {
                        jQuery.each(v, function(n, t) {
                            var rel = (n) ? k + 'e' : k + 's';
                            rpPickersBoxes.appendDatepicker(t, rel);
                        });
                    }
                });
            }
            rpPickersBoxes.show();
        }

        return $(this);
    };

    // Show, hide, or toggle rangepicker
    function show() {
        if(rp.data('state') == 'closed') {
            rp.data('state', 'open');
            rp.fadeIn(300);
            options.onOpen();
        }
    }
    function hide() {
        if(rp.data('state') == 'open') {
            rp.data('state', 'closed');
            rp.fadeOut(300);
            rpPickersBoxes.fadeOut(300);
            rp.find('.ui-state-active').removeClass('ui-state-active');
            options.onClose();
        }
    }
    function toggle() {
        (rp.data('state') == 'open') ? hide() : show();
    }            
    rp.data('state', 'closed');

    // Manage visibility and append rangepicker to its container
    input.click(function() {
        toggle();
        return false;
    });
    jQuery(options.appendTo).append(rp);
};
