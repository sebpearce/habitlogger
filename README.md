# habitlogger

Habitlogger is a productivity app that tracks your daily habits. [Access the live page here.](http://habitlogger.herokuapp.com)

I created this app as a way to showcase my skills with Node.js, Express.js, PostgreSQL and Jade, and my ability to create a functioning database-driven app. The code is available [here on GitHub.](https://github.com/sebpearce/habitlogger).

Feel free to add/update/edit/delete any records you like.

## How it works

There are three types of habits: **timed** (e.g. studied for 2 hours), **counted** (e.g. did 100 push-ups), and **binary** (you either did it or you didn't, e.g. resisted the temptation to check Facebook).

Each day you head to the **today** tab and check off the habits you successfully did that day. Depending on the type of habit, it may prompt you for more information (try it!). Each time you check one off, it will create a row in the **doings** table with the ID, date, value, habit and habit type. You can edit these rows directly in the **doings** tab.

The progress calendar is a record of your habits for the past year. If your habit count for a particular day is higher than zero, the square for that day will turn light green. If you check off all the habits for today, the square will turn a darker shade of green. The calendar is a pure JS remake of the GitHub contributions calendar which dynamically generates an SVG. You see my code for it [here on CodePen](http://codepen.io/sebpearce/pen/yeVrJz).

Lastly, the **db** tab is simply a database dump, which is there for reference as it shows the structure of the database.