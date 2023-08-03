// Function to handle form submission
document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formElements = event.target.elements;

    const formData = {
        email: formElements.email.value,
        mobile: formElements.mobile.value,
        name: formElements.name.value,
        username: formElements.username.value,
        password: formElements.password.value,
        pan: formElements.pan.value,
        parent_id: formElements.parent_id.value,
        address: formElements.address.value,
        city: formElements.city.value,
        state: formElements.state.value,
        country: formElements.country.value,
        pin: formElements.pin.value,
        position: (document.querySelector('input[name="position"]:checked') || {}).value || "left",
      };
 // Check if all the required fields are filled
 if (validateForm(formData)) {
    console.log("inside valid");
        // Use AJAX to make the API request
       fetchAssignedID(formData,formElements);
    } else {
        // Display a message to the user indicating that all required fields must be filled.
        alert("Please fill in all the required fields.");
    }
});

// Function to fetch the parent ID using GET request
function fetchAssignedID(formData,formElements) {

    if (!formData.parent_id || formData.parent_id.trim() === "") {

        const solid = "64c00b6a849a379cc91b4ab4";
        const postData = {
            sponsor_id: solid,
            position: formData.position,
        };
        performPostRequest(formData, postData);
    } else {
        const postData = {
            sponsor_id: formData.parent_id,
            position: formData.position,
        };
        performPostRequest(formData, postData);
    }
}

// Function to perform the POST request
function performPostRequest(formData, postData) {
  

    fetch("https://income-mining.onrender.com/api/users/assignUplineId", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
    })
    .then((response) => response.json())
    .then((data) => {
        const { upline_id, success } = data;
        if (success) {
            console.log(upline_id);
            formData.upline_id = upline_id;
            // Use AJAX to make the POST request
            fetch('https://income-mining.onrender.com/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);
                // Handle the API response here if needed
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors here if needed
            });
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function validateForm(formData) {
// List of required field names
const requiredFields = ["email", "mobile", "name", "username", "password", "address", "city", "state", "pin", "country"];

for (const field of requiredFields) {
if (!formData[field] || formData[field] === "") {
    return false;
}
}

// Check for the position field only when the "positionCheckbox" Cis present
if (document.getElementById("positionCheckbox")) {
const positionElements = document.querySelectorAll('input[name="position"]');
if (!Array.from(positionElements).some(el => el.checked)) {
    return false;
}
}

return true;
}