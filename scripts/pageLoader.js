/*
  Name: Derek Steindel
  Date: 8/5/21
  Assignment: Week 5 Lab - Casual Screen Time Tracker
*/

// Calls methods listed if corresponding page is loaded
$(document).on("pageshow", function () {
  const activePageId = $(".ui-page-active").attr("id");
  if (activePageId == "page-user-info") {
    showUserForm();
  } else if (activePageId == "page-records") {
    loadUserInfo();
    listRecords();
  } else if (activePageId == "page-advice") {
    showAdvice();
    resizeGraph();
  } else if (activePageId == "page-graph") {
    showGraph();
    resizeGraph();
  }
});

// Resizes graphs if device screen is less than 700 pixels
function resizeGraph() {
  if ($(window).width() < 700) {
    $("#adviceGauge").css({ width: $(window).width() - 75 });
    $("#recordGraph").css({ width: $(window).width() - 75 });
  }
}
