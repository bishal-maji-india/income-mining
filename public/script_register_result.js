
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
 // Function to retrieve the message from the URL parameter
 function getMessageFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
 
     // Check if the URL parameter "message" is present
     const messageParam = urlParams.get('message');
     if (messageParam !== null) {
      try {
        // Attempt to parse the messageParam as JSON
        const parsedMessage = JSON.parse(decodeURIComponent(messageParam));
  
        // If successful, display the parsed message in the result field
        document.getElementById('result-field').textContent = parsedMessage;
      } catch (error) {
        // If parsing as JSON fails, treat it as plain text and display it
        document.getElementById('result-field').textContent = decodeURIComponent(messageParam);
      }
    } else {
      document.getElementById('result-field').textContent = "Something went wrong";
    }
  }
  
  // Call the function to retrieve and display the message when the page loads
  getMessageFromURL();
