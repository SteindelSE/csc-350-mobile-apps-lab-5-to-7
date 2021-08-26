/*
  Name: Derek Steindel
  Date: 8/5/21
  Assignment: Week 5 Lab - Casual Screen Time Tracker
*/

// Leads our button click for form submission by ensuring the
// information is checked for errors before saving the info
// to our storage location. We could have done
// onclick="saveUserForm();" but this is more secure as it
// doesn't provide function names to those viewing the HTML
// source
$("#btnSubmitUpdatedUserInfo").click(function () {
  saveUserForm();
});

// Checks the user form to ensure that everything is filled in
// and has appropriate values for the given field
function checkUserForm() {
  // --Required text inputs shouldn't be blank.
  if (
    [
      $("#txtFirstName").val(),
      $("#txtLastName").val(),
      $("#dateBirthday").val(),
      $("#txtNewPIN").val(),
    ].includes("")
  ) {
    alert(
      "You must provide a First Name, Last Name, Birthday, and a new PIN number. You may reuse your old PIN number."
    );
    return false;
  } else {
    // --Date of birth (if included) should occur before today
    // --For any select menus, ensure a value has been selected
    // We add 1 day to ensure the date isn't today's since
    // it is specifically required by the assignment.
    let birthdate = new Date($("#dateBirthday").val());
    birthdate.setDate(birthdate.getDate() + 1);
    if (birthdate >= Date.now()) {
      alert("Birthday must be before today.");
      return false;
    } else {
      // --Ensure numeric inputs fall within a logical range.
      // We could yet check for the desired screen time per day
      // using the value of sldMaxHoursPerDay as I've demonstrated
      // in previous labs, but since sliders automatically clamp
      // to min and max values, this is unnecessary.
      return true;
    }
  }
}

// Saves the information in the form to the users profile after
// ensuring the inputs are valid
function saveUserForm() {
  if (checkUserForm()) {
    // Set up the user object.
    const user = {
      FirstName: $("#txtFirstName").val(),
      LastName: $("#txtLastName").val(),
      Birthdate: $("#dateBirthday").val(),
      PIN: $("#txtNewPIN").val(),
      HoursGoal: $("#sldMaxHoursPerDay").val(),
    };

    // Try to save the user object and alert if issues arise.
    try {
      localStorage.setItem("user", JSON.stringify(user));
      alert("Saving Information");

      $.mobile.changePage("#page-menu");
      window.location.reload();
    } catch (e) {
    alert("Error saving user information to storage.");
    console.log(e);
    }
  }
}

// Retrieves user information from storage if available and
// displays it on the User Information form.
function showUserForm() {
  let user = null;

  // Try getting user object back from storage.
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    alert("Error loading from user information from storage.");
    console.log(e);
  }

  // If the user object exists and isn't a null reference
  // update the form information with the user info.
  if (user != null) {
    $("#txtFirstName").val(user.FirstName);
    $("#txtLastName").val(user.LastName);
    $("#dateBirthday").val(user.Birthdate);
    $("#txtNewPIN").val(user.PIN);
    $("#sldMaxHoursPerDay").val(user.HoursGoal);
    $("#sldMaxHoursPerDay").slider("refresh");
  }
}
