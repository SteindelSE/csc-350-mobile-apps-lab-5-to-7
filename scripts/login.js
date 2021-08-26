/*
  Name: Derek Steindel
  Date: 8/5/21
  Assignment: Week 5 Lab - Casual Screen Time Tracker
*/

// In place of addValueToPassword, seemed more aptly named
// Takes in a button value from the keypad and updates the login
// pin input accordingly
function addValueToPin(button) {
  let currentPIN = $("#txtPIN").val();
  if (button == "pop") {
    $("#txtPIN").val(currentPIN.substring(0, currentPIN.length - 1));
  } else {
    $("#txtPIN").val(currentPIN.concat(button));
  }
}

// Check if localstorage is supported by the
// browser, alert the user if not, and supply
// the user's PIN to compare or the Default
// if no user exists.
function getPIN() {
  if (typeof Storage == "undefined") {
    alert("Your browser does not support HTML5 localstorage. Try upgrading.");
  } else if (localStorage.getItem("user") != null) {
    return JSON.parse(localStorage.getItem("user")).PIN;
  } else {
    // Default PIN
    return "2345";
  }
}

// If Enter button is clicked, check the PIN against the saved
// user info, or a default if no user is present, and result to
// a default PIN if no other is available.
$("#btnEnter").click(function () {
  let pin = getPIN();

  if (document.getElementById("txtPIN").value == pin) {
    if (localStorage.getItem("agreedToLegal") == null) {
      $("#btnEnter").attr("href", "#page-disclaimer").button();
    } else if (localStorage.getItem("agreedToLegal") == "true") {
      if (localStorage.getItem("user") == null) {
        // User has not been created, direct to user info page
        $("#btnEnter").attr("href", "#page-user-info").button();
      } else {
        $("#btnEnter").attr("href", "#page-menu").button();
      }
    }
  } else {
    alert("Incorrect password, please try again.");
  }
});

// Handles remembering if the disclaimer has already been agreed to
$("#btnAgree").click(function () {
  if (localStorage.getItem("agreedToLegal") == null) {
    // Try to save the user object and alert if issues arise.
    try {
      localStorage.setItem("agreedToLegal", "true");
      $.mobile.changePage("#page-user-info");
      window.location.reload();
    } catch (e) {
      alert("Error saving user information to storage.");
      console.log(e);
    }
  }
});
