// Fetch books from the server and display them
async function fetchBooks() {
    try {
        // GET request to the server to retrieve the list of books
        const response = await fetch('/api/books'); // Get all books route
        console.log(response);
        // Parse the response as JSON to get the book data
        const books = await response.json();
        console.log(books);
        displayBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        alert('Error fetching books:', error);
    }
}

// Function to render books dynamically in the gallery
function displayBooks(books) {
    // Select the container element where books will be displayed
    const booksContainer = document.getElementById('booksContainer');
    // Clear any existing content in the books container
    booksContainer.innerHTML = '';

    // Loop through each book object in the books array
    books.forEach(book => {
        // Create a new div element for each book
        const bookItem = document.createElement('div');
        // Assign the 'book-item' class for styling the book element
        bookItem.className = 'book-item';

        // Set the HTML content of the book item, including book cover, title author, and rating
        bookItem.innerHTML = `
            <div class="book-cover" style="background-image: url('${book.BookImage}')">
                <!-- Overlay div to show rating when hovered -->
                <div class="book-overlay">
                    <div class="rating-container">
                        <div class="book-rating>${getStarIcons(book.averageRating)}</div>
                    </div>
                </div>
            </div>
            <!-- Display the book's title and author below the cover image -->
            <div class="book-info">
                <p class="book-title">${book.BookName}</p>
                <p class="book-author">${book.BookAuthor}</p>
            </div>
        `;

        // Add a click event listener to each book item
        // When clicked, the user is redirected to the book details page
        bookItem.addEventListener('click', () =>{
            // Redirect to the book details page for the selected book
            window.location.href = `/books/${book.id}`;
        });

        // Append the book item to the books container
        booksContainer.appendChild(bookItem);
    });
}

// Function to generate star icons based on the rating value
function getStarIcons(rating) {
    let stars = ''; // Initialize an empty string for stars
    const wholeStars = Math.floor(rating); // Numbe of whole stars
    const hasHalfStar = rating % 1 >= 0.5// Check if there is a half star
    const fullStarsCount = hasHalfStar ? wholeStars + 1 : wholeStars; // Total stars to display

    // Add filled stars based on whole number rating
    for (let i= 0; i <= wholeStars; i++) {
        stars += '<i class="ri-star-fill" style="color: #FFD700;"></i>'
    }

    // Add half star if necessary
    if (hasHalfStar) {
        stars += '<i class="ri-star-half-fill" style="color: #FFD700;"></i>'
    }

    // Add empty stars for remaining stars up to 5
    for (let i = fullStarsCount; i < 5; i++) {
        stars += '<i class="ri-star-line" style="color: #FFD700;"></i>'
    }

    // Return stars with numerical rating next to it
    return `${stars} <span class="rating-number">(${rating}/5.0)</span>`;
}


// Call the fetchBooks to load and dsiplay books as soon as the page loads
fetchBooks();

