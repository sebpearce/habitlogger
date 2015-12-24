// habits.js
'use strict';

// function validateHabitsForm () {
//   const nameReg = /^[A-Za-z0-9]+$/
//   const isNameValid;
// }

function setErrorMsg (msg, element) {
  $('#errorMessage').text(msg);
}

function populateHabitsTable () {
  let tableData = '';

  $.getJSON('/habits/list', function (data) {

    $.each(data.habits, function () {
      tableData += '<tr>';
      tableData += '<td>' + this.id + '</td>';
      tableData += '<td>' + this.name + '</td>';
      tableData += '<td>' + data.habitTypes[this.type] + '</td>';
      tableData += '<td><a href="#" class="delete-link" data-id="' + this.id 
        + '">\u00D7</a></td>';
      tableData += '</tr>';
    });

    $('#habitlist tbody').html(tableData);
  });
}

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
      populateHabitsTable();
      $('#errorBox').hide();
    },
    error: function(data) {
      console.log(data.responseJSON);
      const msg = (data.responseJSON.error) ? data.responseJSON.error : 'There was a little problem.';
      setErrorMsg(msg);
      $('#errorBox').show(msg);
    },
    dataType: 'json',
  });
}

// TODO: refactor this so it can be used for both habits and doings
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
      if (data.success) {
        populateHabitsTable();
        $('#errorBox').hide();
      }
    },
    error: function (data) {
      console.log(data.responseJSON);
      const msg = (data.responseJSON.error) ? data.responseJSON.error : 'There was a little problem.';
      setErrorMsg(msg);
      $('#errorBox').show(msg);
    },
    dataType: 'json',
  });
}

$(document).ready(function () {

  populateHabitsTable();

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
