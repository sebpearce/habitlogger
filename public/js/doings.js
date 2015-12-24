// doings.js

'use strict';

function populateDoingsTable() {
  var tableData = '';
  $.getJSON('/doings/list', function (data) {

    $.each(data.doings, function () {
      tableData += '<tr>';
      tableData += '<td>' + this.id + '</td>';
      tableData += '<td>' + this.date + '</td>';
      tableData += '<td>' + this.habit + '</td>';
      tableData += '<td>' + this.value + '</td>';
      tableData += '<td>' + this.type + '</td>';
      tableData += '<td><a href="#" class="delete-link" data-id="' + this.id + '">×</a></td>';
      tableData += '</tr>';
    });

    $('#doingslist tbody').html(tableData);
  });
}

function addNewDoing(date, habit, value) {
  var jsonData = JSON.stringify({
    'newdoingdate': '' + date,
    'newdoinghabit': '' + habit,
    'newdoingvalue': '' + value
  });

  $.ajax({
    type: 'POST',
    url: '/doings/add',
    data: jsonData,
    contentType: 'application/json',
    success: function success(data) {
      populateDoingsTable();
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
}

function deleteDoing(id) {
  var jsonData = JSON.stringify({
    'doingtodelete': id
  });

  $.ajax({
    type: 'POST',
    url: '/doings/delete',
    data: jsonData,
    contentType: 'application/json',
    success: function success(data) {
      populateDoingsTable();
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
}

$(document).ready(function () {

  populateDoingsTable();

  // get datepicker CSS
  // $.ajax({
  //   url: '/css/bootstrap-datepicker3.min.css',
  //   dataType: 'script',
  //   success: function (data) {
  //     $('head').append('<style>' + data + '</style>');
  //   }
  // });

  // // get datepicker JS and then create an instance
  // $.ajax({
  //   url: '/js/bootstrap-datepicker.min.js',
  //   dataType: 'script',
  //   success: function (data) {
  //     // instantiate datepicker
  //     $('.datepicker').datepicker({
  //       format: 'yyyy-mm-dd',
  //     });
  //   }
  // })

  // .content is not replaced via AJAX injection, so let jQuery bind to it
  $('.content').on('click', '.delete-link', function (event) {
    // only works first time!
    var rowId = $(this).attr('data-id');
    deleteDoing(rowId);
    event.preventDefault();
  });

  $('#newdoingform-habit').on('change', function () {
    function capitalize(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    var type = $(this).find(':selected').data('type');
    if (type === 3) {
      console.log('It\'s a 3!');
    } else {
      var typeName = $(this).find(':selected').data('typeName');
      $('#newdoingform-valueinput').text(capitalize(typeName));
    }
  });

  // select first option automatically and trigger change to update val label
  $('#newdoingform-habit')[0].selectedIndex = 0;
  $('#newdoingform-habit').change();

  $('#newdoingform').on('submit', function (event) {
    var arr = $('#newdoingform').serializeArray();
    var date = arr[0].value;
    var habit = arr[1].value;
    var value = arr[2].value;
    addNewDoing(date, habit, value);
    // $('#newdoingform-date').val('');
    $('#newdoingform-habit').val('').focus();
    $('#newdoingform-value').val('');
    event.preventDefault();
  });
});