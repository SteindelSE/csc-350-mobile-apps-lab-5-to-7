// Sets up and draws a line graph on a canvas
// showing screen hour per day or alerts the
// user if not records are available and sends
// them to the menu.
function showGraph() {
  try {
    const records = JSON.parse(localStorage.getItem("tbRecords"));
    const user = JSON.parse(localStorage.getItem("user"));

    if (records == null) {
      alert("No records have been entered yet.");

      $(location).attr("href", "#page-menu");
    } else {
      setupCanvas();

      const recordArr = new Array();
      const dateArr = new Array();
      getRecordHistory(recordArr, dateArr);

      drawLines(recordArr, dateArr, parseFloat(user.HoursGoal), 0);
      labelAxes();
    }
  } catch (e) {
    alert("Error retrieving information from storage.");
    console.log(e);
  }
}

// --Fills in a rectangle on the context of
// the canvas of the Graph page to serve as
// the background.
function setupCanvas() {
  const canvas = document.getElementById("recordGraph");
  const context = canvas.getContext("2d");

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, 500, 500);
}

/*
  getRecordHistory will take in an empty array for TSH values and an empty array 
  for date values and try to fill it with the values from tbRecords in local
  storage.
*/
function getRecordHistory(recordArr, dateArr) {
  try {
    const records = JSON.parse(localStorage.getItem("tbRecords"));

    for (let i = 0; i < records.length; i++) {
      const currDateAsArr = records[i].Date.split("-");
      const month = currDateAsArr[1];
      const day = currDateAsArr[2];
      dateArr[i] = month + "/" + day;
      recordArr[i] = parseFloat((
        Number.parseFloat(records[i].Hours) +
        Number.parseFloat(records[i].Minutes) / 60
      ).toFixed(2));
    }
    console.log(recordArr);
  } catch (e) {
    alert("Error retrieving information from storage.");
    console.log(e);
  }
}

// Takes in arrays designating dates and hours
// of screen time and draws lines within the
// specified bounds.
function drawLines(recordArr, dateArr, upper, lower) {
  const recordLine = new RGraph.Line(
    "recordGraph",
    recordArr,
    [upper, upper],
    [lower, lower]
  )
    .Set("labels", dateArr)
    .Set("colors", ["blue", "green", "green"])
    .Set("shadow", true)
    .Set("shadow.offsetx", 1)
    .Set("shadow.offsety", 1)
    .Set("linewidth", 2)
    .Set("numxticks", 6)
    .Set("scale.decimals", 2)
    .Set("xaxispos", "bottom")
    .Set("gutter.left", 40)
    .Set("tickmarks", "filledcircle")
    .Set("ticksize", 5)
    .Set("chart.labels.ingraph", [, ["Hours", "blue", "yellow", 1, 50]])
    .Set("chart.title", "Daily Hours")
    .Draw();
}

// Adds text to the canvas context for the x
// and y labels
function labelAxes() {
  const canvas = document.getElementById("recordGraph");
  const context = canvas.getContext("2d");

  context.font = "11px Georgia";
  context.fillStyle = "green";
  context.fillText("Date (MM/DD)", 400, 470);
  context.rotate(-Math.PI / 2);
  context.textAlign = "center";
  context.fillText("Screen Time", -250, 10);
}
