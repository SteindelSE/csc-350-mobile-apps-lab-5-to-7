/*
  Name: Derek Steindel
  Date: 8/5/21
  Assignment: Week 5 Lab - Casual Screen Time Tracker
*/

// Gets records from storage. Alerts if no records,
// otherwise gets recent record, draws gauge, and
// provides advice.
function showAdvice() {
  try {
    const records = JSON.parse(localStorage.getItem("tbRecords"));

    if (records == null) {
      alert("No records exist yet.");
      $(location).attr("href", "#page-menu");
    } else {
      const user = JSON.parse(localStorage.getItem("user"));

      const canvas = document.getElementById("adviceGauge");
      const context = canvas.getContext("2d");
      context.fillStyle = "#C0C0C0";
      context.fillRect = (0, 0, 500, 500);
      context.font = "22px Arial";
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawAdviceCanvas(context, records, user);
    }
  } catch (e) {
    alert("Error loading records or user from storage.");
    console.log(e);
  }
}

// Takes canvas context and screen time records. Adds
// text showing most recent record and average for
// up to the last 7 days (in case there are less than
// seven days of records). Draws gauge from values.
function drawAdviceCanvas(context, records, user) {
  context.font = "22px Arial";
  context.fillStyle = "black";
  const average = getAverageRecord(records);
  context.fillText(
    `Your latest screen time is: ${getLatestRecord(records)} Hours`,
    25,
    320
  );
  context.fillText(`Your average screen time is: ${average} Hours`, 25, 350);
  context.fillText(
    `Your goal screen time is: ${user.HoursGoal} Hours`,
    25,
    380
  );
  levelWrite(context, parseFloat(average), parseFloat(user.HoursGoal));
  levelMeter(context, parseFloat(average), parseFloat(user.HoursGoal));
}

// Returns latest record's time in hours
function getLatestRecord(records) {
  records.sort(dateComparer);
  const last = records.length - 1;
  return `${(
    Number.parseFloat(records[last].Hours) +
    Number.parseFloat(records[last].Minutes / 60)
  ).toFixed(2)}`;
}

// Returns average 7 day record's time in hours
function getAverageRecord(records) {
  records.sort(dateComparer);
  // Count in minutes to prevent truncation and allow fractional hours
  let count = 0;
  let numberOfDays = 0;
  for (let i = 0; i < records.length; i++) {
    if (numberOfDays >= 7) {
      break;
    }
    if (records[i] != null) {
      if (i == 0 || records[i].Date != records[i - 1].Date) {
        numberOfDays++;
      }
      count =
        count +
        Number.parseInt(records[i].Minutes) +
        Number.parseInt(records[i].Hours) * 60;
    } else {
      break;
    }
  }

  count = count / numberOfDays;
  let hours = 0;
  hours = Math.floor(count / 60);
  return `${Number.parseFloat(hours + (count - hours * 60) / 60).toFixed(2)}`;
}

// Writes advice to canvas context based
// on goal provided
function levelWrite(context, total, goal) {
  if (total <= goal) {
    writeAdvice(context, "green");
  } else if (total > goal && total <= goal * 1.05) {
    writeAdvice(context, "yellow");
  } else {
    writeAdvice(context, "red");
  }
}

// Takes canvas context and represents the
// rating of a level color. Writes advice.
function writeAdvice(context, level) {
  let adviceLine1 = "";
  let adviceLine2 = "";

  if (level == "red") {
    adviceLine1 = "Recommend setting physical timers ";
    adviceLine2 = "during screen use.";
  } else if (level == "yellow") {
    adviceLine1 = "Recommend refining planning phase of ";
    adviceLine2 = "screen time use.";
  } else if (level == "green") {
    adviceLine1 = "Excellent. Continue recording screen use.";
  }

  context.fillText("Your screen time overage is " + level + ".", 25, 410);
  context.fillText(adviceLine1, 25, 440);
  context.fillText(adviceLine2, 25, 470);
}

// Checks level and draws appropriate
// gauge based on the goal
function levelMeter(context, total, goal) {
  const intGoal = Number.parseInt(goal);
  const fltTotal = Number.parseFloat(total);
  let gauge = new RGraph.CornerGauge("adviceGauge", 0, intGoal, fltTotal).Set(
    "chart.colors.ranges",
    [
      [intGoal * 1.05, intGoal * 1.1, "red"],
      [intGoal, intGoal * 1.05, "yellow"],
      [0, intGoal, "green"],
    ]
  );
  drawMeter(gauge);
}

// Applies settings to corner gauge object
// and draws it
function drawMeter(gauge) {
  gauge
    .Set("chart.value.text.units.post", " Hours")
    .Set("chart.value.text.boxed", false)
    .Set("chart.value.text.size", 14)
    .Set("chart.value.text.font", "Verdana")
    .Set("chart.value.text.bold", true)
    .Set("chart.value.text.decimals", 2)
    .Set("chart.shadow.offsetx", 5)
    .Set("chart.shadow.offsety", 5)
    .Set("chart.scale.decimals", 2)
    .Set("chart.title", "Average vs Goal")
    .Set("chart.radius", 250)
    .Set("chart.centerx", 50)
    .Set("chart.centery", 250)
    .Draw();
}
