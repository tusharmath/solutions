/**
 * Created by tusharmathur on 6/9/15.
 */
$(function () {
    "use strict";
    var data = [
        {columnName: 'A', columnType: 'Int', columnValueType: 'String'}
    ];

    var template = _.template($('#template').html())({rows: data});
    $('#row').html(template);
    var themeBlock = $('body');
    $('.theme-toggle li a').click(function (el) {
        themeBlock.attr('class', '');
        themeBlock.addClass($(el.target).data().theme)
    });
});