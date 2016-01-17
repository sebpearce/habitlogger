// Server-side script to generate progress calendar

'use strict';

// const calData = {
//   '2015-07-01': '4',
//   '2015-07-03': '1',
//   '2015-07-05': '0',
//   '2015-07-07': '2',
// };

module.exports = function generateCalendar(calData, totalHabits) {

  // SPACING includes square size and gutters
  const SPACING = 13;
  const SQUARE_SIZE = 11;
  const MARKED_DAY_COLOR = '#52BA69';
  const UNMARKED_DAY_COLOR = '#eee';
  const SEMIMARKED_DAY_COLOR = '#C7EEBA';

  function padWithZeroes (x) {
    return (+x < 10) ? '0' + x : x;
  }

  // pass in a date object and get 'YYYY-MM-DD' string
  function getYYYYMMDD (date) {
    let yyyy = date.getFullYear().toString();
    let mm = (date.getMonth()+1).toString();
    let dd = date.getDate().toString();
    return yyyy + '-' + padWithZeroes(mm) + '-' + padWithZeroes(dd);
  }

  // takes x coord and month name as string
  function drawMonthText(x, month) {
    let result = '<text class="calendar-monthname" y="-5" x="' + x + '">' + 
                 month + '</text>';
    return result;
  }

  // draw 1 column of squares
  function addColumn(x, startAtY, stopAtY, squareDate, mthName) {

    let result = '';

    // draw new month name if arg was passed
    if (mthName) {
      result += drawMonthText(x, mthName);
    }

    result += '<g transform="translate(' + x + ',0)">';

    // draw column of squares; startAtY makes it start further down than normal
    // and stopAtY makes it stop further up than normal
    let lowerLimit = (startAtY !== null ? startAtY : 0);
    let upperLimit = (stopAtY !== null ? stopAtY : 6);
    for (let i = lowerLimit; i <= upperLimit; i++) {

      result += '<rect y="' + (i * SPACING) + '" ';
      result += 'width="' + SQUARE_SIZE + '" height="' + SQUARE_SIZE + '" ';
      result += 'class="calendar-day" ';

      let dateString = getYYYYMMDD(squareDate);
      result += 'data-date="' + dateString + '" ';

      if (calData.hasOwnProperty(dateString)) {
        result += 'data-value="' + calData[dateString] + '" ';
        if (calData[dateString] >= totalHabits) {
          result += 'fill="' + MARKED_DAY_COLOR + '">';
        } else if (calData[dateString] > 0) {
          result += 'fill="' + SEMIMARKED_DAY_COLOR + '">';
        }
      } else {
        result += 'data-value="0" fill="' + UNMARKED_DAY_COLOR + '">';
      }

      result += '</rect>';
      squareDate.setDate(squareDate.getDate() + 1);
    }
    result += '</g>';

    return result;
  }

  // get date of first square, one year ago
  function getStartDate() {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 365);
    return startDate;
  }

  // draw any text; takes x/y coords, text string and optional class name
  function drawText(x, y, t, className) {
    let result = '<text ';
    if (className) result += 'class="' + className + '" ';
    result += 'y = "' + y + '" ';
    result += 'x = "' + x + '"';
    result += '>' + t;
    result += '</text>';
    return result;
  }

  function drawCalendar() {

    let result = '';
    // daysOfWeek represents a column's y values for each weekday
    // e.g. Mondays are always y = 13, Tuesdays are y = 26, etc.
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      daysOfWeek.push(i * SPACING);
    }

    // draw the labels for M, W, F
    const dayLabels = ['M', 'W', 'F'];
    for (let i in dayLabels) {
      drawText(-10, i * 26 + 22, dayLabels[i], 'calendar-daylabel');
    }

    const mthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // determine which day of the week the first and last squares were
    // so we can draw the first and last columns
    const startDate = getStartDate();
    const firstDayWasA = startDate.getDay();
    const today = new Date(); // i.e. now
    const todayIsA = today.getDay();
    const msInAYear = 864e5;

    // draw a column for each week
    // if we're now in a new month, pass month name as arg
    const squareDate = getStartDate();
    let curMonth = squareDate.getMonth();
    let mthName = mthNames[curMonth % 12];
    let numColumns = todayIsA === 0 ? 54 : 53;
    for (let i = 0; i < numColumns; i++) {
      let s = null;
      let z = null;
      if (i === 0) s = firstDayWasA;
      if (i === (numColumns - 1)) z = todayIsA;
      result += addColumn(i * SPACING, s, z, squareDate, mthName);
      mthName = (squareDate.getMonth() > curMonth) ? mthNames[++curMonth % 12] : null;
    }

    return result;

  }

  let mainResult = '';
  mainResult += '<svg id="calendar" width="720" height="110">' +
            '<g transform="translate(13,20)">';
  mainResult += drawCalendar();
  mainResult += '</g></svg>';

  return mainResult;
}