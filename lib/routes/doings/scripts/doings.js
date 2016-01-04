// doings.js

'use strict';

{

  let isBinary = false;

  function populateDoingsTable() {
    let tableData = '';
    $.getJSON('/doings/list', function (data) {

      $.each(data.doings, function () {
        tableData += '<tr>';
        // tableData += '<td>' + this.id + '</td>';
        tableData += '<td>' + this.date + '</td>';
        tableData += '<td>' + this.habit + '</td>';
        tableData += '<td>' + this.value + '</td>';
        // tableData += '<td>' + this.type + '</td>';
        tableData += '<td><a href="#" class="delete-link" data-id="' + this.id 
          + '">\u00D7</a></td>';
        tableData += '</tr>';
      });

      $('#doingslist tbody').html(tableData);
      $('#doingslist').fadeIn(500);
      $('#newdoingform').fadeIn(500);
    });
  }

  function addNewDoing (date, habit, value) {
    const jsonData = JSON.stringify({
      'newdoingdate': '' + date,
      'newdoinghabit': '' + habit,
      'newdoingvalue': '' + value,
    });

    $.ajax({
      type: 'POST',
      url: '/doings/add',
      data: jsonData,
      contentType: 'application/json',
      success: function (data) {
        populateDoingsTable();
        $('#errorBox').hide();
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

  function deleteDoing (id) {
    const jsonData = JSON.stringify({
      'doingtodelete': id, 
    });

    $.ajax({
      type: 'POST',
      url: '/doings/delete',
      data: jsonData,
      contentType: 'application/json',
      success: function (data) {
        populateDoingsTable();
        $('#errorBox').hide();
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

  $(document).ready(function () {

    $('#doingslist').hide();
    $('#newdoingform').hide();

    populateDoingsTable();

    // get datepicker JS and then create an instance
    $.ajax({
      url: '/js/bootstrap-datepicker.min.js',
      dataType: 'script',
      success: function (data) {
        // instantiate datepicker
        $('.datepicker').datepicker({
          format: 'yyyy-mm-dd',
        });
      }
    })

    // .content is not replaced via AJAX injection, so let jQuery bind to it
    $('.content').on('click', '.delete-link', function (event) {
      // only works first time!
      const rowId = $(this).attr('data-id');
      deleteDoing(rowId);
      event.preventDefault();
    });

    // update form inputs when different habit is selected
    $('#newdoingform-habit').on('change', function () {
      function capitalize (s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
      }
      let type = $(this).find(':selected').data('type');
      let typeName = $(this).find(':selected').data('typeName');
      $('#newdoingform-valueinput').text(capitalize(typeName));
      if (type === 3) {
        isBinary = true;
        $('#newdoingform-valueinput-textinput-container').css('display','none');
        $('#newdoingform-valueinput-checkboxinput-container').css('display','block');
      } else {
        isBinary = false;
        $('#newdoingform-valueinput-textinput-container').css('display','block');
        $('#newdoingform-valueinput-checkboxinput-container').css('display','none');
      }
    });

    // select first option automatically and trigger change to update val label
    $('#newdoingform-habit')[0].selectedIndex = 0;
    $('#newdoingform-habit').change();

    // submit form to the server
    $('#newdoingform').on('submit', function (event) {
      let arr = $('#newdoingform').serializeArray();
      console.log(arr);
      let date = arr[0].value;
      let habit = arr[1].value;
      let value = isBinary ? arr[3].value : arr[2].value;
      addNewDoing(date, habit, value);
      $('#newdoingform-habit').val('').focus();
      $('#newdoingform-value').val('');
      event.preventDefault();
    });

  });

}