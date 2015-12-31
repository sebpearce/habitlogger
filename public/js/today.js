'use strict';

{
  (function () {
    var convertInputToSeconds = function convertInputToSeconds(string) {

      // check for two digits separated by a space and handle them
      if (string.match(/\d\s\d/)) {
        var dub = /(\d+)\s(\d+)/g.exec(string);
        // dub[0] should be the whole of the matched regex, and [1] & [2] are the \d values
        if (dub.length === 3) {
          if (dub[2] === 1000) {
            // if it's 1000, multiply [1] by [2] e.g. 2 1000 -> 2000
            string = string.replace(dub[0], parseInt(dub[1], 10) * parseInt(dub[2], 10));
          } else if (dub[2] === 100) {
            // if it's 100, multiply [1] by [2] e.g. 2 100 -> 200
            string = string.replace(dub[0], parseInt(dub[1], 10) * parseInt(dub[2], 10));
          } else {
            // else add the values e.g. forty five -> 40 5 -> 45
            string = string.replace(dub[0], parseInt(dub[1], 10) + parseInt(dub[2], 10));
          }
        }
      }

      var ok = false;
      var hours = 0;
      var min = 0;
      var sec = 0;

      if (string.match(/h(ou?)rs?/)) {
        var h = /(\d+)\s?h(ou?)rs?/.exec(string);
        hours = parseInt(h[1], 10) * 3600; // number of hours
        ok = true;
      } else if (string.match(/(\d\s|\d)h/)) {
        var h = /(\d+)\s?h/.exec(string);
        hours = parseInt(h[1], 10) * 3600; // number of hours
        ok = true;
      } else hours = 0;

      if (string.match(/min(ute?)s?/)) {
        var m = /(\d+)\s?min(ute?)s?/.exec(string);
        min = parseInt(m[1], 10) * 60; // number of minutes
        ok = true;
      } else if (string.match(/(\d\s|\d)m/)) {
        var m = /(\d+)\s?m/.exec(string);
        min = parseInt(m[1], 10) * 60; // number of minutes
        ok = true;
      } else min = 0;

      if (string.match(/sec(ond?)s?/)) {
        var s = /(\d+)\s?sec(ond?)s?/.exec(string);
        sec = parseInt(s[1], 10); // number of seconds
        ok = true;
      } else if (string.match(/(\d\s|\d)s/)) {
        var s = /(\d+)\s?s/.exec(string);
        sec = parseInt(s[1], 10); // number of seconds
        ok = true;
      } else sec = 0;

      if (string.match(/^(\d+):(\d+):(\d+)$/)) {
        var d = /(\d+):(\d+):(\d+)/.exec(string);
        hours = parseInt(d[1], 10) * 3600;
        min = parseInt(d[2], 10) * 60;
        sec = parseInt(d[3], 10);
        ok = true;
      } else if (string.match(/^(\d+):(\d+)$/)) {
        var d = /(\d+):(\d+)/.exec(string);
        min = parseInt(d[1], 10) * 60;
        sec = parseInt(d[2], 10);
        ok = true;
      }

      if (string.match(/^[0-9]+$/)) {
        hours = 0;
        min = parseInt(string) * 60;
        sec = 0;
        ok = true;
      }

      var result = hours + min + sec;
      if (!ok || isNaN(result) || result <= 0) return 0;else return result;
    };

    var validateInput = function validateInput(input, type) {
      var result = undefined;

      function validateCounted(x) {
        return Math.floor(+x) == x && x > 0 && x <= 86400 ? x : 0;
      }

      if (type == 1) {
        result = convertInputToSeconds(input);
      } else if (type == 2) {
        result = validateCounted(input);
      } else {
        result = 0;
      }
      return result;
    };

    var deleteTodayHabit = function deleteTodayHabit(habit) {
      var jsonData = JSON.stringify({
        'habit': habit
      });

      $.ajax({
        type: 'POST',
        url: '/today/delete',
        data: jsonData,
        contentType: 'application/json',
        success: function success(data) {
          console.log('success deleting habit ' + habit + '!');
        },
        error: function error(data) {
          console.log('error deleting habit ' + habit + '!');
        },
        dataType: 'json'
      });
    };

    var updateTodayHabit = function updateTodayHabit(id, val, type) {
      var jsonData = JSON.stringify({
        'doneHabit': id,
        'value': '' + val,
        'type': '' + type
      });

      $.ajax({
        type: 'POST',
        url: '/today/update',
        data: jsonData,
        contentType: 'application/json',
        success: function success(data) {
          $('#errorBox').hide();
          console.log(data);
          if (data.updatedHabit && data.formattedValue) {
            var infoText = '#todaylist-row-info-text-' + data.updatedHabit;
            $(infoText).text(data.formattedValue).fadeIn(200);
          }
        },
        error: function error(data) {
          console.log(data.responseJSON);
          var msg = data.responseJSON.error ? data.responseJSON.error : 'There was a little problem.';
          $('#errorMessage').text(msg);
          $('#errorBox').show(msg);
        },
        dataType: 'json'
      });
    };

    $(document).ready(function () {

      $('.todaylist-row-textinput').on('keypress', function (e) {

        var thisRowId = $(this).attr('data-id');
        var thisRowType = $(this).attr('data-type');
        // on enter
        if (e.keyCode === 13) {
          // validateInput will return false if invalid
          console.log('thisRowType = ' + thisRowType);
          var validInput = validateInput(this.value, thisRowType);
          if (validInput) {
            // update db with text data
            console.log('Executing updateTodayHabit with text input...');
            console.log(thisRowId, validInput, thisRowType);
            updateTodayHabit(thisRowId, validInput, thisRowType);
            $('.todaylist-row-textinput-container[data-id="' + thisRowId + '"]').removeClass('isbeingedited').hide();
            $(this).val('');
          } else {
            console.log('Input not valid.');
          }
        }
      });

      // when a checkbox is clicked
      $('.todaylist-row-checkbox').on('change', function () {
        var thisRowId = $(this).attr('data-id');
        var isChecked = this.checked;

        // hide all textinputs that are open
        // $('.todaylist-row-textinput-container').fadeOut(200);

        $('.todaylist-row-textinput-container').each(function () {
          if ($(this).hasClass('isbeingedited')) {
            // if user has left input open and clicked another checkbox,
            // uncheck the checkbox that matches the open input
            var beingEditedId = $(this).attr('data-id');
            $('.todaylist-row-checkbox[data-id="' + beingEditedId + '"]').attr('checked', false);
          }
          $(this).removeClass('isbeingedited').fadeOut(200);
        });

        if ($(this).attr('data-type') == '3') {
          // if binary -> update db
          console.log('Executing updateTodayHabit with binary...');
          console.log(thisRowId, isChecked);
          if (isChecked) updateTodayHabit(thisRowId, 1, 3);else deleteTodayHabit(thisRowId);
        } else {
          // if not binary -> show text input
          var container = '#todaylist-row-textinput-container-' + thisRowId;
          var input = '#todaylist-row-textinput-' + thisRowId;
          var infoText = '#todaylist-row-info-text-' + thisRowId;
          $(infoText).css('display', 'none');
          if (isChecked) {
            $(container).fadeIn(200);
            $(input).focus();
            $(container).addClass('isbeingedited');
          } else {
            // when checkbox becomes unchecked, kill db record
            deleteTodayHabit(thisRowId);
            $(container).fadeOut(200);
            if ($(container).hasClass('isbeingedited')) {
              $(container).removeClass('isbeingedited');
            }
          }
        }
      });
    });
  })();
}