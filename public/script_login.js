document.addEventListener("DOMContentLoaded", function() {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.addEventListener("click", loginUser);
});

async function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  // Empty validation checks
  if (!username || !password) {
    alert("Please fill in both username and password.");
    return;
}

    const data = {
        username: username,
        password: password
    };

    try {
        const response = await fetch("https://income-mining.onrender.com/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.success) {
            const responseData = await response.json();
            console.log("Login successful:", responseData);
            // You can perform further actions here, such as redirecting the user.
        } else {
            console.error("Login failed:", response.statusText);
            // Handle error cases here.
        }
    } catch (error) {
        console.error("An error occurred:", error);
        // Handle error cases here.
    }
}
