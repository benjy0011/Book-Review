// Select the form element
const addBookForm = document.getElementById('addBookForm');

// Listen for the form submit event 
addBookForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the rating value 
    const ratingValue = document.getElementById('ratingValue').value;

    // Check if the user selected a rating
    if (!ratingValue) {
        alert('Please select a rating befoe submitting the form.')
        return; // Stop form submission
    }

    // Collect the form data
    // as req body
    const formData = new FormData(addBookForm);


    try {
        // Send a POST request to the server with the form data
        const formDataObj = Object.fromEntries(formData.entries());

        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObj),
        });

        // If response is OK, redirect to the main book page
        if (response.ok) {
            // Notify the user of success
            alert('New book added successfully!');  // Show success message
            window.location.href = '/books'; // Redirect to main
        } else {
            // If response is not OK
            const errorData = await response.json(); // Get the error message
            console.error('Error adding book: ', errorData.message);
            displayError(errorData.message); // Display error to user
        }
    } catch (error) {
        // Catches network errors or any other unexpected errors
        console.error('Network error: ', error.message);
        displayError(error.message);
    }
});

// Function to display error messages to the user (may further customize as needed)
function displayError(errorMessage) {
    alert(errorMessage);
}