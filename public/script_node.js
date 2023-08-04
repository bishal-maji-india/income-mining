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

        const sponsor_id = "64c00b6a849a379cc91b4ab4";
        fetchAssignedID(formData, sponsor_id);
    } else {
        // Display a message to the user indicating that all required fields must be filled.
        alert("Please fill in all the required fields.");
    }
});

function fetchAssignedID(formData, sponsor_id) {
    if (!formData.parent_id || formData.parent_id.trim() === "") {
        const postData = {
            sponsor_id: sponsor_id,
            position: formData.position,
        };
        formData.parent_id = sponsor_id;
        performPostRequest(formData, postData);
    } else {
        const postData = {
            sponsor_id: formData.parent_id,
            position: formData.position,
        };
        performPostRequest(formData, postData);
    }
}

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
            formData.upline_id = upline_id;
            fetch('https://income-mining.onrender.com/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
        // Assuming "data" is an object with a property "result" that contains the desired data
        console.log("Response data:", data);
        const resultData = data.message;
        console.log("result"+resultData);
    // Encode the data to be passed as URL parameter
    const encodedData = encodeURIComponent(JSON.stringify(resultData));

    // Construct the URL with the encoded data parameter
    const registerResultURL = `http://127.0.0.1:5501/public/register_result.html?data=${encodedData}`;

    // Redirect to the register-result page with the data
    // window.location.href = registerResultURL;
  
                // Handle the API response and navigate to register-result page 
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

    // Check for the position field only when the "positionCheckbox" is present
    if (document.getElementById("positionCheckbox")) {
        const positionElements = document.querySelectorAll('input[name="position"]');
        if (!Array.from(positionElements).some(el => el.checked)) {
            return false;
        }
    }

    return true;
}


//register result page

