
  // // Function to retrieve the data from the URL parameter
  // function getDataFromURL() {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const encodedData = urlParams.get('data');

  //   // Decode the data and parse it as JSON
  //   const decodedData = JSON.parse(decodeURIComponent(encodedData));

  //   // Assuming "decodedData" is an object with a property "h2Field" that contains the data for the H2 field
  //   const h2Data = decodedData.h2Field;

  //   // Display the data in the H2 field
  //   document.getElementById('result-field').textContent = h2Data;
  // }

  // // Call the function to retrieve and display the data when the page loads
  // getDataFromURL();


  // Get the URL parameter named 'data'
const urlParams = new URLSearchParams(window.location.search);
const encodedData = urlParams.get('data');

if (encodedData) {
    // Decode the data and parse it as JSON
    const decodedData = JSON.parse(decodeURIComponent(encodedData));

    // Now you can use the decodedData as needed
    console.log("dasta"+decodedData);
    

    const jsonString = JSON.stringify(decodedData, null, 2); // Using pretty-printing with 2 spaces
 
    document.getElementById('result-field').textContent = jsonString;
} else {
  document.getElementById('result-field').textContent = "error is hapen";
}

