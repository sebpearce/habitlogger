'use strict';

function validateInput(x) {
  return String(x);
}

function toggleHabitDone (id, val, type) {
  const jsonData = JSON.stringify({
    'doneHabit': id,
    'value': '' + val,
    'type': '' + type,
  });

  $.ajax({
    type: 'POST',
    url: '/today/update',
    data: jsonData,
    contentType: 'application/json',
    success: function (data) {
      $('#errorBox').hide();
      console.log(data);
      if (data.updatedHabit && data.formattedValue) {
        const infoText = '#todaylist-row-info-text-' + data.updatedHabit;
        $(infoText).text(data.formattedValue).fadeIn(200);
      }
    },
    error: function(data) {
      console.log(data.responseJSON);
      const msg = (data.responseJSON.error) ? data.responseJSON.error : 'There was a little problem.';
      $('#errorMessage').text(msg);
      $('#errorBox').show(msg);
    },
    dataType: 'json',
  });  
}

$(document).ready(function(){

  $('.todaylist-row-textinput').on('keypress', function (e) {

    const thisRowId = $(this).attr('data-id');
    const thisRowType = $(this).attr('data-type');
    // on enter
    if (e.keyCode === 13) {
      // validateInput will return false if invalid
      const validInput = validateInput(this.value);
      if (validInput) {
        // update db with text data
        console.log('Executing toggleHabitDone with text input...');
        console.log(thisRowId, validInput, thisRowType);
        toggleHabitDone(thisRowId, validInput, thisRowType);
        $('.todaylist-row-textinput-container[data-id="' + thisRowId + '"]')
          .removeClass('isbeingedited')
          // .fadeOut(200);
          .hide();
      }
    }

  });

  // when a checkbox is clicked
  $('.todaylist-row-checkbox').on('change', function () {
    const thisRowId = $(this).attr('data-id');
    const isChecked = this.checked;

    // hide all textinputs that are open
    // $('.todaylist-row-textinput-container').fadeOut(200);

    $('.todaylist-row-textinput-container').each(function () {
      if ($(this).hasClass('isbeingedited')) {
        // if user has left input open and clicked another checkbox,
        // uncheck the checkbox that matches the open input
        const beingEditedId = $(this).attr('data-id');
        $('.todaylist-row-checkbox[data-id="' + beingEditedId + '"]').attr('checked', false);
      }
      $(this).removeClass('isbeingedited');
      $(this).fadeOut(200);
    });

    if ($(this).attr('data-type') == '3') {
      // if binary -> update db
      console.log('Executing toggleHabitDone with binary...');
      console.log(thisRowId, isChecked);
      toggleHabitDone(thisRowId, (isChecked ? 1 : 0), 3);
    } else {
      // if not binary -> show text input
      const container = '#todaylist-row-textinput-container-' + thisRowId;
      const input = '#todaylist-row-textinput-' + thisRowId;
      const infoText = '#todaylist-row-info-text-' + thisRowId;
      $(infoText).css('display', 'none');
      if (isChecked) {
        $(container).fadeIn(200);
        $(input).focus();
        $(container).addClass('isbeingedited');
      } else {
        // when checkbox becomes unchecked
        $(container).fadeOut(200);
        if ($(container).hasClass('isbeingedited')) {
          $(container).removeClass('isbeingedited');
        }
      }
    }

  });

});