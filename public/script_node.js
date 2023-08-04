// Function to handle form submission
document.getElementById("registrationForm").addEventListener("submit",async function(event) {
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

    const sponsor_id = "64c00b6a849a379cc91b4ab4";
    // Use await to wait for the fetchAssignedID function to complete before proceeding
    await fetchAssignedID(formData, sponsor_id);
} else {
    // Display a message to the user indicating that all required fields must be filled.
    alert("Please fill in all the required fields.");
}
});

async function fetchAssignedID(formData, sponsor_id) {
if (!formData.parent_id || formData.parent_id.trim() === "") {
    const postData = {
        sponsor_id: sponsor_id,
        position: formData.position,
    };
    formData.parent_id = sponsor_id;

    // Use await to wait for the performPostRequest function to complete before proceeding
    await performPostRequest(formData, postData);
} else {
    const postData = {
        sponsor_id: formData.parent_id,
        position: formData.position,
    };
   
    // Use await to wait for the performPostRequest function to complete before proceeding
    await performPostRequest(formData, postData);
}
}

async function performPostRequest(formData, postData) {
try {
    const response = await fetch("https://income-mining.onrender.com/api/users/assignUplineId", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
    });

    const data = await response.json();
    const { upline_id, success } = data;
    if (success) {
        formData.upline_id = upline_id;
        // Use await to wait for the fetch request to complete before proceeding
        const registerResponse = await fetch('https://income-mining.onrender.com/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const registerData = await registerResponse.json();
        console.log('API Response:', registerData);
        // Handle the API response here if needed
    }
} catch (error) {
    console.error('Error:', error);
    // Handle errors here if needed
}
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