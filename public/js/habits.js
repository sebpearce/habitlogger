// habits.js
'use strict';

// function validateHabitsForm () {
//   const nameReg = /^[A-Za-z0-9]+$/
//   const isNameValid;
// }

{
  (function () {
    var setErrorMsg = function setErrorMsg(msg) {
      $('#errorMessage').text(msg);
    };

    var populateHabitsTable = function populateHabitsTable() {
      var tableData = '';

      $.getJSON('/habits/list', function (data) {

        $.each(data.habits, function () {
          tableData += '<tr>';
          // tableData += '<td>' + this.id + '</td>';
          tableData += '<td>' + this.name + '</td>';
          tableData += '<td>' + data.habitTypes[this.type] + '</td>';
          tableData += '<td><a href="#" class="delete-link" data-id="' + this.id + '">×</a></td>';
          tableData += '</tr>';
        });

        $('#habitlist tbody').html(tableData);
      });
    };

    var addNewHabit = function addNewHabit(name, type) {
      var jsonData = JSON.stringify({
        'newHabit': name,
        'newHabitType': '' + type
      });

      $.ajax({
        type: 'POST',
        url: '/habits/add',
        data: jsonData,
        contentType: 'application/json',
        success: function success(data) {
          populateHabitsTable();
          $('#errorBox').hide();
        },
        error: function error(data) {
          console.log(data.responseJSON);
          var msg = data.responseJSON.error ? data.responseJSON.error : 'There was a little problem.';
          setErrorMsg(msg);
          $('#errorBox').show(msg);
        },
        dataType: 'json'
      });
    };

    // TODO: refactor this so it can be used for both habits and doings

    var deleteHabit = function deleteHabit(id) {
      var jsonData = JSON.stringify({
        'habitToDelete': id
      });

      $.ajax({
        type: 'POST',
        url: '/habits/delete',
        data: jsonData,
        contentType: 'application/json',
        success: function success(data) {
          if (data.success) {
            populateHabitsTable();
            $('#errorBox').hide();
          }
        },
        error: function error(data) {
          console.log(data.responseJSON);
          var msg = data.responseJSON.error ? data.responseJSON.error : 'There was a little problem.';
          setErrorMsg(msg);
          $('#errorBox').show(msg);
        },
        dataType: 'json'
      });
    };

    $(document).ready(function () {

      populateHabitsTable();

      // .content is not replaced via AJAX injection, so let jQuery bind to it
      $('.content').on('click', '.delete-link', function (event) {
        // only works first time!
        var rowId = $(this).attr('data-id');
        deleteHabit(rowId);
        event.preventDefault();
      });

      $('#newHabitForm').on('submit', function (event) {
        var arr = $('#newHabitForm').serializeArray();
        var name = arr[0].value;
        var type = arr[1].value;
        addNewHabit(name, type);
        $('#newHabitForm-type').val('');
        $('#newHabitForm-name').val('').focus();
        event.preventDefault();
      });
    });
  })();
}