
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formElements = event.target.elements;

    const formData = {
         username: formElements.username.value,
        password: formElements.password.value,
    };

    // Check if all the required fields are filled
    if (validateLoginForm(formData)) {
        console.log("inside valid");

        LoginUser(formData);
    } else {
        // Display a message to the user indicating that all required fields must be filled.
        alert("fill in all the required fields.");
    }
});

function LoginUser(formData) {

         fetch('https://income-mining.onrender.com/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
        // Assuming "data" is an object with a property "result" that contains the desired data
        console.log("Login Response data:", data);
        const resultData = data.message;
        if (data.success) {
           console.log( data.token);
        }else{
            console.log("something went wrong");
        }
  
            })
            .catch(error => {
                console.error('Error:', error);
            });
}


function validateLoginForm(formData) {
    // List of required field names
    const requiredFields = [ "username", "password"];

    for (const field of requiredFields) {
        if (!formData[field] || formData[field] === "") {
            return false;
        }
    }


    return true;
}

