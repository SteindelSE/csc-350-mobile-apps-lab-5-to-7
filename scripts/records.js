/*
  Name: Derek Steindel
  Date: 8/5/21
  Assignment: Week 5 Lab - Casual Screen Time Tracker
*/

// Load user information on the records page for display.
function loadUserInfo() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    alert("Error loading from user information from storage.");
    console.log(e);
  }

  if (user != null) {
    $("#grpRecordPageUserInfo").empty();

    $("#grpRecordPageUserInfo").append(
      `<p>User's Name: ${user.FirstName} ${user.LastName}<br>` +
        `Age: ${computeAge(user.Birthdate)}<br>` +
        `Hours Per Day Goal: ${user.HoursGoal}</p>`
    );

    $("#grpRecordPageUserInfo").append(
      "<a href='#page-user-info' data-mini='true' " +
        "id='btnEditProfile' data-role='button' data-icon='edit' data-iconpos=" +
        "'left' data-inline='true'>Edit Profile</a>"
    );
    $("#btnEditProfile").buttonMarkup();
  }
}

// Returns age in years determined from birthdate
function computeAge(birthdate) {
  const today = new Date();
  const birthday = new Date(birthdate);
  const age = Math.floor((today - birthday) / (365.25 * 24 * 60 * 60 * 1000));
  return age;
}

// --Set the value of the button to "Add" on the Record Form page
// --Refresh the button so the proper value shows
// Set the button's value to "Add" then refresh it.
$("#btnAddRecord").click(function () {
  $("#btnSubmitNewRecord").val("Add");
  $("#btnSubmitNewRecord").button();
  $("#btnSubmitNewRecord").button("refresh");
});

// Pageshow handler to clear the form if adding a record or pre-load the form
// with the record information if editing a record.
$("#page-record-form").on("pageshow", function () {
  const operation = $("#btnSubmitNewRecord").val();

  if (operation == "Add") {
    clearRecordForm();
  } else if (operation == "Edit") {
    showRecordForm($("#btnSubmitNewRecord").attr("recordIndexToEdit"));
  }
});

// Clears each value to default for page-record-form
function clearRecordForm() {
  $("#dtEntryDate").val("");
  $("#sldMinutes").val(0);
  $("#sldHours").val(1);
  $("#sldMinutes").slider("refresh");
  $("#sldHours").slider("refresh");
}

// Confirms proper entries are made in a record form. Slider values do not need
// checked because they are automatically clamped to min and max values although
// they could be double checked using a method I demonstrated in a previous lab.
function checkRecordForm() {
  let entryDate = new Date($("#dtEntryDate").val());
  if (entryDate > Date.now()) {
    alert("The entry date cannot be beyond now.");
    return false;
  } else if ($("#dtEntryDate").val() == "") {
    alert("You must enter a date.");
    return false;
  } else {
    return true;
  }
}

// Handle the form submission with a custom function. If button value is Add
// we will add the record and go back to the record listing page, otherwise
// we save the updated record, go back to the record listing page, and remove
// the attribute for editing.
$("#frmRecord").submit(function () {
  const operation = $("#btnSubmitNewRecord").val();

  if (operation == "Add") {
    if (addRecord()) {
      $.mobile.changePage("#page-records");
    }
  } else if (operation == "Edit") {
    if (editRecord($("#btnSubmitNewRecord").attr("recordIndexToEdit"))) {
      $.mobile.changePage("#page-records");
      $("#btnSubmitNewRecord").removeAttr("recordIndexToEdit");
    }
  }

  return false;
});

// Checks if form is complete and saves record data to tbRecords.
// Returns true on success or false on failure.
function addRecord() {
  if (checkRecordForm()) {
    const record = {
      Date: $("#dtEntryDate").val(),
      Minutes: $("#sldMinutes").val(),
      Hours: $("#sldHours").val(),
    };

    try {
      let tbRecords = JSON.parse(localStorage.getItem("tbRecords"));

      if (tbRecords == null) {
        tbRecords = [];
      }

      tbRecords.push(record);
      tbRecords.sort(dateComparer);
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
      alert("Saving Information");
      clearRecordForm();
      listRecords();

      return true;
    } catch (e) {
      alert("Error loading from record from storage.");
      console.log(e);

      return false;
    }
  } else {
    return false;
  }
}

// List records from tbRecords sorted by entry date.
function listRecords() {
  let tbRecords = null;
  try {
    tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
  } catch (e) {
    alert("Error loading from records from storage.");
    console.log(e);
  }

  if (tbRecords != null) {
    tbRecords.sort(dateComparer);

    // initialize the table
    $("#tblUserRecords").html(
      "<thead>" +
        "  <tr>" +
        "    <th>Date</th>" +
        "    <th>Minutes</th>" +
        "    <th>Hours</th>" +
        "    <th>Edit / Delete</th>" +
        "  </tr>" +
        "</thead>" +
        "<tbody>" +
        "</tbody>"
    );

    // insert each record into the table
    for (let i = 0; i < tbRecords.length; i++) {
      const rec = tbRecords[i];
      $("#tblUserRecords tbody").append(
        "<tr>" +
          "  <td>" +
          rec.Date +
          "</td>" +
          "  <td>" +
          rec.Minutes +
          "</td>" +
          "  <td>" +
          rec.Hours +
          "</td>" +
          "  <td><a data-inline='true' data-mini='true' data-role='button'" +
          "href='#page-record-form' onclick='callEdit(" +
          i +
          ");' " +
          "data-icon='edit' data-iconpos='notext'></a>" +
          "    <a data-inline='true' data-mini='true' data-role='button' " +
          "href='#' onclick='callDelete(" +
          i +
          ");' data-icon='delete' " +
          "data-iconpos='notext'></a></td>" +
          "</tr>"
      );
    }

    $("#tblUserRecords [data-role='button']").buttonMarkup();
  } else {
    $("#tblUserRecords").html("");
  }
  $("#tblUserRecords").table();
  $("#tblUserRecords").table("refresh");
}

// Compares 2 dates.
// Returns 1 is first is greater, otherwise -1
function dateComparer(firstRecord, secondRecord) {
  const firstDate = new Date(firstRecord.Date);
  const secondDate = new Date(secondRecord.Date);

  if (firstDate > secondDate) {
    return 1;
  } else {
    return -1;
  }
}

// --Removes the tbRecords from the localStorage
// --Calls the listRecords function
// --Alerts the user that all records have been deleted
$("#btnClearRecords").click(function () {
  try {
    localStorage.removeItem("tbRecords");
    listRecords();
    alert("All records have been deleted.");
  } catch (e) {
    alert("Error modifying records in storage.");
    console.log(e);
  }
});

// Calls the appropriate function to delete a record by index then
// refreshes the list of records displayed to the user.
function callDelete(index) {
  deleteRecord(index);
  listRecords();
}

// Deletes a record of tbRecords using its index. If tbRecords no longer has any
// records, it removes tbRecords from storage completely.
function deleteRecord(index) {
  try {
    const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));

    tbRecords.splice(index, 1);

    if (tbRecords.length == 0) {
      localStorage.removeItem("tbRecords");
    } else {
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
    }
  } catch (e) {
    alert("Error loading records from storage.");
    console.log(e);
  }
}

// Sets the recordIndexToEdit attribute of btnSubmitNewRecord to
// the index to be edited, updates the button to "Edit", and
// refreshes the button.
function callEdit(index) {
  $("#btnSubmitNewRecord").attr("recordIndexToEdit", index);
  $("#btnSubmitNewRecord").val("Edit");
  $("#btnSubmitNewRecord").button();
  $("#btnSubmitNewRecord").button("refresh");
}

// Gets record at a given index and populates those values in the form
function showRecordForm(index) {
  try {
    const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
    const rec = tbRecords[index];

    $("#dtEntryDate").val(rec.Date);
    $("#sldMinutes").val(rec.Minutes);
    $("#sldHours").val(rec.Hours);
    $("#sldMinutes").slider("refresh");
    $("#sldHours").slider("refresh");
  } catch (e) {
    alert("Error loading tbRecords from storage.");
    console.log(e);
  }
}

// Updates values at an index in tbRecords with new values.
// Returns true if successful, false upon failure.
function editRecord(index) {
  if (checkRecordForm()) {
    try {
      const tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
      tbRecords[index] = {
        Date: $("#dtEntryDate").val(),
        Minutes: $("#sldMinutes").val(),
        Hours: $("#sldHours").val(),
      };

      tbRecords.sort(dateComparer);
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
      alert("Saving Information");
      clearRecordForm();
      listRecords();

      return true;
    } catch (e) {
      alert("Error modifying record in storage.");
      console.log(e);

      return false;
    }
  } else {
    return false;
  }
}
