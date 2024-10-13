
// Select elements for modal handling
const filterModal = document.getElementById('filterModal');
const filterBtn = document.getElementById('filterBtn');
const closeModal = document.querySelector('.close'); // Return the first that relates
const applyFilterBtn = document.getElementById('applyFilter');

// Event listener op open modal on filter button click
filterBtn.addEventListener('click', () => {
    filterModal.style.display = 'block'; // Show modal 
});

// Event listener to close nodal on 'X' button click
closeModal.addEventListener('click', () => {
    filterModal.style.display = 'none'; // Hide modal
});

// Event listener to close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === filterModal) {
        filterModal.style.display = 'none'; // Hide modal if clicking outside content area
    }
});

// Apply filter when clicking the 'Apply Filter' button
applyFilterBtn.addEventListener('click', async () => {
    const filterBy = document.getElementById('filterBy').value; // Get selected filter option
    const order = document.getElementById('order').value; //Get selected order option

    try {
        // Fetch filtered books based on selected criteria
        const response = await fetch(`/api/books?filterBy=${filterBy}&order=${order}`);
        const books = await response.json(); // Parse the JSON response

        console.log(books); // Check the structure of books

        displayBooks(books); // Render books
    } catch (error) {
        console.error('Error filtering books:', error); //Log any error
        alert('Error filtering books:', error)
    }

    filterModal.style.display = 'none'; // Hide modal after applying filter
});