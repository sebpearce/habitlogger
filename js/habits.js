// habits.js
'use strict';

// function validateHabitsForm () {
//   const nameReg = /^[A-Za-z0-9]+$/
//   const isNameValid;
// }

function addNewHabit (name, type) {
  const jsonData = JSON.stringify({
    'newHabit': name,
    'newHabitType': '' + type,
  });

  $.ajax({
    type: 'POST',
    url: '/habits/add',
    data: jsonData,
    contentType: 'application/json',
    success: function (data) {
      $('.habitlist-container').html(data);
    },
    error: function(msg) {
      console.log(msg);
    },
    dataType: 'html',
  });
}

function deleteHabit (id) {
  const jsonData = JSON.stringify({
    'habitToDelete': id,
  });

  $.ajax({
    type: 'POST',
    url: '/habits/delete',
    data: jsonData,
    contentType: 'application/json',
    success: function (data) {
      $('.habitlist-container').html(data);
    },
    dataType: 'html',
  });
}

$(document).ready(function () {

  // .content is not replaced via AJAX injection, so let jQuery bind to it
  $('.content').on('click', '.delete-link', function (event) {
    // only works first time!
    const rowId = $(this).attr('data-id');
    deleteHabit(rowId);
    event.preventDefault();
  });

  $('#newHabitForm').on('submit', function (event) {
    let arr = $('#newHabitForm').serializeArray();
    let name = arr[0].value;
    let type = arr[1].value;
    addNewHabit(name, type);
    $('#newHabitForm-type').val('');
    $('#newHabitForm-name').val('').focus();
    event.preventDefault();
  });

});
